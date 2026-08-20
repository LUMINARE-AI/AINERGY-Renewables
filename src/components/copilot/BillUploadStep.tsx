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
} from "lucide-react";
import type { BillExtraction } from "@/lib/billExtraction/schema";

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

function ConfidencePill({ value }: { value: number }) {
  const tier =
    value >= 0.8 ? "high" : value >= 0.5 ? "medium" : "low";
  const styles = {
    high: "bg-forest-500/10 text-forest-700 border-forest-500/25",
    medium: "bg-current-400/15 text-current-700 border-current-500/30",
    low: "bg-red-500/10 text-red-700 border-red-500/25",
  }[tier];
  const label = { high: "High confidence", medium: "Verify", low: "Please check" }[tier];
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

export function BillUploadStep({
  onConfirm,
  onSkip,
}: {
  onConfirm: (profile: ConfirmedBillProfile) => void;
  onSkip: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<"idle" | "reading" | "done" | "error">("idle");
  const [scanMsgIdx, setScanMsgIdx] = useState(0);
  const [extraction, setExtraction] = useState<BillExtraction | null>(null);
  const [editableValues, setEditableValues] = useState<ConfirmedBillProfile | null>(null);
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
    const isNumeric = ["sanctionedLoadKva", "monthlyConsumptionKwh", "averageTariffRsPerKwh"].includes(
      key
    );
    setEditableValues({
      ...editableValues,
      [key]: isNumeric ? Number(raw) : raw,
    } as ConfirmedBillProfile);
  }

  return (
    <div className="space-y-6 rounded-3xl border border-ink-900/10 bg-paper-100/60 p-6 lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-mono-tag text-xs uppercase text-current-600">
            Energy Procure Copilot
          </h3>
          <p className="mt-2 font-display text-xl font-medium text-ink-900">
            Upload your electricity bill
          </p>
          <p className="mt-1.5 max-w-md text-sm text-ink-700/80">
            AINERGY reads your tariff, load and consumption straight off the
            bill, so you don&apos;t have to look anything up.
          </p>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="shrink-0 whitespace-nowrap text-xs font-medium text-ink-600 underline decoration-ink-300 underline-offset-4 hover:text-current-600"
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
            className="space-y-4"
          >
            <div
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
              className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
                dragOver
                  ? "border-current-500 bg-current-400/10"
                  : "border-ink-900/15 bg-paper-50 hover:border-current-500/40 hover:bg-current-400/5"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
              {status === "reading" ? (
                <>
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-current-400/15">
                    <FileText className="h-6 w-6 text-current-600" />
                    <div className="shimmer-bg absolute inset-0 rounded-full" />
                  </div>
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
                </>
              ) : file ? (
                <>
                  <FileText className="h-8 w-8 text-current-600" />
                  <p className="text-sm font-medium text-ink-900">{file.name}</p>
                  <p className="text-xs text-ink-500">
                    {(file.size / 1024).toFixed(0)} KB — click to replace
                  </p>
                </>
              ) : (
                <>
                  <UploadCloud className="h-8 w-8 text-ink-500" />
                  <p className="text-sm font-medium text-ink-900">
                    Drag your bill here, or click to browse
                  </p>
                  <p className="text-xs text-ink-500">PDF, PNG or JPG — up to 15MB</p>
                </>
              )}
            </div>

            {errorMessage && status === "error" && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/5 p-4 text-xs leading-relaxed text-red-700">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
          </motion.div>
        )}

        {status === "done" && extraction && editableValues && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {extraction.utilityOrDiscom.value && (
              <p className="text-xs text-ink-600">
                Read from a {extraction.utilityOrDiscom.value} bill
                {extraction.billingPeriod.value ? `, ${extraction.billingPeriod.value}` : ""}.
                Tap any field to correct it.
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
