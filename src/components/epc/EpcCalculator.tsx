"use client";

import { FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  EpcApiError,
  getApiBaseUrl,
  getRateCard,
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
  RateCardEntry,
  ScopeOption,
  StateOption,
} from "@/lib/epc/types";
import { EpcResults } from "./EpcResults";

const fieldClass =
  "w-full rounded-xl border border-ink-900/15 bg-paper-100/60 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-current-500/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";
const labelClass = "mb-1.5 block text-xs font-medium text-ink-700";
const hintClass = "mt-1.5 text-xs leading-relaxed text-ink-500";
const DEBOUNCE_MS = 400;
const WAKING_MS = 3000;

function parseNumberInput(value: string): number {
  if (value.trim() === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function EpcCalculator() {
  const formId = useId();
  const apiConfigured = Boolean(getApiBaseUrl());
  const [form, setForm] = useState<EpcFormValues>(DEFAULT_FORM);
  const [states, setStates] = useState<StateOption[]>(FALLBACK_STATES);
  const [scopes, setScopes] = useState<ScopeOption[]>(FALLBACK_SCOPES);
  const [rateCard, setRateCard] = useState<RateCardEntry[] | null>(null);
  const [configReady, setConfigReady] = useState(!apiConfigured);
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [waking, setWaking] = useState(false);
  const requestSeq = useRef(0);
  const wakingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedScope = scopes.find((scope) => scope.value === form.project_scope);
  const turnkey = isTurnkeyScope(form.project_scope);

  const update = useCallback(<K extends keyof EpcFormValues>(key: K, value: EpcFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const runEstimate = useCallback(
    async (values: EpcFormValues) => {
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
          err instanceof EpcApiError
            ? err.message
            : "Could not reach the estimator. Try again."
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
    },
    []
  );

  useEffect(() => {
    if (!apiConfigured) return;
    let cancelled = false;

    async function loadConfig() {
      const [statesResult, scopesResult, rateResult] = await Promise.allSettled([
        getStates(),
        getScopes(),
        getRateCard(),
      ]);
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
      if (rateResult.status === "fulfilled") {
        setRateCard(rateResult.value);
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
              Set <code className="font-mono-tag text-xs">NEXT_PUBLIC_API_URL</code> to
              your FastAPI host with no trailing slash, then restart the Next.js
              server. Example:{" "}
              <code className="font-mono-tag text-xs">
                https://ainergy-renewables-backend.onrender.com
              </code>{" "}
              or local <code className="font-mono-tag text-xs">http://127.0.0.1:8000</code>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-8">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-ink-900/10 bg-white/80 p-5 shadow-sm backdrop-blur-md sm:p-7"
      >
        <p className="font-mono-tag text-xs uppercase text-current-600">Inputs</p>
        <h2 className="mt-2 font-display text-xl font-medium text-ink-900">
          Plant configuration
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          This is a planning-grade budget, not a firm quote. Land is GST-exempt;
          GST applies only to the EPC subtotal.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className={labelClass} htmlFor={`${formId}-capacity`}>
              Plant AC capacity (MW)
            </label>
            <input
              id={`${formId}-capacity`}
              className={fieldClass}
              type="number"
              min={0.01}
              max={500}
              step="0.1"
              required
              value={form.capacity_ac_mw || ""}
              onChange={(e) => update("capacity_ac_mw", parseNumberInput(e.target.value))}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor={`${formId}-ratio`}>
              DC:AC ratio <span className="font-normal text-ink-400">(optional)</span>
            </label>
            <input
              id={`${formId}-ratio`}
              className={fieldClass}
              type="number"
              min={1.01}
              max={1.99}
              step="0.01"
              placeholder="Leave blank for backend default"
              value={form.dc_ac_ratio}
              onChange={(e) => update("dc_ac_ratio", e.target.value)}
            />
            <p className={hintClass}>
              If blank, the backend applies 1.30 for DCR and 1.28 for non-DCR.
            </p>
          </div>

          <div>
            <label className={labelClass} htmlFor={`${formId}-module`}>
              Module type
            </label>
            <select
              id={`${formId}-module`}
              className={fieldClass}
              value={form.module_type}
              onChange={(e) =>
                update("module_type", e.target.value as EpcFormValues["module_type"])
              }
            >
              {MODULE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className={hintClass}>
              DCR = Domestic Content Requirement (ALMM-listed Indian cells).
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor={`${formId}-mounting`}>
                Mounting type
              </label>
              <select
                id={`${formId}-mounting`}
                className={fieldClass}
                value={form.mounting_type}
                onChange={(e) =>
                  update(
                    "mounting_type",
                    e.target.value as EpcFormValues["mounting_type"]
                  )
                }
              >
                {MOUNTING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor={`${formId}-inverter`}>
                Inverter type
              </label>
              <select
                id={`${formId}-inverter`}
                className={fieldClass}
                value={form.inverter_type}
                onChange={(e) =>
                  update(
                    "inverter_type",
                    e.target.value as EpcFormValues["inverter_type"]
                  )
                }
              >
                {INVERTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor={`${formId}-scope`}>
              Project scope
            </label>
            <select
              id={`${formId}-scope`}
              className={fieldClass}
              value={form.project_scope}
              onChange={(e) =>
                update(
                  "project_scope",
                  e.target.value as EpcFormValues["project_scope"]
                )
              }
            >
              {scopes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {selectedScope?.includes && selectedScope.includes.length > 0 ? (
              <p className={hintClass}>Includes: {selectedScope.includes.join(", ")}</p>
            ) : (
              <p className={hintClass}>
                Each tier includes the ones above. Evacuation and land apply only
                to full EPC turnkey.
              </p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor={`${formId}-state`}>
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

          {turnkey ? (
            <>
              <div>
                <label className={labelClass} htmlFor={`${formId}-km`}>
                  Evacuation line (km)
                </label>
                <input
                  id={`${formId}-km`}
                  className={fieldClass}
                  type="number"
                  min={0}
                  max={200}
                  step="0.1"
                  value={form.evacuation_line_km}
                  onChange={(e) =>
                    update("evacuation_line_km", parseNumberInput(e.target.value))
                  }
                />
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-900/10 bg-paper-50 px-4 py-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-ink-900/20 text-current-600 focus:ring-current-500"
                  checked={form.include_land}
                  onChange={(e) => update("include_land", e.target.checked)}
                />
                <span>
                  <span className="block text-sm font-medium text-ink-900">
                    Include land
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-500">
                    Land is GST-exempt. Leave off unless you want a site-land
                    allowance in the total.
                  </span>
                </span>
              </label>
            </>
          ) : null}
        </div>

        {validationError ? (
          <p className="mt-4 text-sm text-red-700" role="alert">
            {validationError}
          </p>
        ) : null}

        <button
          type="submit"
          className="sticky bottom-4 z-20 mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-paper-50 shadow-premium transition-all duration-300 hover:bg-current-600 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current-400 lg:static lg:w-auto lg:shadow-[0_0_0_1px_rgba(21,28,29,0.06)]"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Calculate
        </button>
      </form>

      <div className="rounded-2xl border border-ink-900/10 bg-white/80 p-5 shadow-sm backdrop-blur-md sm:p-7 lg:sticky lg:top-28">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono-tag text-xs uppercase text-current-600">Results</p>
            <h2 className="mt-2 font-display text-xl font-medium text-ink-900">
              Live estimate
            </h2>
          </div>
          {loading ? (
            <span className="inline-flex items-center gap-2 text-xs text-ink-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {waking ? "Waking estimator…" : "Calculating…"}
            </span>
          ) : null}
        </div>

        {error ? (
          <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        {!estimate && !error ? (
          <div className="flex min-h-[16rem] flex-col items-center justify-center text-center">
            <Loader2 className="h-6 w-6 animate-spin text-current-600" />
            <p className="mt-3 text-sm text-ink-600">
              {waking
                ? "Waking estimator… first request can take up to a minute."
                : "Fetching a planning-grade estimate…"}
            </p>
          </div>
        ) : estimate ? (
          <EpcResults estimate={estimate} rateCard={rateCard} />
        ) : null}
      </div>
    </div>
  );
}
