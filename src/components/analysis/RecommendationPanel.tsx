import { CheckCircle2, AlertTriangle, HelpCircle, ArrowRight } from "lucide-react";
import type { RecommendationOutput } from "@/lib/recommendations/engine";
import { SCENARIO_LABELS } from "@/lib/calculations/scenarios";

export function RecommendationPanel({ recommendation }: { recommendation: RecommendationOutput }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-graphite-900/50 p-6 lg:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-400/10">
          <CheckCircle2 className="h-4 w-4 text-forest-300" />
        </div>
        <div>
          <p className="font-mono-tag text-xs uppercase text-current-300">Recommended strategy</p>
          <p className="mt-1 font-display text-xl font-medium text-offwhite-100">
            {SCENARIO_LABELS[recommendation.recommendedStrategy]}
          </p>
          <p className="mt-1 text-sm text-offwhite-300/60">
            Estimated savings: ₹{recommendation.expectedSavingsRs.toLocaleString("en-IN")}/yr (
            {recommendation.expectedSavingsPct}%)
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs uppercase text-offwhite-300/50">
            <HelpCircle className="h-3.5 w-3.5" /> Key assumptions
          </p>
          <ul className="space-y-1.5 text-xs leading-relaxed text-offwhite-300/70">
            {recommendation.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs uppercase text-offwhite-300/50">
            <AlertTriangle className="h-3.5 w-3.5" /> Risks
          </p>
          <ul className="space-y-1.5 text-xs leading-relaxed text-offwhite-300/70">
            {recommendation.risks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs uppercase text-offwhite-300/50">
            <ArrowRight className="h-3.5 w-3.5" /> Next actions
          </p>
          <ul className="space-y-1.5 text-xs leading-relaxed text-offwhite-300/70">
            {recommendation.nextActions.map((n) => (
              <li key={n}>{n}</li>
            ))}
            {recommendation.dataGaps.map((g) => (
              <li key={g} className="text-current-300/80">
                Data gap: {g}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
