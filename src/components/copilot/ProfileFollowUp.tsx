"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CopilotApiError, nextQuestion } from "@/lib/api/copilotClient";
import {
  isProfileNumberField,
  profileFieldLabel,
  profileFieldSuffix,
} from "@/lib/copilot/format";
import { compactProfile } from "@/lib/copilot/profile";
import {
  CONSUMER_TYPES,
  VOLTAGE_LEVELS,
  type EnergyProfile,
  type NextQuestionResponse,
  type StateCatalogEntry,
} from "@/lib/copilot/types";
import { ErrorNote, LoadingNote } from "./ApiState";

const inputClass =
  "w-full rounded-xl border border-ink-900/15 bg-white px-3.5 py-2.5 text-sm text-ink-900 focus:border-current-500/60 focus:outline-none";

function parseAnswer(field: string, raw: string): string | number {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Enter a value to continue.");
  if (!isProfileNumberField(field)) return trimmed;
  const value = Number(trimmed);
  if (!Number.isFinite(value)) throw new Error("Enter a number.");
  if (field === "targetRenewableSharePct" && (value < 0 || value > 100)) {
    throw new Error("Enter a share between 0 and 100.");
  }
  if (field === "fixedChargesRs" && value < 0) throw new Error("Enter 0 or more.");
  if (field !== "fixedChargesRs" && field !== "targetRenewableSharePct" && value <= 0) {
    throw new Error("Enter a number greater than 0.");
  }
  return value;
}

function stateOptions(states: StateCatalogEntry[], current?: string | null) {
  const names = states.map((entry) => entry.state);
  if (current && !names.includes(current)) names.push(current);
  return names;
}

export function ProfileFollowUp({
  initialProfile,
  states,
  reviewing,
  onComplete,
}: {
  initialProfile: EnergyProfile;
  states: StateCatalogEntry[];
  reviewing: boolean;
  onComplete: (profile: EnergyProfile) => void;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [step, setStep] = useState<NextQuestionResponse | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const ask = useCallback(async (next: EnergyProfile, advance: boolean) => {
    setLoading(true);
    setError(null);
    setFieldError(null);
    try {
      const response = await nextQuestion(compactProfile(next));
      const cleaned = compactProfile(response.profile ?? next);
      setProfile(cleaned);
      setStep(response);
      setDraft("");
      if (response.complete && advance) onComplete(cleaned);
      else if (response.complete) setEditing(true);
      else setEditing(false);
    } catch (err) {
      setError(err instanceof CopilotApiError ? err.message : "Could not check the profile. Try again.");
    } finally {
      setLoading(false);
    }
  }, [onComplete]);

  useEffect(() => {
    void ask(initialProfile, !reviewing);
    // Ask once for the profile that opened this step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateProfileField(key: keyof EnergyProfile, raw: string) {
    setProfile((prev) => {
      const next = { ...prev };
      if (!raw.trim()) {
        delete next[key];
        return next;
      }
      if (isProfileNumberField(key)) {
        const value = Number(raw);
        if (!Number.isFinite(value)) return prev;
        next[key] = value as never;
      } else {
        next[key] = raw as never;
      }
      return next;
    });
  }

  function submitAnswer() {
    if (!step?.nextField) return;
    try {
      const value = parseAnswer(step.nextField, draft);
      const next = { ...profile, [step.nextField]: value } as EnergyProfile;
      void ask(next, true);
    } catch (err) {
      setFieldError(err instanceof Error ? err.message : "Check that value.");
    }
  }

  const field = step?.nextField;
  const stateEntry = field === "state" ? states.find((entry) => entry.state === draft) : undefined;

  return (
    <div className="rounded-3xl border border-ink-900/10 bg-paper-50/80 p-6 shadow-premium lg:p-8">
      <p className="font-mono-tag text-[10px] uppercase text-current-600">Profile</p>
      <h2 className="mt-2 font-display text-2xl text-ink-900">
        {editing ? "Review the details" : "A few details are still missing"}
      </h2>

      {loading && <div className="mt-5"><LoadingNote label="Checking what's still needed…" /></div>}
      {error && (
        <div className="mt-5">
          <ErrorNote message={error} onRetry={() => void ask(profile, editing ? true : !reviewing)} />
        </div>
      )}

      {!loading && !error && editing && (
        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void ask(profile, true);
          }}
        >
          <p className="text-sm text-ink-600">These details are enough to compare routes. Change anything, then recalculate.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(profile) as (keyof EnergyProfile)[]).map((key) => (
              <label key={key} className="block text-sm">
                <span className="mb-1.5 block text-[11px] uppercase text-ink-500">{profileFieldLabel(key)}</span>
                {key === "state" || key === "consumerType" || key === "voltageLevel" ? (
                  <select
                    className={inputClass}
                    value={typeof profile[key] === "string" ? profile[key] : ""}
                    onChange={(event) => updateProfileField(key, event.target.value)}
                  >
                    {(key === "state" ? stateOptions(states, profile.state) : key === "consumerType" ? [...CONSUMER_TYPES] : [...VOLTAGE_LEVELS]).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className={inputClass}
                    value={profile[key] ?? ""}
                    onChange={(event) => updateProfileField(key, event.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-paper-50 hover:bg-current-600"
          >
            Recalculate
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {!loading && !error && !editing && step && !step.complete && field && (
        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            submitAnswer();
          }}
        >
          <label className="block text-sm font-medium text-ink-900" htmlFor="profile-next">
            {step.nextQuestion || profileFieldLabel(field)}
          </label>
          {field === "state" ? (
            <select id="profile-next" className={inputClass} value={draft} onChange={(e) => setDraft(e.target.value)}>
              <option value="">Select a state</option>
              {stateOptions(states, profile.state).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : field === "consumerType" || field === "voltageLevel" ? (
            <select id="profile-next" className={inputClass} value={draft} onChange={(e) => setDraft(e.target.value)}>
              <option value="">Select</option>
              {(field === "consumerType" ? CONSUMER_TYPES : VOLTAGE_LEVELS).map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <div className="flex items-center gap-2">
              <input
                id="profile-next"
                className={inputClass}
                type={isProfileNumberField(field) ? "number" : "text"}
                step="any"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              {profileFieldSuffix(field) && (
                <span className="text-xs text-ink-500">{profileFieldSuffix(field)}</span>
              )}
            </div>
          )}
          {stateEntry?.anyPlaceholder && (
            <p className="text-xs text-current-800">Tariff data for {stateEntry.state} is still a placeholder.</p>
          )}
          {step.missingFields.length > 0 && (
            <p className="text-xs text-ink-500">Still needed: {step.missingFields.map(profileFieldLabel).join(", ")}.</p>
          )}
          {fieldError && <ErrorNote message={fieldError} />}
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-paper-50 hover:bg-current-600"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {!loading && !error && !editing && step && !step.complete && !field && (
        <div className="mt-5 space-y-3">
          <p className="text-sm text-ink-600">The copilot did not return the next question.</p>
          {step.missingFields.length > 0 && (
            <p className="text-xs text-ink-500">Still needed: {step.missingFields.map(profileFieldLabel).join(", ")}.</p>
          )}
          <ErrorNote message="Try again to continue the profile." onRetry={() => void ask(profile, true)} />
        </div>
      )}
    </div>
  );
}
