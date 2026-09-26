import { AlertTriangle } from "lucide-react";
import {
  formatInr,
  formatNumber,
  formatPct,
  formatRate,
  formatYears,
  isFinancialScenario,
  routeLabel,
} from "@/lib/copilot/format";
import { LANDED_COST_ROUTES, type FinancialScenario, type LandedCostResult } from "@/lib/copilot/types";
import { cn } from "@/lib/utils";

function scenariosOf(result: LandedCostResult): FinancialScenario[] {
  const analysis = result.financialAnalysis;
  if (!analysis) return [];
  if (Array.isArray(analysis)) return analysis.filter(isFinancialScenario);
  return Object.values(analysis).filter(isFinancialScenario);
}

export function indicativeCopy(result: LandedCostResult): string | null {
  const placeholder = Object.values(result.routes).some((route) => route?.isPlaceholder);
  if (!result.dataQualityWarning && !placeholder) return null;
  return result.dataQualityWarning
    ? `Indicative figures, verify before signing. ${result.dataQualityWarning}`
    : "Indicative figures, verify before signing.";
}

export function LandedCostCard({ result }: { result: LandedCostResult }) {
  const routes = LANDED_COST_ROUTES.map((key) => result.routes[key]).filter(
    (route): route is NonNullable<typeof route> => Boolean(route)
  );
  const banner = indicativeCopy(result);
  const scenarios = scenariosOf(result);

  return (
    <div className="space-y-4">
      {banner && (
        <div className="flex items-start gap-2.5 rounded-xl border border-current-500/30 bg-current-400/10 p-4 text-sm leading-relaxed text-ink-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-current-700" />
          <p>{banner}</p>
        </div>
      )}

      <div className="grid gap-2 text-xs text-ink-600 sm:grid-cols-2">
        <p>
          Open access: {result.eligibility?.eligible ? "eligible" : "not eligible"}
          {result.eligibility?.thresholdKw != null &&
            ` (threshold ${formatNumber(result.eligibility.thresholdKw, 0)} kW)`}
        </p>
        <p>
          Captive: {result.captiveEligibility?.eligible ? "eligible" : "not eligible"}
          {result.captiveEligibility?.thresholdKw != null &&
            ` (threshold ${formatNumber(result.captiveEligibility.thresholdKw, 0)} kW)`}
        </p>
      </div>

      {routes.length === 0 ? (
        <p className="text-sm text-ink-500">No route comparison came back.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {routes.map((route) => {
            const savings = result.savings?.[route.route];
            const recommended = result.recommendedRoute === route.route;
            return (
              <article
                key={route.route}
                className={cn(
                  "rounded-2xl border p-4",
                  recommended
                    ? "border-forest-500/40 bg-forest-500/[0.06]"
                    : "border-ink-900/10 bg-paper-100/70"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono-tag text-[10px] uppercase text-ink-500">
                      {routeLabel(route.route)}
                      {recommended ? " · recommended" : ""}
                    </p>
                    <p className="mt-1 font-display text-2xl text-ink-900">
                      {formatRate(route.landedCostRsPerKwh)}
                    </p>
                  </div>
                  {route.isPlaceholder && (
                    <span className="rounded-full border border-current-500/30 bg-current-400/10 px-2 py-0.5 text-[10px] font-medium text-current-800">
                      Placeholder
                    </span>
                  )}
                </div>
                {route.route !== "grid" && savings && (
                  <p className="mt-2 text-xs text-ink-600">
                    Vs grid {formatRate(savings.vsGridRsPerKwh)} ({formatPct(savings.vsGridPct)})
                  </p>
                )}
                {route.lineItems.length > 0 && (
                  <ul className="mt-3 space-y-1.5 border-t border-ink-900/8 pt-3">
                    {route.lineItems.map((item) => (
                      <li key={`${route.route}-${item.label}`} className="flex items-start justify-between gap-3 text-xs">
                        <span className="text-ink-600">
                          {item.label}
                          {item.note ? <span className="mt-0.5 block text-[11px] text-ink-400">{item.note}</span> : null}
                        </span>
                        <span className="shrink-0 font-medium text-ink-900">{formatRate(item.valueRsPerKwh)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {route.notes.length > 0 && (
                  <ul className="mt-3 space-y-1 text-[11px] leading-relaxed text-ink-500">
                    {route.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      )}

      {scenarios.length > 0 && (
        <details className="rounded-2xl border border-ink-900/10 bg-paper-50 p-4">
          <summary className="cursor-pointer text-sm font-medium text-ink-800">
            Financial scenarios
          </summary>
          <div className="mt-4 space-y-4">
            {scenarios.map((scenario) => (
              <div key={scenario.route} className="grid gap-2 text-xs text-ink-700 sm:grid-cols-2">
                <p className="font-medium text-ink-900 sm:col-span-2">{routeLabel(scenario.route)}</p>
                <p>Annual energy {formatNumber(scenario.annualEnergyKwh, 0)} kWh</p>
                <p>Annual cost {formatInr(scenario.annualCostRs)}</p>
                <p>Annual savings {formatInr(scenario.annualSavingsRs)}</p>
                <p>Investment {formatInr(scenario.investmentRs)}</p>
                <p>Payback {formatYears(scenario.paybackYears)}</p>
                <p>NPV {formatInr(scenario.npvRs)}</p>
                <p>IRR {formatPct(scenario.irrPct)}</p>
                <p>Equity IRR {formatPct(scenario.equityIrrPct)}</p>
                <p>Equity {formatInr(scenario.equityInvestmentRs)}</p>
                <p>Debt {formatInr(scenario.debtRs)}</p>
                <p>Debt service {formatInr(scenario.debtServiceRsPerYear)}/year</p>
                {scenario.notes.map((note) => (
                  <p key={note} className="sm:col-span-2 text-ink-500">
                    {note}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
