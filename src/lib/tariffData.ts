// Illustrative open-access / tariff assumptions for the AINERGY energy planner.
// Figures are indicative starting points for exploration only — actual tariffs,
// surcharges and eligibility thresholds vary by DISCOM, year and tariff order,
// and must be confirmed against the applicable state tariff order before use
// in any commercial proposal.

export type ConsumerType = "commercial" | "industrial";
export type VoltageLevel = "11kV" | "33kV" | "66kV" | "132kV";
export type StateName = "Karnataka" | "Maharashtra" | "Rajasthan" | "Other";

export const STATES: StateName[] = ["Karnataka", "Maharashtra", "Rajasthan", "Other"];
export const VOLTAGE_LEVELS: VoltageLevel[] = ["11kV", "33kV", "66kV", "132kV"];

type TariffCell = { tariff: number; crossSubsidySurcharge: number };

// Rs/kWh energy tariff and cross-subsidy surcharge (CSS), by state + consumer
// type + voltage level. Indicative only — start with three states, extend
// this table as more state tariff orders are modeled.
const TARIFF_TABLE: Record<
  Exclude<StateName, "Other">,
  Record<ConsumerType, Record<VoltageLevel, TariffCell>>
> = {
  Karnataka: {
    commercial: {
      "11kV": { tariff: 8.9, crossSubsidySurcharge: 1.5 },
      "33kV": { tariff: 8.4, crossSubsidySurcharge: 1.3 },
      "66kV": { tariff: 8.0, crossSubsidySurcharge: 1.1 },
      "132kV": { tariff: 7.7, crossSubsidySurcharge: 0.9 },
    },
    industrial: {
      "11kV": { tariff: 7.8, crossSubsidySurcharge: 1.2 },
      "33kV": { tariff: 7.4, crossSubsidySurcharge: 1.0 },
      "66kV": { tariff: 7.1, crossSubsidySurcharge: 0.85 },
      "132kV": { tariff: 6.8, crossSubsidySurcharge: 0.7 },
    },
  },
  Maharashtra: {
    commercial: {
      "11kV": { tariff: 10.2, crossSubsidySurcharge: 1.9 },
      "33kV": { tariff: 9.6, crossSubsidySurcharge: 1.6 },
      "66kV": { tariff: 9.1, crossSubsidySurcharge: 1.4 },
      "132kV": { tariff: 8.7, crossSubsidySurcharge: 1.2 },
    },
    industrial: {
      "11kV": { tariff: 8.6, crossSubsidySurcharge: 1.4 },
      "33kV": { tariff: 8.1, crossSubsidySurcharge: 1.2 },
      "66kV": { tariff: 7.7, crossSubsidySurcharge: 1.0 },
      "132kV": { tariff: 7.3, crossSubsidySurcharge: 0.8 },
    },
  },
  Rajasthan: {
    commercial: {
      "11kV": { tariff: 7.9, crossSubsidySurcharge: 1.3 },
      "33kV": { tariff: 7.5, crossSubsidySurcharge: 1.1 },
      "66kV": { tariff: 7.2, crossSubsidySurcharge: 0.95 },
      "132kV": { tariff: 6.9, crossSubsidySurcharge: 0.8 },
    },
    industrial: {
      "11kV": { tariff: 7.0, crossSubsidySurcharge: 1.0 },
      "33kV": { tariff: 6.6, crossSubsidySurcharge: 0.85 },
      "66kV": { tariff: 6.3, crossSubsidySurcharge: 0.7 },
      "132kV": { tariff: 6.0, crossSubsidySurcharge: 0.6 },
    },
  },
};

// Wheeling loss (%) and wheeling charge (Rs/kWh) by voltage level — losses and
// charges reduce at higher voltage as fewer transformation stages are involved.
export const WHEELING_BY_VOLTAGE: Record<
  VoltageLevel,
  { lossPct: number; chargeRsPerKwh: number }
> = {
  "11kV": { lossPct: 5.5, chargeRsPerKwh: 1.1 },
  "33kV": { lossPct: 4.0, chargeRsPerKwh: 0.9 },
  "66kV": { lossPct: 2.8, chargeRsPerKwh: 0.7 },
  "132kV": { lossPct: 1.8, chargeRsPerKwh: 0.5 },
};

// Open-access eligibility threshold (sanctioned load, kVA) by state — below
// this, a consumer typically cannot avail open access under current rules.
export const OPEN_ACCESS_THRESHOLD_KVA: Record<StateName, number> = {
  Karnataka: 1000,
  Maharashtra: 1000,
  Rajasthan: 1000,
  Other: 1000,
};

const FALLBACK_TARIFF: Record<ConsumerType, Record<VoltageLevel, TariffCell>> = {
  commercial: {
    "11kV": { tariff: 8.5, crossSubsidySurcharge: 1.5 },
    "33kV": { tariff: 8.0, crossSubsidySurcharge: 1.3 },
    "66kV": { tariff: 7.6, crossSubsidySurcharge: 1.1 },
    "132kV": { tariff: 7.3, crossSubsidySurcharge: 0.9 },
  },
  industrial: {
    "11kV": { tariff: 7.5, crossSubsidySurcharge: 1.2 },
    "33kV": { tariff: 7.1, crossSubsidySurcharge: 1.0 },
    "66kV": { tariff: 6.8, crossSubsidySurcharge: 0.85 },
    "132kV": { tariff: 6.5, crossSubsidySurcharge: 0.7 },
  },
};

export function lookupTariff(
  state: StateName,
  consumerType: ConsumerType,
  voltage: VoltageLevel
): TariffCell {
  if (state === "Other") return FALLBACK_TARIFF[consumerType][voltage];
  return TARIFF_TABLE[state][consumerType][voltage];
}

// Solar generation-yield assumption (kWh/kWp/day), by state and mount type —
// used in the "How we calculated this" breakdown, not in the core sizing math
// (which uses a flat rule-of-thumb figure for simplicity across states).
export const GENERATION_YIELD: Record<
  Exclude<StateName, "Other">,
  { rooftop: number; ground: number }
> = {
  Karnataka: { rooftop: 4.6, ground: 4.8 },
  Maharashtra: { rooftop: 4.4, ground: 4.6 },
  Rajasthan: { rooftop: 5.1, ground: 5.4 },
};

export const DEFAULT_GENERATION_YIELD = { rooftop: 4.5, ground: 4.7 };

export function lookupGenerationYield(state: StateName) {
  if (state === "Other") return DEFAULT_GENERATION_YIELD;
  return GENERATION_YIELD[state];
}
