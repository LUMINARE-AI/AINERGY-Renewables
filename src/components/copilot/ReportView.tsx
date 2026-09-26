"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CopilotApiError, getReport } from "@/lib/api/copilotClient";
import { formatNumber, formatProfileValue, profileFieldLabel, routeLabel } from "@/lib/copilot/format";
import type { EnergyReport } from "@/lib/copilot/types";
import { CopilotWakeBanner, EmptyNote, ErrorNote, LoadingNote } from "./ApiState";
import { LandedCostCard } from "./LandedCostCard";
import { RankedOptionsList } from "./RankedOptionsList";

function formatWhen(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN");
}

export function ReportView({ reportId }: { reportId: string }) {
  const [report, setReport] = useState<EnergyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMissing(false);
    try {
      setReport(await getReport(reportId));
    } catch (err) {
      setReport(null);
      if (err instanceof CopilotApiError && err.status === 404) {
        setMissing(true);
      } else {
        setError(err instanceof CopilotApiError ? err.message : "Could not load that report.");
      }
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="space-y-4">
        <CopilotWakeBanner />
        <LoadingNote label="Loading the report…" />
      </div>
    );
  }

  if (missing) {
    return (
      <div className="space-y-4 rounded-3xl border border-ink-900/10 bg-paper-50 p-8">
        <h1 className="font-display text-3xl text-ink-900">This report is no longer available</h1>
        <p className="max-w-xl text-sm leading-relaxed text-ink-600">
          Reports are kept in memory and disappear when the copilot restarts. Generate a new one from the calculator.
        </p>
        <Link href="/energy-optimizer" className="inline-flex text-sm font-medium text-current-700 underline underline-offset-4">
          Back to the copilot
        </Link>
      </div>
    );
  }

  if (error) return <ErrorNote message={error} onRetry={() => void load()} />;
  if (!report) return <EmptyNote message="No report came back." />;

  const assumptions = Object.entries(report.assumptions ?? {}).filter(([, value]) => value != null);

  return (
    <article className="space-y-8">
      <div>
        <p className="font-mono-tag text-[10px] uppercase text-current-600">Report</p>
        <h1 className="mt-2 font-display text-3xl text-ink-900">
          {report.selectedRoute ? `${routeLabel(report.selectedRoute)} plan` : "Energy report"}
        </h1>
        <p className="mt-2 text-xs text-ink-500">{formatWhen(report.createdAt)}</p>
      </div>

      <ul className="flex flex-wrap gap-2">
        {Object.entries(report.profile ?? {}).map(([key, value]) => (
          <li key={key} className="rounded-full border border-ink-900/10 bg-white px-3 py-1 text-[11px] text-ink-700">
            {profileFieldLabel(key)}: {formatProfileValue(key, value)}
          </li>
        ))}
      </ul>

      <LandedCostCard result={report.comparison} />
      <RankedOptionsList options={report.rankedOptions ?? []} selectedRoute={report.selectedRoute} />

      {assumptions.length > 0 && (
        <details className="rounded-2xl border border-ink-900/10 bg-white p-4">
          <summary className="cursor-pointer text-sm font-medium text-ink-800">Assumptions used</summary>
          <ul className="mt-3 grid gap-1 text-xs text-ink-600 sm:grid-cols-2">
            {assumptions.map(([key, value]) => (
              <li key={key}>
                {profileFieldLabel(key)}: {typeof value === "number" ? formatNumber(value) : String(value)}
              </li>
            ))}
          </ul>
        </details>
      )}

      <Link href="/energy-optimizer" className="inline-flex text-sm font-medium text-current-700 underline underline-offset-4">
        Back to the copilot
      </Link>
    </article>
  );
}
