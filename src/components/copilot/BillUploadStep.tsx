"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  X,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Gauge,
  IndianRupee,
  Zap,
  Activity,
} from "lucide-react";
import { CopilotApiError, extractBill } from "@/lib/api/copilotClient";
import {
  formatProfileValue,
  isProfileNumberField,
  profileFieldLabel,
  profileFieldSuffix,
} from "@/lib/copilot/format";
import { compactProfile } from "@/lib/copilot/profile";
import type { BillExtractionResult, EnergyProfile, StateCatalogEntry } from "@/lib/copilot/types";
import { CONSUMER_TYPES, VOLTAGE_LEVELS } from "@/lib/copilot/types";
import { cn } from "@/lib/utils";
import { ErrorNote, LoadingNote } from "./ApiState";

const MAX_BYTES = 15 * 1024 * 1024;

const SCAN_MESSAGES = [
  "Reading your sanctioned load…",
  "Finding your tariff category…",
  "Adding up units consumed…",
  "Checking voltage level…",
  "Cross-checking the totals…",
];

const EXTRACT_FIELDS = [
  { label: "Sanctioned load", hint: "kVA from the bill", icon: Gauge },
  { label: "Tariff", hint: "Effective ₹/kWh", icon: IndianRupee },
  { label: "Monthly units", hint: "kWh consumed", icon: Zap },
  { label: "Voltage & DISCOM", hint: "Wheeling class", icon: Activity },
] as const;

const PROFILE_ORDER: (keyof EnergyProfile)[] = [
  "state",
  "consumerType",
  "voltageLevel",
  "utilityOrDiscom",
  "sanctionedLoadKva",
  "sanctionedLoadKw",
  "monthlyConsumptionKwh",
  "monthlyBillRs",
  "fixedChargesRs",
  "gridTariffRsPerKwh",
  "gridTariffInclFixedRsPerKwh",
  "gridTariffExclFixedRsPerKwh",
  "roofAreaSqM",
  "rooftopCapacityKw",
  "targetRenewableSharePct",
];

const inputClass =
  "w-full rounded-lg border border-current-500/40 bg-white px-2.5 py-1.5 text-sm text-ink-900 focus:outline-none";

function stateChoices(states: StateCatalogEntry[], current: string | null | undefined): string[] {
  const names = states.map((entry) => entry.state);
  if (current && !names.includes(current)) names.push(current);
  return names;
}

function fieldsToEdit(extraction: BillExtractionResult): (keyof EnergyProfile)[] {
  const extracted = new Set(extraction.extractedFields);
  return PROFILE_ORDER.filter((key) => {
    const value = extraction.profile[key];
    return extracted.has(key) || (value != null && value !== "");
  });
}

