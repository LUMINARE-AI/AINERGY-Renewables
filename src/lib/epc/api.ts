import type {
  EstimateRequest,
  EstimateResponse,
  RateCardEntry,
  ScopeOption,
  StateOption,
} from "./types";

const REQUEST_TIMEOUT_MS = 90_000;

export class EpcApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "EpcApiError";
    this.status = status;
  }
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

export function getApiBaseUrl(): string | null {
  return normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);
}

export function parseFastApiDetail(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const detail = (data as { detail?: unknown }).detail;
  if (typeof detail === "string" && detail.trim()) return detail;
  if (Array.isArray(detail)) {
    const parts = detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "msg" in item) {
          const loc = Array.isArray((item as { loc?: unknown }).loc)
            ? (item as { loc: unknown[] }).loc
                .filter((part) => part !== "body")
                .join(".")
            : "";
          const msg = String((item as { msg: unknown }).msg);
          return loc ? `${loc}: ${msg}` : msg;
        }
        return null;
      })
      .filter((part): part is string => Boolean(part));
    return parts.length ? parts.join("; ") : null;
  }
  return null;
}

function isClientError(status?: number): boolean {
  return status !== undefined && status >= 400 && status < 500;
}

async function requestOnce<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new EpcApiError(
      "API URL is not configured. Set NEXT_PUBLIC_API_URL to the estimator backend."
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const headers = new Headers(init?.headers);
    headers.set("Accept", "application/json");
    if (init?.body && !headers.has("Content-Type")) {
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
        data = text;
      }
    }

    if (!res.ok) {
      const detail = parseFastApiDetail(data);
      const fallback =
        res.status === 422
          ? "The estimator rejected this request. Check the inputs and try again."
          : `Estimator request failed (${res.status}).`;
      throw new EpcApiError(detail || fallback, res.status);
    }

    return data as T;
  } catch (err) {
    if (err instanceof EpcApiError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new EpcApiError(
        "The estimator took too long to respond. The service may be waking up — try again."
      );
    }
    throw new EpcApiError(
      "Could not reach the estimator. Check your connection and try again."
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    return await requestOnce<T>(path, init);
  } catch (err) {
    if (err instanceof EpcApiError && isClientError(err.status)) {
      throw err;
    }
    return requestOnce<T>(path, init);
  }
}

function asArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    for (const key of ["items", "data", "states", "scopes", "results"]) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }
  }
  return [];
}

export async function getStates(): Promise<StateOption[]> {
  const data = await fetchJson<unknown>("/api/v1/config/states");
  return asArray<StateOption>(data).filter((item) => item?.value && item?.label);
}

export async function getScopes(): Promise<ScopeOption[]> {
  const data = await fetchJson<unknown>("/api/v1/config/scopes");
  return asArray<ScopeOption>(data).filter((item) => item?.value && item?.label);
}

export async function postEstimate(
  body: EstimateRequest
): Promise<EstimateResponse> {
  return fetchJson<EstimateResponse>("/api/v1/estimate", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function flattenRateCard(data: unknown, prefix = ""): RateCardEntry[] {
  if (data == null) return [];
  if (Array.isArray(data)) {
    return data.flatMap((item, index) => {
      if (item && typeof item === "object") {
        const row = item as Record<string, unknown>;
        const label =
          (typeof row.label === "string" && row.label) ||
          (typeof row.key === "string" && row.key) ||
          (typeof row.name === "string" && row.name) ||
          `${prefix || "Item"} ${index + 1}`;
        const rs =
          typeof row.rs_per_wp === "number"
            ? row.rs_per_wp
            : typeof row.rs_per_wp_dc === "number"
              ? row.rs_per_wp_dc
              : typeof row.rate === "number"
                ? row.rate
                : undefined;
        const value =
          rs === undefined && row.value != null ? String(row.value) : undefined;
        return [
          {
            key: String(row.key ?? `${prefix}${index}`),
            label,
            rs_per_wp: rs,
            value,
          },
        ];
      }
      return [
        {
          key: `${prefix}${index}`,
          label: prefix || "Rate",
          rs_per_wp: undefined,
          value: String(item),
        },
      ];
    });
  }
  if (typeof data === "object") {
    return Object.entries(data as Record<string, unknown>).flatMap(
      ([key, value]) => {
        if (value && typeof value === "object") {
          return flattenRateCard(value, prefix ? `${prefix} / ${key}` : key);
        }
        const numeric = typeof value === "number" ? value : undefined;
        return [
          {
            key: prefix ? `${prefix}.${key}` : key,
            label: prefix ? `${prefix} · ${key.replace(/_/g, " ")}` : key.replace(/_/g, " "),
            rs_per_wp: numeric,
            value: numeric === undefined ? String(value) : undefined,
          },
        ];
      }
    );
  }
  return [{ key: "rate", label: "Rate card", rs_per_wp: undefined, value: String(data) }];
}

export async function getRateCard(): Promise<RateCardEntry[] | null> {
  try {
    const data = await fetchJson<unknown>("/api/v1/config/rate-card");
    const entries = flattenRateCard(data);
    return entries.length ? entries : null;
  } catch {
    return null;
  }
}
