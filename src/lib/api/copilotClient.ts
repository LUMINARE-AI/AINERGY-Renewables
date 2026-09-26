import type {
  AgentChatRequest,
  AgentChatResponse,
  BillExtractionResult,
  ChatMessage,
  EnergyProfile,
  EnergyReport,
  ExtractBillResponse,
  FinancialAnalysisAssumptions,
  LandedCostRequest,
  LandedCostResponse,
  NextQuestionResponse,
  RecommendationRoute,
  RecommendationsResponse,
  StateCatalogEntry,
} from "@/lib/copilot/types";

const REQUEST_TIMEOUT_MS = 90_000;
const CHAT_TIMEOUT_MS = 120_000;
const WAKE_NOTICE_AFTER_MS = 6_000;
export const MAX_CHAT_MESSAGES = 40;
export const COPILOT_WAKING_MESSAGE =
  "The system is waking up. Please wait — this usually takes under a minute.";
export const COPILOT_STILL_WAKING_MESSAGE =
  "The system is still waking up. Wait a moment, then try again.";

export class CopilotApiError extends Error {
  status?: number;
  code?: string;
  issues?: unknown[];
  waking?: boolean;

  constructor(message: string, status?: number, code?: string, issues?: unknown[], waking = false) {
    super(message);
    this.name = "CopilotApiError";
    this.status = status;
    this.code = code;
    this.issues = issues;
    this.waking = waking;
  }
}

type WakeListener = (waking: boolean) => void;
const wakeListeners = new Set<WakeListener>();
let wakeDepth = 0;

function setWakeDepth(next: number) {
  wakeDepth = Math.max(0, next);
  const waking = wakeDepth > 0;
  wakeListeners.forEach((listener) => listener(waking));
}

export function subscribeCopilotWaking(listener: WakeListener): () => void {
  wakeListeners.add(listener);
  listener(wakeDepth > 0);
  return () => {
    wakeListeners.delete(listener);
  };
}

export function normalizeApiBaseUrl(raw: string | undefined | null): string | null {
  if (!raw || !raw.trim()) return null;
  const cleaned = raw
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .trim()
    .replace(/\/+$/, "");
  return cleaned || null;
}

export function getCopilotBaseUrl(): string | null {
  return normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
}

export function trimMessages<T extends ChatMessage>(messages: T[]): T[] {
  if (messages.length <= MAX_CHAT_MESSAGES) return messages;
  return messages.slice(-MAX_CHAT_MESSAGES);
}

function detailToText(detail: unknown): string | null {
  if (typeof detail === "string" && detail.trim()) return detail;
  if (!Array.isArray(detail)) return null;
  const parts = detail
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "msg" in item) {
        const loc = Array.isArray((item as { loc?: unknown }).loc)
          ? (item as { loc: unknown[] }).loc.filter((part) => part !== "body").join(".")
          : "";
        const msg = String((item as { msg: unknown }).msg);
        return loc ? `${loc}: ${msg}` : msg;
      }
      return null;
    })
    .filter((part): part is string => Boolean(part));
  return parts.length ? parts.join("; ") : null;
}

export function messageFromErrorBody(data: unknown, status: number): string {
  if (status === 501) {
    return "Chat is not set up yet; you can still use the calculator.";
  }

  if (data && typeof data === "object") {
    const record = data as { message?: unknown; detail?: unknown; error?: unknown };
    if (typeof record.message === "string" && record.message.trim()) return record.message;
    const detail = detailToText(record.detail);
    if (detail) return detail;
  }

  if (status === 413) return "That file is too large. The limit is 15 MB.";
  if (status === 404) return "We could not find that report.";
  if (status === 422) return "Some of those details are missing or invalid.";
  return `The copilot request failed (${status}).`;
}

