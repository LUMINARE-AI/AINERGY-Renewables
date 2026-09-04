"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  PenLine,
  ArrowRight,
  Gauge,
  IndianRupee,
  Zap,
  Activity,
} from "lucide-react";
import type { BillExtraction } from "@/lib/billExtraction/schema";
import { cn } from "@/lib/utils";

export type ConfirmedBillProfile = {
  state: string;
  consumerType: string;
  voltageLevel: string;
  sanctionedLoadKva: number;
  monthlyConsumptionKwh: number;
  averageTariffRsPerKwh: number;
};

const SCAN_MESSAGES = [
  "Reading your sanctioned load…",
  "Finding your tariff category…",
  "Adding up units consumed…",
  "Checking wheeling & voltage level…",
  "Cross-checking the totals…",
];

const EXTRACT_FIELDS = [
  { label: "Sanctioned load", hint: "kVA from the bill", icon: Gauge },
  { label: "Average tariff", hint: "Effective ₹/kWh", icon: IndianRupee },
  { label: "Monthly units", hint: "kWh consumed", icon: Zap },
  { label: "Voltage & DISCOM", hint: "Wheeling class", icon: Activity },
] as const;

const FLOW_STEPS = [
  { n: "01", label: "Upload" },
  { n: "02", label: "Extract" },
  { n: "03", label: "Compare" },
  { n: "04", label: "Plan" },
] as const;

