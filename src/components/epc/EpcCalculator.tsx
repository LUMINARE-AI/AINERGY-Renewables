"use client";

import { FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EpcApiError,
  getApiBaseUrl,
  getScopes,
  getStates,
  postEstimate,
} from "@/lib/epc/api";
import {
  DEFAULT_FORM,
  FALLBACK_SCOPES,
  FALLBACK_STATES,
  INVERTER_OPTIONS,
  MODULE_OPTIONS,
  MOUNTING_OPTIONS,
} from "@/lib/epc/defaults";
import { buildEstimatePayload, isTurnkeyScope, validateEpcForm } from "@/lib/epc/payload";
import type {
  EpcFormValues,
  EstimateResponse,
  ScopeOption,
  StateOption,
} from "@/lib/epc/types";
import { EpcBreakdown, EpcDetails, EpcSummary } from "./EpcResults";

const DEBOUNCE_MS = 400;
const WAKING_MS = 3000;

const SEGMENT: Record<string, string> = {
  dcr: "DCR (Indian cells)",
  non_dcr: "Non-DCR",
  fixed: "Fixed",
  tracker: "Tracker",
  string: "String",
  central: "Central",
};

function parseNumberInput(value: string): number {
  if (value.trim() === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function previewRatio(form: EpcFormValues): number {
  const raw = form.dc_ac_ratio.trim();
  if (raw !== "") {
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }
  return form.module_type === "dcr" ? 1.3 : 1.28;
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label?: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-ink-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                active
                  ? "bg-current-600 text-white"
                  : "bg-paper-100 text-ink-700 hover:bg-paper-200"
              )}
            >
              {SEGMENT[option.value] ?? option.label ?? option.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function EpcCalculator() {
  const formId = useId();
  const apiConfigured = Boolean(getApiBaseUrl());
  const [form, setForm] = useState<EpcFormValues>(DEFAULT_FORM);
  const [states, setStates] = useState<StateOption[]>(FALLBACK_STATES);
  const [scopes, setScopes] = useState<ScopeOption[]>(FALLBACK_SCOPES);
  const [configReady, setConfigReady] = useState(!apiConfigured);
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [waking, setWaking] = useState(false);
  const requestSeq = useRef(0);
  const wakingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const turnkey = isTurnkeyScope(form.project_scope);
  const ratio = estimate?.resolved_dc_ac_ratio ?? previewRatio(form);
  const dcMw = estimate?.capacity_dc_mw ?? form.capacity_ac_mw * ratio;

  const update = useCallback(<K extends keyof EpcFormValues>(key: K, value: EpcFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const runEstimate = useCallback(async (values: EpcFormValues) => {
    if (!getApiBaseUrl()) return;

    const invalid = validateEpcForm(values);
    setValidationError(invalid);
    if (invalid) {
      setLoading(false);
      setWaking(false);
      return;
    }

    const seq = ++requestSeq.current;
    setLoading(true);
    setError(null);
    if (wakingTimer.current) clearTimeout(wakingTimer.current);
    wakingTimer.current = setTimeout(() => {
      if (requestSeq.current === seq) setWaking(true);
    }, WAKING_MS);

    try {
      const result = await postEstimate(buildEstimatePayload(values));
      if (requestSeq.current !== seq) return;
      setEstimate(result);
    } catch (err) {
      if (requestSeq.current !== seq) return;
      setError(
        err instanceof EpcApiError ? err.message : "Could not reach the estimator. Try again."
      );
    } finally {
      if (requestSeq.current === seq) {
        setLoading(false);
        setWaking(false);
      }
      if (wakingTimer.current) {
        clearTimeout(wakingTimer.current);
        wakingTimer.current = null;
      }
    }
  }, []);

  useEffect(() => {
    if (!apiConfigured) return;
    let cancelled = false;

    async function loadConfig() {
      const [statesResult, scopesResult] = await Promise.allSettled([getStates(), getScopes()]);
      if (cancelled) return;

      if (statesResult.status === "fulfilled" && statesResult.value.length > 0) {
        const nextStates = statesResult.value;
        setStates(nextStates);
        setForm((prev) =>
          nextStates.some((item) => item.value === prev.state)
            ? prev
            : { ...prev, state: nextStates[0].value }
        );
      }
      if (scopesResult.status === "fulfilled" && scopesResult.value.length > 0) {
        const nextScopes = scopesResult.value;
        setScopes(nextScopes);
        setForm((prev) =>
          nextScopes.some((item) => item.value === prev.project_scope)
            ? prev
            : {
                ...prev,
                project_scope: nextScopes[0].value as EpcFormValues["project_scope"],
              }
        );
      }
      setConfigReady(true);
    }

    void loadConfig();
    return () => {
      cancelled = true;
    };
  }, [apiConfigured]);

  useEffect(() => {
    if (!apiConfigured || !configReady) return;
    const timer = setTimeout(() => {
      void runEstimate(form);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [apiConfigured, configReady, form, runEstimate]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runEstimate(form);
  }

  if (!apiConfigured) {
    return (
      <div className="rounded-2xl border border-ink-900/10 bg-white/80 px-5 py-6 shadow-sm sm:px-8 sm:py-8">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
          <div>
            <p className="font-display text-lg font-medium text-ink-900">
              Estimator URL is not configured
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700/85">
              Set <code className="font-mono-tag text-xs">NEXT_PUBLIC_API_URL</code> to your
              FastAPI host with no trailing slash, then restart the Next.js server.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const fieldClass =
    "w-full appearance-none rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-sm text-ink-900 transition-colors focus:border-current-500/50 focus:outline-none disabled:cursor-not-allowed disabled:bg-paper-100 disabled:text-ink-400";

  return (
    <div className="space-y-4">
      <EpcSummary estimate={estimate} loading={loading} waking={waking} />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-ink-900/10 bg-white px-5 py-6 shadow-sm sm:px-7 sm:py-7"
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-mono-tag text-[0.65rem] uppercase tracking-[0.16em] text-current-600">
              Plant
            </p>
            {loading ? (
              <span className="inline-flex items-center gap-1 text-xs text-current-600">
                <Loader2 className="h-3 w-3 animate-spin" />
                {waking ? "Waking…" : "Updating"}
              </span>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs text-ink-500" htmlFor={`${formId}-capacity`}>
                AC capacity (MW)
              </label>
              <input
                id={`${formId}-capacity`}
                className={fieldClass}
                type="number"
                min={0.5}
                max={500}
                step="0.5"
                value={form.capacity_ac_mw || ""}
                onChange={(e) => update("capacity_ac_mw", parseNumberInput(e.target.value))}
              />
            </div>
            <Readout label="DC (MWp)" value={dcMw.toLocaleString("en-IN", { maximumFractionDigits: 2 })} />
            <div>
              <label className="mb-1.5 block text-xs text-ink-500" htmlFor={`${formId}-ratio`}>
                DC:AC ratio
              </label>
              <input
                id={`${formId}-ratio`}
                className={fieldClass}
                type="number"
                min={1.01}
                max={1.99}
                step="0.01"
                placeholder="1.30"
                value={form.dc_ac_ratio}
                onChange={(e) => update("dc_ac_ratio", e.target.value)}
              />
            </div>
          </div>
          <input
            aria-label="AC capacity slider"
            type="range"
            min={1}
            max={150}
            step={0.5}
            value={Math.min(150, Math.max(1, form.capacity_ac_mw || 1))}
            onChange={(e) => update("capacity_ac_mw", parseNumberInput(e.target.value))}
            className="mt-4 h-1 w-full cursor-pointer appearance-none rounded-full bg-paper-200 accent-current-500"
          />

          <div className="mt-6 space-y-5">
            <div>
              <Segmented
                label="Module type"
                value={form.module_type}
                options={MODULE_OPTIONS}
                onChange={(value) => update("module_type", value)}
              />
              <p className="mt-2 text-xs leading-relaxed text-ink-500">
                {form.module_type === "dcr"
                  ? "Genuine DCR: ALMM List-II Indian cells. The single biggest cost driver."
                  : "Non-DCR modules are usually cheaper. Confirm eligibility before you lock a budget."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Segmented
                label="Mounting"
                value={form.mounting_type}
                options={MOUNTING_OPTIONS}
                onChange={(value) => update("mounting_type", value)}
              />
              <Segmented
                label="Inverter"
                value={form.inverter_type}
                options={INVERTER_OPTIONS}
                onChange={(value) => update("inverter_type", value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink-800" htmlFor={`${formId}-scope`}>
                Scope
              </label>
              <select
                id={`${formId}-scope`}
                className={fieldClass}
                value={form.project_scope}
                onChange={(e) =>
                  update("project_scope", e.target.value as EpcFormValues["project_scope"])
                }
              >
                {scopes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-800" htmlFor={`${formId}-state`}>
                  Site state
                </label>
                <select
                  id={`${formId}-state`}
                  className={fieldClass}
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                >
                  {states.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-800" htmlFor={`${formId}-km`}>
                  Transmission
                </label>
                <input
                  id={`${formId}-km`}
                  className={fieldClass}
                  type="number"
                  min={0}
                  max={200}
                  step="0.1"
                  disabled={!turnkey}
                  value={form.evacuation_line_km}
                  onChange={(e) => update("evacuation_line_km", parseNumberInput(e.target.value))}
                />
                <p className="mt-1.5 text-right text-[0.65rem] text-ink-400">Evacuation line (km)</p>
              </div>
            </div>

            <label
              className={cn(
                "flex cursor-pointer items-center gap-2.5 text-sm text-ink-800",
                !turnkey && "cursor-not-allowed text-ink-400"
              )}
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-ink-900/20 text-current-600 accent-current-500 focus:ring-current-500 disabled:opacity-40"
                checked={turnkey && form.include_land}
                disabled={!turnkey}
                onChange={(e) => update("include_land", e.target.checked)}
              />
              Include land (turnkey only)
            </label>
          </div>

          {validationError ? (
            <p className="mt-4 text-sm text-red-700" role="alert">
              {validationError}
            </p>
          ) : null}
          {error ? (
            <p className="mt-4 flex items-start gap-2 text-sm text-red-700" role="alert">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          ) : null}
        </form>

        <EpcBreakdown estimate={estimate} />
      </div>

      {estimate ? <EpcDetails estimate={estimate} /> : null}
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1.5 text-xs text-ink-500">{label}</p>
      <p className="rounded-xl border border-ink-900/10 bg-paper-50 px-4 py-3 text-sm font-medium tabular-nums text-ink-900">
        {value}
      </p>
    </div>
  );
}
