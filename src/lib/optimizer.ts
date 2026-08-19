// Illustrative sizing logic for the AINERGY energy planner demo.
// All constants are rule-of-thumb approximations for a demonstration tool,
// not engineering figures — see the disclaimer on /energy-optimizer.

import {
  type ConsumerType,
  type VoltageLevel,
  type StateName,
  WHEELING_BY_VOLTAGE,
  OPEN_ACCESS_THRESHOLD_KVA,
} from "./tariffData";

export type PlannerInputs = {
  state: StateName;
  consumerType: ConsumerType;
  voltageLevel: VoltageLevel;
  sanctionedLoadKva: number;
  consumption: number; // kWh/month
  tariff: number; // Rs/kWh
  operatingHours: number; // hrs/day
  renewableTarget: number; // %
  rooftopArea: number; // sq ft
  considerGround: boolean;
  groundArea: number; // acres
  considerWind: boolean;
  includeOpenAccess: boolean;
};

export type PlannerResult = {
  targetSolarEquivKw: number;
  rooftopPotentialKw: number;
  rooftopSolarKw: number;
  rooftopSharePct: number;
  groundPotentialKw: number;
  groundSolarKw: number;
  groundSolarViable: boolean;
  groundSharePct: number;
  windRequiredKw: number;
  windKw: number;
  windViable: boolean;
  windSharePct: number;
  openAccessKw: number;
  openAccessSharePct: number;
  achievedRenewablePct: number;
  gridSharePct: number;
  costReductionPct: number;
  monthlySavings: number;
  co2AvoidedTpa: number;
  recommendOpenAccessPrimary: boolean;
  batteryKwh: number;
  openAccessEligible: boolean;
  openAccessThresholdKva: number;
  wheelingLossPct: number;
  wheelingChargeRsPerKwh: number;
  landedOpenAccessTariff: number;
  projectCostEstimateRs: number;
};

const SQFT_PER_KW_ROOFTOP = 60;
const ACRES_PER_KW_GROUND = 3.5 / 1000; // 3.5 acres per MW of ground-mounted solar
const GROUND_MIN_VIABLE_KW = 1000; // 1 MW — below this, on-site ground-mount isn't practical
const WIND_MIN_VIABLE_KW = 2000; // 2 MW — below this, captive wind isn't practical
const SMALL_LOAD_KWH = 50000; // monthly consumption below which a business is "small"
const LOW_ROOFTOP_COVERAGE = 0.25; // rooftop covers under 25% of target

// Rough blended capex assumptions, Rs per kW installed — indicative only.
const CAPEX_RS_PER_KW = { rooftop: 42000, ground: 38000, wind: 68000 };

export const BATTERY_BRIDGING_HOURS = 3;

export function kwhFromBill(billRs: number, tariff: number): number {
  return tariff > 0 ? Math.round(billRs / tariff) : 0;
}

export function billFromKwh(kwh: number, tariff: number): number {
  return Math.round(kwh * tariff);
}

export function computePlan(inputs: PlannerInputs): PlannerResult {
  const dailyKwh = inputs.consumption / 30;
  const targetKwh = (dailyKwh * inputs.renewableTarget) / 100;
  const targetSolarEquivKw = targetKwh / 4.5;

  const share = (kw: number) =>
    targetSolarEquivKw > 0
      ? (kw / targetSolarEquivKw) * inputs.renewableTarget
      : 0;

  let remainingKw = targetSolarEquivKw;

  const rooftopPotentialKw = Math.round(inputs.rooftopArea / SQFT_PER_KW_ROOFTOP);
  const rooftopSolarKw = Math.min(rooftopPotentialKw, remainingKw);
  remainingKw -= rooftopSolarKw;

  const groundPotentialKw = Math.round(inputs.groundArea / ACRES_PER_KW_GROUND);
  const groundSolarViable =
    inputs.considerGround && groundPotentialKw >= GROUND_MIN_VIABLE_KW;
  const groundSolarKw = groundSolarViable
    ? Math.min(groundPotentialKw, remainingKw)
    : 0;
  remainingKw -= groundSolarKw;

  const windRequiredKw = Math.round(remainingKw * 0.7);
  const windViable = inputs.considerWind && windRequiredKw >= WIND_MIN_VIABLE_KW;
  const windKw = windViable ? windRequiredKw : 0;
  remainingKw -= windKw;

  const openAccessThresholdKva = OPEN_ACCESS_THRESHOLD_KVA[inputs.state];
  const openAccessEligible = inputs.sanctionedLoadKva >= openAccessThresholdKva;

  const openAccessKw =
    inputs.includeOpenAccess && openAccessEligible && remainingKw > 0
      ? Math.round(remainingKw)
      : 0;

  const rooftopSharePct = share(rooftopSolarKw);
  const groundSharePct = share(groundSolarKw);
  const windSharePct = share(windKw);
  const openAccessSharePct = share(openAccessKw);

  const achievedRenewablePct = Math.min(
    100,
    Math.round(rooftopSharePct + groundSharePct + windSharePct + openAccessSharePct)
  );
  const gridSharePct = Math.max(0, 100 - achievedRenewablePct);

  const { lossPct: wheelingLossPct, chargeRsPerKwh: wheelingChargeRsPerKwh } =
    WHEELING_BY_VOLTAGE[inputs.voltageLevel];
  const landedOpenAccessTariff =
    Math.round((inputs.tariff * (1 - 0.18) + wheelingChargeRsPerKwh) * 100) / 100;

  const costReductionPct = Math.min(45, Math.round(6 + achievedRenewablePct * 0.35));
  const monthlySavings = Math.round(
    (inputs.consumption * inputs.tariff * costReductionPct) / 100
  );
  const co2AvoidedTpa = Math.round(
    (rooftopSolarKw + groundSolarKw + windKw + openAccessKw) * 1.7
  );

  const rooftopCoverageRatio =
    targetSolarEquivKw > 0 ? rooftopPotentialKw / targetSolarEquivKw : 0;
  const recommendOpenAccessPrimary =
    inputs.consumption < SMALL_LOAD_KWH && rooftopCoverageRatio < LOW_ROOFTOP_COVERAGE;

  // Battery sized to bridge a ~3-hour window of non-solar/non-wind hours
  // within the site's operating day — a rule-of-thumb starting point, not a
  // load-curve-based sizing.
  const batteryKwh = Math.round(
    (inputs.consumption / 30 / inputs.operatingHours) * BATTERY_BRIDGING_HOURS
  );

  const projectCostEstimateRs = Math.round(
    rooftopSolarKw * CAPEX_RS_PER_KW.rooftop +
      groundSolarKw * CAPEX_RS_PER_KW.ground +
      windKw * CAPEX_RS_PER_KW.wind
  );

  return {
    targetSolarEquivKw: Math.round(targetSolarEquivKw),
    rooftopPotentialKw,
    rooftopSolarKw: Math.round(rooftopSolarKw),
    rooftopSharePct,
    groundPotentialKw,
    groundSolarKw: Math.round(groundSolarKw),
    groundSolarViable,
    groundSharePct,
    windRequiredKw,
    windKw: Math.round(windKw),
    windViable,
    windSharePct,
    openAccessKw,
    openAccessSharePct,
    achievedRenewablePct,
    gridSharePct,
    costReductionPct,
    monthlySavings,
    co2AvoidedTpa,
    recommendOpenAccessPrimary,
    batteryKwh,
    openAccessEligible,
    openAccessThresholdKva,
    wheelingLossPct,
    wheelingChargeRsPerKwh,
    landedOpenAccessTariff,
    projectCostEstimateRs,
  };
}
