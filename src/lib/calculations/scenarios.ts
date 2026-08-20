// Scenario engine — promotes the mix categories already produced by
// computePlan() (rooftop / ground / wind / open access / grid shares) into
// six first-class, independently comparable procurement scenarios. Same
// rule-of-thumb discipline as optimizer.ts: deterministic, no LLM,
// illustrative constants, not engineering figures.

import { computePlan, type PlannerInputs, type PlannerResult } from "./optimizer";
import {
  computeGridLandedCost,
  computeThirdPartyLandedCost,
  computeCaptiveLandedCost,
  computeGroupCaptiveLandedCost,
  type LandedCostBreakdown,
} from "./landedCost";

export type ScenarioStrategy =
  | "grid_only"
  | "third_party_oa"
  | "captive"
  | "group_captive"
  | "solar_wind_hybrid"
  | "solar_bess"
  | "rooftop_oa";

export const SCENARIO_STRATEGIES: ScenarioStrategy[] = [
  "grid_only",
  "third_party_oa",
  "captive",
  "group_captive",
  "solar_wind_hybrid",
  "solar_bess",
  "rooftop_oa",
];

export const SCENARIO_LABELS: Record<ScenarioStrategy, string> = {
  grid_only: "Grid only",
  third_party_oa: "Third-party solar Open Access",
  captive: "Captive solar",
  group_captive: "Group captive solar",
  solar_wind_hybrid: "Solar + wind hybrid",
  solar_bess: "Solar + BESS",
  rooftop_oa: "Rooftop + Open Access",
};

// Illustrative 1 (low) – 5 (high) procurement/execution risk, not a
// regulatory or financial claim — reflects counterparty, structuring and
// asset-count complexity relative to the status quo.
export const SCENARIO_RISK_SCORE: Record<ScenarioStrategy, number> = {
  grid_only: 1,
  rooftop_oa: 2,
  solar_bess: 2,
  solar_wind_hybrid: 3,
  third_party_oa: 3,
  captive: 4,
  group_captive: 4,
};

export type ScenarioOutcome = {
  strategy: ScenarioStrategy;
  label: string;
  deliveredCostRsPerKwh: number;
  annualCostRs: number;
  annualSavingsRs: number;
  savingsPct: number;
  riskScore: number;
  eligible: boolean;
  plan: PlannerResult | null;
  /** Itemized landed-cost line items for the off-site (OA/captive/group
   * captive) portion of this scenario, or null for grid_only and the
   * on-site-only routes — the source the "current landing cost vs open
   * access vs captive vs group captive" comparison UI renders. */
  landedCostBreakdown: LandedCostBreakdown | null;
  /** Capex the Investment Path module should model for this scenario, or
   * null when the strategy has no owned/co-owned asset to finance (grid_only
   * has nothing to build; third_party_oa is a PPA, not an owned asset). */
  investableCapexRs: number | null;
};

// Indicative self-owned generation LCOE, Rs/kWh — rule-of-thumb constants in
// the same spirit as optimizer.ts's CAPEX_RS_PER_KW, not engineering figures.
const ROOFTOP_SELF_COST_RS_PER_KWH = 3.6;
const GROUND_SELF_COST_RS_PER_KWH = 3.3;
const WIND_SELF_COST_RS_PER_KWH = 3.9;

const BESS_CAPEX_RS_PER_KWH = 20000; // indicative BESS capex, Rs per kWh of capacity
const BESS_LIFE_YEARS = 10;

// Group captive plants are typically remote (not built on the consumer's own
// site), so there's no rooftop/ground area to size against here — capex is
// approximated as the member's proportional stake, sized off the kW served
// through the captive route, at a blended ground-mount-ish rate.
const CAPTIVE_CAPEX_RS_PER_KW = 40000;

type LandedRoute = "third_party" | "captive" | "group_captive";

function landedCostFor(
  route: LandedRoute,
  base: PlannerInputs,
  voltageLevel: PlannerInputs["voltageLevel"]
): LandedCostBreakdown {
  const args = {
    state: base.state,
    consumerType: base.consumerType,
    voltageLevel,
    gridTariffRsPerKwh: base.tariff,
  };
  if (route === "captive") return computeCaptiveLandedCost(args);
  if (route === "group_captive") return computeGroupCaptiveLandedCost(args);
  return computeThirdPartyLandedCost(args);
}

