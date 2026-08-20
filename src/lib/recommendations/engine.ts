// Deterministic recommendation rule engine — no LLM. An AI layer may explain
// this output in plain language later, but never decides the strategy or
// the numbers themselves, per the spec's AI LAYER scope.

import { rankScenarios, type ScenarioOutcome, type ScenarioStrategy } from "../calculations/scenarios";

export type RecommendationOutput = {
  recommendedStrategy: ScenarioStrategy;
  expectedSavingsRs: number;
  expectedSavingsPct: number;
  assumptions: string[];
  risks: string[];
  dataGaps: string[];
  nextActions: string[];
};

// Minimum estimated savings % before recommending a change from grid-only —
// an illustrative editorial threshold, not a regulatory or financial figure.
const SAVINGS_THRESHOLD_PCT = 10;

export function buildRecommendation(outcomes: ScenarioOutcome[]): RecommendationOutput {
  const gridOnly = outcomes.find((o) => o.strategy === "grid_only");
  const candidates = outcomes.filter((o) => o.eligible && o.strategy !== "grid_only");
  const ranked = rankScenarios(candidates.length > 0 ? candidates : outcomes);
  const best = ranked[0] ?? gridOnly;

  const meetsThreshold = !!best && best.strategy !== "grid_only" && best.savingsPct >= SAVINGS_THRESHOLD_PCT;
  const recommendedStrategy: ScenarioStrategy = meetsThreshold ? best!.strategy : "grid_only";
  const recommended = outcomes.find((o) => o.strategy === recommendedStrategy)!;

  const assumptions: string[] = [
    `Estimated ₹${recommended.deliveredCostRsPerKwh.toFixed(2)}/kWh delivered cost for ${recommended.label} is illustrative, based on rule-of-thumb sizing and tariff assumptions — not a vendor quote.`,
    "Open Access eligibility and landed-cost assumptions must be confirmed against the applicable state tariff order before use in any commercial proposal.",
  ];

  const risks: string[] = [
    "Regulatory and tariff-order changes can alter Open Access charges (wheeling, cross-subsidy surcharge, banking) year to year.",
  ];
  if (recommendedStrategy !== "grid_only" && !recommended.eligible) {
    risks.push(
      "Open Access eligibility is not currently met for the entered sanctioned load — confirm the applicable state threshold."
    );
  }
  if (recommendedStrategy === "captive" || recommendedStrategy === "group_captive") {
    risks.push(
      `${recommendedStrategy === "captive" ? "Captive" : "Group captive"} status requires meeting the 26% equity / 51% consumption test under Rule 3 of the Electricity Rules 2005 — not yet verified for this facility.`
    );
  }

  const dataGaps: string[] = [
    "No electricity bill has been uploaded or extracted yet — this analysis uses manually entered consumption and tariff figures.",
    "Time-of-day (TOD) consumption split is not yet captured, which can materially affect Open Access banking economics.",
  ];

  const nextActions: string[] = [
    "Upload recent electricity bills to replace manual estimates with verified consumption and tariff data.",
    "Confirm the applicable state Open Access regulations and charges with a licensed consultant before proceeding commercially.",
  ];
  if (recommendedStrategy !== "grid_only") {
    nextActions.push(`Model ${recommended.label} as an investment to see projected IRR, payback and DSCR.`);
  }

  return {
    recommendedStrategy,
    expectedSavingsRs: recommended.annualSavingsRs,
    expectedSavingsPct: recommended.savingsPct,
    assumptions,
    risks,
    dataGaps,
    nextActions,
  };
}