function BillSilhouette({
  status,
  file,
  dragOver,
}: {
  status: "idle" | "reading" | "done" | "error";
  file: File | null;
  dragOver: boolean;
}) {
  const rows = [88, 64, 76, 52, 70, 40];

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[18rem] transition-transform duration-500",
        dragOver && "scale-[1.02]"
      )}
    >
      <div className="absolute -inset-6 rounded-[2rem] bg-current-400/10 blur-2xl" />
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-white shadow-premium-lg",
          dragOver ? "border-current-500/50" : "border-ink-900/10"
        )}
      >
        <div className="flex items-center justify-between bg-ink-900 px-4 py-2.5">
          <span className="font-mono-tag text-[9px] uppercase tracking-[0.18em] text-paper-50/80">
            Electricity bill
          </span>
          <span className="rounded-full bg-current-400/20 px-2 py-0.5 font-mono-tag text-[8px] uppercase text-current-300">
            C&I
          </span>
        </div>
        <div className="relative min-h-[15.5rem] bg-[linear-gradient(rgba(8,121,127,0.04)_1px,transparent_1px)] bg-[size:100%_1.35rem] px-4 py-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-2 w-24 rounded-full bg-ink-900/10" />
            <div className="h-2 w-10 rounded-full bg-current-400/25" />
          </div>
          <div className="space-y-2.5">
            {rows.map((width, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-current-500/30" />
                <div className="h-2 rounded-full bg-ink-900/[0.07]" style={{ width: `${width}%` }} />
              </div>
            ))}
          </div>
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center px-5 text-center",
              file || status === "reading" ? "bg-white/70 backdrop-blur-[2px]" : "bg-white/30 backdrop-blur-[1px]"
            )}
          >
            {status === "reading" ? (
              <>
                <FileText className="h-5 w-5 text-current-600" />
                <p className="mt-3 text-xs font-medium text-ink-800">Scanning bill</p>
              </>
            ) : file ? (
              <>
                <FileText className="h-8 w-8 text-current-600" />
                <p className="mt-3 max-w-[14rem] truncate text-sm font-medium text-ink-900">{file.name}</p>
                <p className="mt-1 text-[11px] text-ink-500">
                  {(file.size / 1024).toFixed(0)} KB — click to replace
                </p>
              </>
            ) : (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-current-500/40 bg-current-400/10 text-current-600">
                  <UploadCloud className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-medium text-ink-900">
                  {dragOver ? "Drop it — Copilot will read it" : "Drop your bill here"}
                </p>
                <p className="mt-1 text-[11px] text-ink-500">or click to browse</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileInput({
  field,
  value,
  states,
  onChange,
}: {
  field: keyof EnergyProfile;
  value: EnergyProfile[keyof EnergyProfile];
  states: StateCatalogEntry[];
  onChange: (raw: string) => void;
}) {
  const suffix = profileFieldSuffix(field);
  const stateEntry = field === "state" ? states.find((entry) => entry.state === value) : undefined;

  if (field === "state") {
    const options = stateChoices(states, typeof value === "string" ? value : null);
    return (
      <div>
        <select className={inputClass} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select a state</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {stateEntry?.anyPlaceholder && (
          <p className="mt-1.5 text-[11px] text-current-800">
            Tariff data for {stateEntry.state} is still a placeholder.
          </p>
        )}
      </div>
    );
  }

  if (field === "consumerType" || field === "voltageLevel") {
    const options = field === "consumerType" ? CONSUMER_TYPES : VOLTAGE_LEVELS;
    return (
      <select className={inputClass} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {field === "consumerType" ? formatProfileValue(field, option) : option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        className={inputClass}
        type={isProfileNumberField(field) ? "number" : "text"}
        step="any"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {suffix && <span className="shrink-0 text-xs text-ink-500">{suffix}</span>}
    </div>
  );
}

export function BillUploadStep({
  states,
  statesLoading,
  statesError,
  onRetryStates,
  onConfirm,
  onSkip,
}: {
  states: StateCatalogEntry[];
  statesLoading: boolean;
  statesError: string | null;
  onRetryStates: () => void;
  onConfirm: (profile: EnergyProfile, warnings: string[]) => void;
  onSkip: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "reading" | "done" | "error">("idle");
  const [scanMsgIdx, setScanMsgIdx] = useState(0);
  const [extraction, setExtraction] = useState<BillExtractionResult | null>(null);
  const [draft, setDraft] = useState<EnergyProfile>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = useCallback((next: File | null | undefined) => {
    if (!next) return;
    setFile(next);
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  async function handleRead() {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setErrorMessage("That file is too large. The limit is 15 MB.");
      setStatus("error");
      return;
    }

    setStatus("reading");
    setScanMsgIdx(0);
    setErrorMessage(null);
    const msgInterval = setInterval(() => {
      setScanMsgIdx((i) => (i + 1) % SCAN_MESSAGES.length);
    }, 1100);

    try {
      const result = await extractBill(file);
      setExtraction(result);
      setDraft(compactProfile(result.profile ?? {}));
      setStatus("done");
    } catch (err) {
      setErrorMessage(
        err instanceof CopilotApiError ? err.message : "Something went wrong reading that bill. Please try again."
      );
      setStatus("error");
    } finally {
      clearInterval(msgInterval);
    }
  }

  function updateField(field: keyof EnergyProfile, raw: string) {
    setDraft((prev) => {
      const next = { ...prev };
      if (!raw.trim()) {
        delete next[field];
        return next;
      }
      if (isProfileNumberField(field)) {
        const value = Number(raw);
        if (!Number.isFinite(value)) return prev;
        next[field] = value as never;
      } else {
        next[field] = raw as never;
      }
      return next;
    });
  }

  const visibleFields = extraction ? fieldsToEdit({ ...extraction, profile: draft }) : [];
  const activeFieldIdx = status === "reading" ? scanMsgIdx % EXTRACT_FIELDS.length : -1;

  return (
    <div className="overflow-hidden rounded-3xl border border-ink-900/10 bg-paper-50/80 shadow-premium backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4 border-b border-ink-900/8 px-6 py-5 lg:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-current-gradient text-paper-50 shadow-glow">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="font-mono-tag text-xs uppercase text-current-600">Energy Procure Copilot</span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-medium leading-tight tracking-tight text-ink-900 sm:text-3xl">
            Drop a bill. <em className="font-accent text-[1.06em] not-italic text-gold-600">Get a plan.</em>
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-700/80">
            Copilot reads tariff, load and consumption off your DISCOM bill, then compares grid, third-party,
            captive and group captive.
          </p>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="shrink-0 whitespace-nowrap pt-1 text-xs font-medium text-ink-600 underline decoration-ink-300 underline-offset-4 hover:text-current-600"
        >
          Skip, enter manually
        </button>
      </div>

      <AnimatePresence mode="wait">
        {status !== "done" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-10 lg:p-8"
          >
            <div className="space-y-5">
              <p className="font-mono-tag text-[10px] uppercase text-ink-500">What Copilot reads</p>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {EXTRACT_FIELDS.map((field, i) => {
                  const Icon = field.icon;
                  const active = activeFieldIdx === i;
                  return (
                    <li
                      key={field.label}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border px-3.5 py-3 transition-colors",
                        active ? "border-current-500/40 bg-current-400/10" : "border-ink-900/8 bg-paper-100/70"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          active ? "bg-current-500/15 text-current-700" : "bg-ink-900/5 text-current-600"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-ink-900">{field.label}</span>
                        <span className="mt-0.5 block text-[11px] text-ink-500">{field.hint}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>

              {status === "reading" && (
                <AnimatePresence mode="wait">
                  <motion.p
                    key={scanMsgIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-1.5 text-sm font-medium text-ink-800"
                    role="status"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-current-600" />
                    {SCAN_MESSAGES[scanMsgIdx]}
                  </motion.p>
                </AnimatePresence>
              )}

              {errorMessage && status === "error" && <ErrorNote message={errorMessage} onRetry={file ? handleRead : undefined} />}

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center">
                {file && status !== "reading" && (
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setStatus("idle");
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900/30"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  disabled={!file || status === "reading"}
                  onClick={handleRead}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-paper-50 transition-all hover:bg-current-600 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {status === "reading" ? "Reading…" : "Read my bill"}
                  {status !== "reading" && <Sparkles className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-ink-500">PDF, image or text — up to 15 MB. Extracted fields can be edited before the plan is built.</p>
            </div>

            <div
              role="button"
              tabIndex={0}
              aria-label="Upload electricity bill"
              aria-busy={status === "reading"}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              className={cn(
                "cursor-pointer rounded-3xl border-2 border-dashed px-5 py-8 transition-colors sm:px-8 sm:py-10",
                dragOver
                  ? "border-current-500 bg-current-400/10"
                  : "border-ink-900/12 bg-paper-100/50 hover:border-current-500/40 hover:bg-current-400/5"
              )}
            >
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,image/png,image/jpeg,image/webp,text/plain,.txt"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
              <BillSilhouette status={status} file={file} dragOver={dragOver} />
            </div>
          </motion.div>
        )}

        {status === "done" && extraction && (
          <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 p-6 lg:p-8">
            <p className="text-xs text-ink-600">
              Read from {extraction.source || "your bill"}. Correct anything that looks off.
            </p>

            {statesLoading && <LoadingNote label="Loading supported states…" />}
            {statesError && <ErrorNote message={statesError} onRetry={onRetryStates} />}

            {visibleFields.length === 0 ? (
              <p className="rounded-xl border border-dashed border-ink-900/15 px-4 py-6 text-sm text-ink-500">
                No fields were extracted. You can continue and answer the missing details one at a time.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleFields.map((field) => (
                  <label key={field} className="rounded-xl border border-ink-900/10 bg-paper-50 p-4">
                    <span className="font-mono-tag text-[10px] uppercase text-ink-500">{profileFieldLabel(field)}</span>
                    <div className="mt-2">
                      <ProfileInput field={field} value={draft[field]} states={states} onChange={(raw) => updateField(field, raw)} />
                    </div>
                  </label>
                ))}
              </div>
            )}

            {extraction.missingFields.length > 0 && (
              <p className="text-xs leading-relaxed text-ink-600">
                Still needed: {extraction.missingFields.map(profileFieldLabel).join(", ")}.
              </p>
            )}

            {extraction.warnings.length > 0 && (
              <div className="space-y-2">
                {extraction.warnings.map((warning) => (
                  <div
                    key={warning}
                    className="flex items-start gap-2.5 rounded-xl border border-current-500/25 bg-current-400/5 p-4 text-xs leading-relaxed text-ink-700"
                  >
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-current-600" />
                    {warning}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setFile(null);
                  setExtraction(null);
                  setDraft({});
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-900/15 px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900/30"
              >
                Try a different bill
              </button>
              <button
                type="button"
                onClick={() => onConfirm(compactProfile(draft), extraction.warnings)}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-paper-50 transition-all hover:bg-current-600 hover:shadow-glow"
              >
                Looks right — continue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