function blendedDeliveredCost(
  plan: PlannerResult,
  base: PlannerInputs,
  route: LandedRoute
): { deliveredCostRsPerKwh: number; breakdown: LandedCostBreakdown } {
  const breakdown = landedCostFor(route, base, base.voltageLevel);
  const oaRate = breakdown.landedCostRsPerKwh;
  const weighted =
    (plan.rooftopSharePct / 100) * ROOFTOP_SELF_COST_RS_PER_KWH +
    (plan.groundSharePct / 100) * GROUND_SELF_COST_RS_PER_KWH +
    (plan.windSharePct / 100) * WIND_SELF_COST_RS_PER_KWH +
    (plan.openAccessSharePct / 100) * oaRate +
    (plan.gridSharePct / 100) * base.tariff;
  return { deliveredCostRsPerKwh: Math.round(weighted * 100) / 100, breakdown };
}

function bessSurchargeRsPerKwh(batteryKwh: number, annualConsumptionKwh: number): number {
  if (annualConsumptionKwh <= 0) return 0;
  const annualizedCapex = (batteryKwh * BESS_CAPEX_RS_PER_KWH) / BESS_LIFE_YEARS;
  return annualizedCapex / annualConsumptionKwh;
}

function outcome(
  strategy: ScenarioStrategy,
  base: PlannerInputs,
  deliveredCostRsPerKwh: number,
  gridOnlyAnnualCostRs: number,
  eligible: boolean,
  plan: PlannerResult | null,
  investableCapexRs: number | null = null,
  landedCostBreakdown: LandedCostBreakdown | null = null
): ScenarioOutcome {
  const annualCostRs = Math.round(deliveredCostRsPerKwh * base.consumption * 12);
  const annualSavingsRs = Math.round(gridOnlyAnnualCostRs - annualCostRs);
  const savingsPct =
    gridOnlyAnnualCostRs > 0 ? Math.round((annualSavingsRs / gridOnlyAnnualCostRs) * 1000) / 10 : 0;
  return {
    strategy,
    label: SCENARIO_LABELS[strategy],
    deliveredCostRsPerKwh,
    annualCostRs,
    annualSavingsRs,
    savingsPct,
    riskScore: SCENARIO_RISK_SCORE[strategy],
    eligible,
    plan,
    landedCostBreakdown,
    investableCapexRs,
  };
}

/**
 * Computes all six procurement scenarios for a consumption profile. Each
 * non-grid scenario targets 100% renewable replacement (rather than the
 * user's chosen target %) so scenarios show each strategy's economics at its
 * own ceiling — useful for comparison, distinct from the single blended plan
 * `/energy-optimizer` shows for one user-chosen target %.
 */