function isTransient(err: unknown): boolean {
  if (!(err instanceof CopilotApiError)) return false;
  if (err.status === 502 || err.status === 503 || err.status === 504) return true;
  return err.status == null && err.message.startsWith("Could not reach the copilot.");
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestOnce<T>(path: string, init?: RequestInit, timeoutMs = REQUEST_TIMEOUT_MS): Promise<T> {
  const base = getCopilotBaseUrl();
  if (!base) {
    throw new CopilotApiError("Copilot API URL is not configured. Set NEXT_PUBLIC_API_BASE_URL.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = new Headers(init?.headers);
    headers.set("Accept", "application/json");
    const isForm = typeof FormData !== "undefined" && init?.body instanceof FormData;
    if (isForm) headers.delete("Content-Type");
    else if (init?.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const res = await fetch(`${base}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    });

    const text = await res.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!res.ok) {
      const record =
        data && typeof data === "object"
          ? (data as { error?: unknown; issues?: unknown })
          : undefined;
      throw new CopilotApiError(
        messageFromErrorBody(data, res.status),
        res.status,
        typeof record?.error === "string" ? record.error : undefined,
        Array.isArray(record?.issues) ? record.issues : undefined
      );
    }

    return data as T;
  } catch (err) {
    if (err instanceof CopilotApiError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new CopilotApiError(COPILOT_STILL_WAKING_MESSAGE, undefined, undefined, undefined, true);
    }
    throw new CopilotApiError("Could not reach the copilot. Check your connection and try again.");
  } finally {
    clearTimeout(timeout);
  }
}

function asWakeFailure(err: CopilotApiError): CopilotApiError {
  if (err.waking) return err;
  return new CopilotApiError(COPILOT_STILL_WAKING_MESSAGE, err.status, err.code, err.issues, true);
}

// Render spins the API down when idle. The first browser call is often reset
// or sits idle while the process wakes. Tell the UI, then retry before an error.
async function request<T>(path: string, init?: RequestInit, timeoutMs = REQUEST_TIMEOUT_MS): Promise<T> {
  const pauses = [2_000, 4_000];
  let marked = false;
  const markWaking = () => {
    if (marked) return;
    marked = true;
    setWakeDepth(wakeDepth + 1);
  };
  const wakeTimer = setTimeout(markWaking, WAKE_NOTICE_AFTER_MS);

  try {
    for (let attempt = 0; attempt <= pauses.length; attempt += 1) {
      try {
        return await requestOnce<T>(path, init, timeoutMs);
      } catch (err) {
        const giveUp = !isTransient(err) || attempt === pauses.length;
        if (giveUp) {
          if (err instanceof CopilotApiError && (err.waking || isTransient(err))) throw asWakeFailure(err);
          throw err;
        }
        markWaking();
        await delay(pauses[attempt]);
      }
    }
    throw new CopilotApiError(COPILOT_STILL_WAKING_MESSAGE, undefined, undefined, undefined, true);
  } finally {
    clearTimeout(wakeTimer);
    if (marked) setWakeDepth(wakeDepth - 1);
  }
}

function postJson<T>(path: string, payload: unknown, timeoutMs?: number): Promise<T> {
  return request<T>(
    path,
    { method: "POST", body: JSON.stringify(payload) },
    timeoutMs
  );
}

export function getHealth(): Promise<{ ok: boolean }> {
  return request("/health");
}

export async function getStates(): Promise<StateCatalogEntry[]> {
  const data = await request<{ states?: StateCatalogEntry[] }>("/states");
  return Array.isArray(data.states) ? data.states : [];
}

export async function extractBill(file: File): Promise<BillExtractionResult> {
  const body = new FormData();
  body.append("file", file);
  const data = await request<ExtractBillResponse>(
    "/extract-bill",
    { method: "POST", body },
    CHAT_TIMEOUT_MS
  );
  return data.extraction;
}

export function nextQuestion(profile: EnergyProfile): Promise<NextQuestionResponse> {
  return postJson("/profile/next-question", { profile });
}

export function getRecommendations(
  profile: EnergyProfile,
  analysisAssumptions: FinancialAnalysisAssumptions = {}
): Promise<RecommendationsResponse> {
  return postJson("/recommendations", { profile, analysisAssumptions });
}

export async function getLandedCost(body: LandedCostRequest): Promise<LandedCostResponse["result"]> {
  const data = await postJson<LandedCostResponse>("/landed-cost", body);
  return data.result;
}

export function chat(payload: AgentChatRequest): Promise<AgentChatResponse> {
  return postJson(
    "/agent",
    { ...payload, messages: trimMessages(payload.messages) },
    CHAT_TIMEOUT_MS
  );
}

export function createReport(body: {
  profile: EnergyProfile;
  analysisAssumptions?: FinancialAnalysisAssumptions;
  selectedRoute?: RecommendationRoute | string | null;
}): Promise<EnergyReport> {
  return postJson("/reports", {
    profile: body.profile,
    analysisAssumptions: body.analysisAssumptions ?? {},
    ...(body.selectedRoute ? { selectedRoute: body.selectedRoute } : {}),
  });
}

export function getReport(reportId: string): Promise<EnergyReport> {
  return request(`/reports/${encodeURIComponent(reportId)}`);
}
