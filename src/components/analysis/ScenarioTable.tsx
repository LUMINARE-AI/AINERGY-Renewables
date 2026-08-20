import type { ScenarioOutcome } from "@/lib/calculations/scenarios";
import { cn } from "@/lib/utils";

const RISK_LABEL: Record<number, string> = {
  1: "Low",
  2: "Low–Moderate",
  3: "Moderate",
  4: "High",
};

export function ScenarioTable({ outcomes }: { outcomes: ScenarioOutcome[] }) {
  const best = [...outcomes]
    .filter((o) => o.eligible)
    .sort((a, b) => a.deliveredCostRsPerKwh - b.deliveredCostRsPerKwh)[0];

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-graphite-900/30">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-graphite-900/60 text-left text-xs uppercase tracking-wide text-offwhite-300/50">
            <th className="px-4 py-3 font-medium">Strategy</th>
            <th className="px-4 py-3 font-medium">Delivered Cost</th>
            <th className="px-4 py-3 font-medium">Annual Cost</th>
            <th className="px-4 py-3 font-medium">Annual Savings</th>
            <th className="px-4 py-3 font-medium">Savings %</th>
            <th className="px-4 py-3 font-medium">Risk</th>
          </tr>
        </thead>
        <tbody>
          {outcomes.map((o) => (
            <tr
              key={o.strategy}
              className={cn(
                "border-b border-white/5 last:border-0",
                o.strategy === best?.strategy && "bg-forest-400/[0.06]"
              )}
            >
              <td className="px-4 py-3 text-offwhite-100">
                {o.label}
                {o.strategy === best?.strategy && (
                  <span className="ml-2 rounded-full border border-forest-400/30 bg-forest-400/10 px-2 py-0.5 text-[10px] uppercase text-forest-300">
                    Best
                  </span>
                )}
                {!o.eligible && (
                  <span className="ml-2 rounded-full border border-current-400/30 bg-current-400/10 px-2 py-0.5 text-[10px] uppercase text-current-300">
                    Not eligible
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-offwhite-200">₹{o.deliveredCostRsPerKwh.toFixed(2)}/kWh</td>
              <td className="px-4 py-3 text-offwhite-200">₹{o.annualCostRs.toLocaleString("en-IN")}</td>
              <td
                className={cn(
                  "px-4 py-3",
                  o.annualSavingsRs > 0 ? "text-forest-300" : "text-offwhite-300/50"
                )}
              >
                ₹{o.annualSavingsRs.toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3 text-offwhite-200">{o.savingsPct}%</td>
              <td className="px-4 py-3 text-offwhite-300/70">{RISK_LABEL[o.riskScore] ?? o.riskScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-white/10 bg-graphite-950/40 px-4 py-3 text-xs text-offwhite-300/45">
        Illustrative estimate — not a commercial quotation. Figures use rule-of-thumb sizing and
        indicative tariff assumptions. Confirm against the applicable state tariff order before
        commercial use.
      </p>
    </div>
  );
}