function ConfidencePill({ value }: { value: number }) {
  const tier = value >= 0.8 ? "high" : value >= 0.5 ? "medium" : "low";
  const styles = {
    high: "bg-forest-500/10 text-forest-700 border-forest-500/25",
    medium: "bg-current-400/15 text-current-700 border-current-500/30",
    low: "bg-red-500/10 text-red-700 border-red-500/25",
  }[tier];
  const label = { high: "High confidence", medium: "Verify", low: "Please check" }[
    tier
  ];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${styles}`}
    >
      {tier === "high" ? (
        <CheckCircle2 className="h-2.5 w-2.5" />
      ) : (
        <AlertTriangle className="h-2.5 w-2.5" />
      )}
      {label}
    </span>
  );
}

function EditableField({
  label,
  value,
  confidence,
  sourceNote,
  onChange,
  type = "number",
  options,
  suffix,
}: {
  label: string;
  value: string | number;
  confidence: number;
  sourceNote?: string | null;
  onChange: (v: string) => void;
  type?: "number" | "select" | "text";
  options?: readonly string[];
  suffix?: string;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="rounded-xl border border-ink-900/10 bg-paper-50 p-4 transition-colors hover:border-current-500/30">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono-tag text-[10px] uppercase text-ink-500">{label}</p>
        <ConfidencePill value={confidence} />
      </div>

      <div className="mt-2 flex items-center gap-2">
        {editing ? (
          type === "select" && options ? (
            <select
              autoFocus
              className="w-full rounded-lg border border-current-500/40 bg-white px-2.5 py-1.5 text-sm text-ink-900 focus:outline-none"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => setEditing(false)}
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              autoFocus
              type={type === "number" ? "number" : "text"}
              className="w-full rounded-lg border border-current-500/40 bg-white px-2.5 py-1.5 text-sm text-ink-900 focus:outline-none"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
            />
          )
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="group flex flex-1 items-center justify-between gap-2 text-left"
          >
            <span className="font-display text-lg font-medium text-ink-900">
              {value || <span className="text-ink-400">—</span>}
              {suffix && <span className="ml-1 text-sm text-ink-500">{suffix}</span>}
            </span>
            <PenLine className="h-3.5 w-3.5 shrink-0 text-ink-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        )}
      </div>
      {sourceNote && (
        <p className="mt-1.5 truncate text-[11px] text-ink-500" title={sourceNote}>
          “{sourceNote}”
        </p>
      )}
    </div>
  );
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
                <div
                  className="h-2 rounded-full bg-ink-900/[0.07]"
                  style={{ width: `${width}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-end justify-between border-t border-ink-900/8 pt-4">
            <div className="h-2 w-16 rounded-full bg-ink-900/10" />
            <div className="h-3 w-20 rounded-full bg-gold-500/25" />
          </div>

          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center px-5 text-center",
              file || status === "reading"
                ? "bg-white/70 backdrop-blur-[2px]"
                : "bg-white/30 backdrop-blur-[1px]"
            )}
          >
            {status === "reading" ? (
              <>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-current-400/15">
                  <FileText className="h-5 w-5 text-current-600" />
                  <div className="shimmer-bg absolute inset-0 rounded-full" />
                </div>
                <p className="mt-3 text-xs font-medium text-ink-800">Scanning bill</p>
              </>
            ) : file ? (
              <>
                <FileText className="h-8 w-8 text-current-600" />
                <p className="mt-3 max-w-[14rem] truncate text-sm font-medium text-ink-900">
                  {file.name}
                </p>
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

          {(status === "idle" || status === "reading" || status === "error") && (
            <div
              className={cn(
                "bill-scan-line pointer-events-none z-10",
                status === "reading" && "is-reading"
              )}
              aria-hidden
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function BillUploadStep({
  onConfirm,
  onSkip,
}: {
  onConfirm: (profile: ConfirmedBillProfile) => void;
  onSkip: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "reading" | "done" | "error">(
    "idle"
  );
  const [scanMsgIdx, setScanMsgIdx] = useState(0);
  const [extraction, setExtraction] = useState<BillExtraction | null>(null);
  const [editableValues, setEditableValues] = useState<ConfirmedBillProfile | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = useCallback((f: File | null | undefined) => {
    if (!f) return;
    setFile(f);
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  async function handleRead() {
    if (!file) return;
    setStatus("reading");
    setScanMsgIdx(0);
    setErrorMessage(null);

    const msgInterval = setInterval(() => {
      setScanMsgIdx((i) => (i + 1) % SCAN_MESSAGES.length);
    }, 1100);

    try {
      const body = new FormData();
      body.append("bill", file);
      const res = await fetch("/api/extract-bill", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message ?? "Couldn't read that bill.");
        setStatus("error");
        return;
      }

      const ext: BillExtraction = data.extraction;
      setExtraction(ext);
      setEditableValues({
        state: ext.state.value ?? "Other",
        consumerType: ext.consumerType.value ?? "commercial",
        voltageLevel: ext.voltageLevel.value ?? "11kV",
        sanctionedLoadKva: ext.sanctionedLoadKva.value ?? 1200,
        monthlyConsumptionKwh: ext.monthlyConsumptionKwh.value ?? 150000,
        averageTariffRsPerKwh: ext.averageTariffRsPerKwh.value ?? 8.5,
      });
      setStatus("done");
    } catch {
      setErrorMessage("Something went wrong reading that bill. Please try again.");
      setStatus("error");
    } finally {
      clearInterval(msgInterval);
    }
  }

  function updateField<K extends keyof ConfirmedBillProfile>(key: K, raw: string) {
    if (!editableValues) return;
    const isNumeric = [
      "sanctionedLoadKva",
      "monthlyConsumptionKwh",
      "averageTariffRsPerKwh",
    ].includes(key);
    setEditableValues({
      ...editableValues,
      [key]: isNumeric ? Number(raw) : raw,
    } as ConfirmedBillProfile);
  }

  const activeFieldIdx =
    status === "reading" ? scanMsgIdx % EXTRACT_FIELDS.length : -1;

  return (
    <div className="overflow-hidden rounded-3xl border border-ink-900/10 bg-paper-50/80 shadow-premium backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4 border-b border-ink-900/8 px-6 py-5 lg:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-current-gradient text-paper-50 shadow-glow">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="font-mono-tag text-xs uppercase text-current-600">
              Energy Procure Copilot
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-medium leading-tight tracking-tight text-ink-900 sm:text-3xl">
            Drop a bill.{" "}
            <em className="font-accent text-[1.06em] not-italic text-gold-600">
              Get a plan.
            </em>
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-700/80">
            Copilot reads tariff, load and consumption off your DISCOM bill, then
            weighs rooftop, wind, storage and Open Access against the load you
            already pay for.
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

      <ol className="grid grid-cols-2 border-b border-ink-900/8 sm:grid-cols-4">
        {FLOW_STEPS.map((step, i) => (
          <li
            key={step.n}
            className={cn(
              "flex items-center gap-2.5 px-5 py-3 sm:px-6",
              i < FLOW_STEPS.length - 1 && "border-b border-ink-900/6 sm:border-b-0 sm:border-r"
            )}
          >
            <span className="font-mono-tag text-[10px] text-current-600">{step.n}</span>
            <span className="text-xs font-medium text-ink-800">{step.label}</span>
          </li>
        ))}
      </ol>

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
              <p className="font-mono-tag text-[10px] uppercase text-ink-500">
                What Copilot reads
              </p>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {EXTRACT_FIELDS.map((field, i) => {
                  const Icon = field.icon;
                  const active = activeFieldIdx === i;
                  return (
                    <li
                      key={field.label}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border px-3.5 py-3 transition-colors",
                        active
                          ? "border-current-500/40 bg-current-400/10"
                          : "border-ink-900/8 bg-paper-100/70"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          active
                            ? "bg-current-500/15 text-current-700"
                            : "bg-ink-900/5 text-current-600"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-ink-900">
                          {field.label}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-ink-500">
                          {field.hint}
                        </span>
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
                  >
                    <Sparkles className="h-3.5 w-3.5 text-current-600" />
                    {SCAN_MESSAGES[scanMsgIdx]}
                  </motion.p>
                </AnimatePresence>
              )}

              {errorMessage && status === "error" && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/5 p-4 text-xs leading-relaxed text-red-700">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {errorMessage}
                </div>
              )}

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
              <p className="text-[11px] text-ink-500">
                PDF, PNG or JPG — up to 15MB. Every extracted field can be edited
                before the plan is built.
              </p>
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
                accept="application/pdf,image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
              <BillSilhouette status={status} file={file} dragOver={dragOver} />
            </div>
          </motion.div>
        )}

        {status === "done" && extraction && editableValues && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5 p-6 lg:p-8"
          >
            {extraction.utilityOrDiscom.value && (
              <p className="text-xs text-ink-600">
                Read from a {extraction.utilityOrDiscom.value} bill
                {extraction.billingPeriod.value
                  ? `, ${extraction.billingPeriod.value}`
                  : ""}
                . Tap any field to correct it.
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <EditableField
                label="State"
                type="select"
                options={["Karnataka", "Maharashtra", "Rajasthan", "Other"]}
                value={editableValues.state}
                confidence={extraction.state.confidence}
                sourceNote={extraction.state.sourceNote}
                onChange={(v) => updateField("state", v)}
              />
              <EditableField
                label="Consumer type"
                type="select"
                options={["commercial", "industrial"]}
                value={editableValues.consumerType}
                confidence={extraction.consumerType.confidence}
                sourceNote={extraction.consumerType.sourceNote}
                onChange={(v) => updateField("consumerType", v)}
              />
              <EditableField
                label="Voltage level"
                type="select"
                options={["11kV", "33kV", "66kV", "132kV"]}
                value={editableValues.voltageLevel}
                confidence={extraction.voltageLevel.confidence}
                sourceNote={extraction.voltageLevel.sourceNote}
                onChange={(v) => updateField("voltageLevel", v)}
              />
              <EditableField
                label="Sanctioned load"
                suffix="kVA"
                value={editableValues.sanctionedLoadKva}
                confidence={extraction.sanctionedLoadKva.confidence}
                sourceNote={extraction.sanctionedLoadKva.sourceNote}
                onChange={(v) => updateField("sanctionedLoadKva", v)}
              />
              <EditableField
                label="Monthly consumption"
                suffix="kWh"
                value={editableValues.monthlyConsumptionKwh}
                confidence={extraction.monthlyConsumptionKwh.confidence}
                sourceNote={extraction.monthlyConsumptionKwh.sourceNote}
                onChange={(v) => updateField("monthlyConsumptionKwh", v)}
              />
              <EditableField
                label="Average tariff"
                suffix="₹/kWh"
                value={editableValues.averageTariffRsPerKwh}
                confidence={extraction.averageTariffRsPerKwh.confidence}
                sourceNote={extraction.averageTariffRsPerKwh.sourceNote}
                onChange={(v) => updateField("averageTariffRsPerKwh", v)}
              />
            </div>

            {extraction.extractionNotes && (
              <div className="flex items-start gap-2.5 rounded-xl border border-current-500/25 bg-current-400/5 p-4 text-xs leading-relaxed text-ink-700">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-current-600" />
                {extraction.extractionNotes}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setFile(null);
                  setExtraction(null);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-900/15 px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900/30"
              >
                Try a different bill
              </button>
              <button
                type="button"
                onClick={() => onConfirm(editableValues)}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-paper-50 transition-all hover:bg-current-600 hover:shadow-glow"
              >
                Looks right — build my plan
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
