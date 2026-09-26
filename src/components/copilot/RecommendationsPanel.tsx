"use client";

import { ArrowRight } from "lucide-react";
import { formatProfileValue, profileFieldLabel, routeLabel } from "@/lib/copilot/format";
import type { EnergyProfile, RecommendationsResponse } from "@/lib/copilot/types";
import { EmptyNote, ErrorNote, LoadingNote } from "./ApiState";
import { LandedCostCard } from "./LandedCostCard";
import { RankedOptionsList } from "./RankedOptionsList";

export function RecommendationsPanel({
  profile,
  result,
  loading,
  error,
  onRetry,
  selectedRoute,
  onSelectRoute,
  onGenerateReport,
  reportLoading,
  reportError,
  onEdit,
  onStartOver,
}: {
  profile: EnergyProfile;
  result: RecommendationsResponse | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  selectedRoute: string | null;
  onSelectRoute: (route: string) => void;
  onGenerateReport: () => void;
  reportLoading: boolean;
  reportError: string | null;
  onEdit: () => void;
  onStartOver: () => void;
}) {
  return (
    <div className="space-y-6 rounded-3xl border border-ink-900/10 bg-paper-50/80 p-6 shadow-premium lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono-tag text-[10px] uppercase text-current-600">Comparison</p>
          <h2 className="mt-2 font-display text-2xl text-ink-900">Grid, third-party, captive, group captive</h2>
        </div>
        <div className="flex gap-3 text-xs">
          <button type="button" onClick={onEdit} className="font-medium text-ink-600 underline underline-offset-4">
            Change details
          </button>
          <button type="button" onClick={onStartOver} className="font-medium text-ink-600 underline underline-offset-4">
            Start over
          </button>
        </div>
      </div>

      <ul className="flex flex-wrap gap-2">
        {Object.entries(profile).map(([key, value]) => (
          <li key={key} className="rounded-full border border-ink-900/10 bg-paper-100 px-3 py-1 text-[11px] text-ink-700">
            {profileFieldLabel(key)}: {formatProfileValue(key, value)}
          </li>
        ))}
      </ul>

      {loading && <LoadingNote label="Building the comparison…" />}
      {error && <ErrorNote message={error} onRetry={onRetry} />}
      {!loading && !error && !result && <EmptyNote message="No comparison yet." />}

      {result && (
        <>
          <LandedCostCard result={result.comparison} />
          <div>
            <h3 className="font-display text-xl text-ink-900">Ranked options</h3>
            <p className="mt-1 text-xs text-ink-500">
              Select a route for the report. Ineligible options stay visible with the reason.
            </p>
            <div className="mt-4">
              <RankedOptionsList
                options={result.rankedOptions}
                selectedRoute={selectedRoute}
                onSelect={onSelectRoute}
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-3">
            <button
              type="button"
              onClick={onGenerateReport}
              disabled={reportLoading}
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-paper-50 hover:bg-current-600 disabled:opacity-50"
            >
              {reportLoading ? "Generating report…" : `Generate report${selectedRoute ? ` · ${routeLabel(selectedRoute)}` : ""}`}
              {!reportLoading && <ArrowRight className="h-4 w-4" />}
            </button>
            {reportError && <ErrorNote message={reportError} onRetry={onGenerateReport} />}
          </div>
        </>
      )}
    </div>
  );
}