export function buildScenarios(base: PlannerInputs): ScenarioOutcome[] {
  const gridOnlyAnnualCostRs = Math.round(base.tariff * base.consumption * 12);

  const results: ScenarioOutcome[] = [];

  const gridLanded = computeGridLandedCost({
    state: base.state,
    consumerType: base.consumerType,
    voltageLevel: base.voltageLevel,
    gridTariffRsPerKwh: base.tariff,
  });
  results.push(outcome("grid_only", base, base.tariff, gridOnlyAnnualCostRs, true, null, null, gridLanded));

  const thirdPartyInputs: PlannerInputs = {
    ...base,
    renewableTarget: 100,
    rooftopArea: 0,
    groundArea: 0,
    considerGround: false,
    considerWind: false,
    includeOpenAccess: true,
    considerBattery: false,
  };
  const thirdPartyPlan = computePlan(thirdPartyInputs);
  const thirdPartyCost = blendedDeliveredCost(thirdPartyPlan, base, "third_party");
  results.push(
    outcome(
      "third_party_oa",
      base,
      thirdPartyPlan.achievedRenewablePct > 0 ? thirdPartyCost.deliveredCostRsPerKwh : base.tariff,
      gridOnlyAnnualCostRs,
      thirdPartyPlan.openAccessEligible,
      thirdPartyPlan,
      null,
      thirdPartyCost.breakdown
    )
  );

  // Captive: single-owner off-site plant, sized/eligible the same way as
  // third-party OA (same underlying computePlan sizing), but CSS/ASC-exempt
  // per the captive test (see landedCost.ts). Capex is modeled as the
  // consumer's own stake in the plant, same rate as group captive.
  const captivePlan = thirdPartyPlan;
  const captiveCost = blendedDeliveredCost(captivePlan, base, "captive");
  results.push(
    outcome(
      "captive",
      base,
      captivePlan.achievedRenewablePct > 0 ? captiveCost.deliveredCostRsPerKwh : base.tariff,
      gridOnlyAnnualCostRs,
      captivePlan.openAccessEligible,
      captivePlan,
      captivePlan.openAccessKw > 0 ? Math.round(captivePlan.openAccessKw * CAPTIVE_CAPEX_RS_PER_KW) : null,
      captiveCost.breakdown
    )
  );

  // Group captive: pooled ownership (26% equity / 51% consumption test)
  // rather than a single owner — same landed-cost treatment as captive
  // (both CSS/ASC-exempt), kept as a distinct scenario since ownership
  // structure and the Investment Path IRR inputs differ.
  const groupCaptivePlan = thirdPartyPlan;
  const groupCaptiveCost = blendedDeliveredCost(groupCaptivePlan, base, "group_captive");
  results.push(
    outcome(
      "group_captive",
      base,
      groupCaptivePlan.achievedRenewablePct > 0 ? groupCaptiveCost.deliveredCostRsPerKwh : base.tariff,
      gridOnlyAnnualCostRs,
      groupCaptivePlan.openAccessEligible,
      groupCaptivePlan,
      groupCaptivePlan.openAccessKw > 0
        ? Math.round(groupCaptivePlan.openAccessKw * CAPTIVE_CAPEX_RS_PER_KW)
        : null,
      groupCaptiveCost.breakdown
    )
  );

  const hybridInputs: PlannerInputs = {
    ...base,
    renewableTarget: 100,
    considerGround: true,
    considerWind: true,
    includeOpenAccess: true,
    considerBattery: false,
  };
  const hybridPlan = computePlan(hybridInputs);
  const hybridCost = blendedDeliveredCost(hybridPlan, base, "third_party");
  results.push(
    outcome(
      "solar_wind_hybrid",
      base,
      hybridCost.deliveredCostRsPerKwh,
      gridOnlyAnnualCostRs,
      true,
      hybridPlan,
      hybridPlan.projectCostEstimateRs > 0 ? hybridPlan.projectCostEstimateRs : null,
      hybridCost.breakdown
    )
  );

  const bessInputs: PlannerInputs = {
    ...base,
    renewableTarget: 100,
    groundArea: 0,
    considerGround: false,
    considerWind: false,
    includeOpenAccess: false,
    considerBattery: true,
  };
  const bessPlan = computePlan(bessInputs);
  const bessCost = blendedDeliveredCost(bessPlan, base, "third_party");
  const bessSurcharge = bessSurchargeRsPerKwh(bessPlan.batteryKwh, base.consumption * 12);
  results.push(
    outcome(
      "solar_bess",
      base,
      Math.round((bessCost.deliveredCostRsPerKwh + bessSurcharge) * 100) / 100,
      gridOnlyAnnualCostRs,
      true,
      bessPlan,
      bessPlan.projectCostEstimateRs + bessPlan.batteryKwh * BESS_CAPEX_RS_PER_KWH,
      bessCost.breakdown
    )
  );

  const rooftopOaInputs: PlannerInputs = {
    ...base,
    renewableTarget: 100,
    groundArea: 0,
    considerGround: false,
    considerWind: false,
    includeOpenAccess: true,
    considerBattery: false,
  };
  const rooftopOaPlan = computePlan(rooftopOaInputs);
  const rooftopOaCost = blendedDeliveredCost(rooftopOaPlan, base, "third_party");
  results.push(
    outcome(
      "rooftop_oa",
      base,
      rooftopOaCost.deliveredCostRsPerKwh,
      gridOnlyAnnualCostRs,
      true,
      rooftopOaPlan,
      rooftopOaPlan.projectCostEstimateRs > 0 ? rooftopOaPlan.projectCostEstimateRs : null,
      rooftopOaCost.breakdown
    )
  );

  return results;
}

export function rankScenarios(outcomes: ScenarioOutcome[]): ScenarioOutcome[] {
  return [...outcomes].sort((a, b) => a.deliveredCostRsPerKwh - b.deliveredCostRsPerKwh);
}
