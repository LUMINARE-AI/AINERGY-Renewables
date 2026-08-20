// Illustrative open-access / tariff assumptions for the AINERGY energy planner.
// Figures are indicative starting points for exploration only — actual tariffs,
// surcharges and eligibility thresholds vary by DISCOM, year and tariff order,
// and must be confirmed against the applicable state tariff order before use
// in any commercial proposal. Each state's charge set below carries its own
// `source` / `sourceUrl` / `lastVerified` / `notes` so the provenance of every
// number is visible in the UI, not just baked into a constant.
//
// This file is the client-side, always-available baseline (used by the
// anonymous /energy-optimizer teaser). The same figures seed the DB-backed
// TariffProfile / OpenAccessCharge tables (prisma/seed.ts) that the
// authenticated app reads live and that /api/regulatory/refresh keeps current
// — see that route for how "auto-update when charges change" actually works.

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
  // CSS updated 2026-08-20: RERC's Green Energy Open Access (GEOA)
  // Regulations, 2025 (effective FY2026-27) applies a flat ₹1.48/kWh CSS
  // across voltage levels and consumer categories, per secondary reporting
  // (see OPEN_ACCESS_CHARGES.Rajasthan notes) — overriding the previous
  // per-voltage gradient this table used before that regulation was checked.
  Rajasthan: {
    commercial: {
      "11kV": { tariff: 7.9, crossSubsidySurcharge: 1.48 },
      "33kV": { tariff: 7.5, crossSubsidySurcharge: 1.48 },
      "66kV": { tariff: 7.2, crossSubsidySurcharge: 1.48 },
      "132kV": { tariff: 6.9, crossSubsidySurcharge: 1.48 },
    },
    industrial: {
      "11kV": { tariff: 7.0, crossSubsidySurcharge: 1.48 },
      "33kV": { tariff: 6.6, crossSubsidySurcharge: 1.48 },
      "66kV": { tariff: 6.3, crossSubsidySurcharge: 1.48 },
      "132kV": { tariff: 6.0, crossSubsidySurcharge: 1.48 },
    },
  },
};

// Full open-access charge stack by state + voltage level: wheeling (charge +
// loss), additional surcharge (ASC) and banking charge — the pieces that
// (together with CSS above) make up "landed cost", not just the headline PPA
// tariff. Each state's set is independently sourced and dated; `notes` is
// the honest caveat shown in the UI, matching the isPlaceholder convention
// already used for tariffs.
export type OpenAccessChargeSet = {
  wheelingChargeRsPerKwh: number;
  wheelingLossPct: number;
  additionalSurchargeRsPerKwh: number;
  bankingChargePct: number; // % of banked energy retained by the DISCOM
  source: string;
  sourceUrl: string;
  lastVerified: string; // ISO date — when this figure was last checked
  isPlaceholder: boolean;
  notes: string;
};

export const OPEN_ACCESS_CHARGES: Record<
  Exclude<StateName, "Other">,
  Record<VoltageLevel, OpenAccessChargeSet>
> = {
  Karnataka: {
    "11kV": { wheelingChargeRsPerKwh: 1.1, wheelingLossPct: 5.5, additionalSurchargeRsPerKwh: 0, bankingChargePct: 2, source: "AINERGY model, cross-checked against secondary reporting on KERC Open Access Regulations 2025/2026", sourceUrl: "https://solarsure.in/open-access-solar-charges-explained-wheeling-banking-css-more-india-2026/", lastVerified: "2026-08-20", isPlaceholder: false, notes: "Wheeling charge/loss retained from prior modeled estimates (directionally consistent with KERC's declining-by-voltage structure). ASC and banking corroborated by secondary sources (Solarsure, Mercom) — renewables are broadly ASC-exempt in Karnataka per multiple reports — but not checked line-by-line against the current KERC tariff order. Verify before commercial use." },
    "33kV": { wheelingChargeRsPerKwh: 0.9, wheelingLossPct: 4.0, additionalSurchargeRsPerKwh: 0, bankingChargePct: 2, source: "AINERGY model, cross-checked against secondary reporting on KERC Open Access Regulations 2025/2026", sourceUrl: "https://solarsure.in/open-access-solar-charges-explained-wheeling-banking-css-more-india-2026/", lastVerified: "2026-08-20", isPlaceholder: false, notes: "See 11kV note." },
    "66kV": { wheelingChargeRsPerKwh: 0.7, wheelingLossPct: 2.8, additionalSurchargeRsPerKwh: 0, bankingChargePct: 2, source: "AINERGY model, cross-checked against secondary reporting on KERC Open Access Regulations 2025/2026", sourceUrl: "https://solarsure.in/open-access-solar-charges-explained-wheeling-banking-css-more-india-2026/", lastVerified: "2026-08-20", isPlaceholder: false, notes: "See 11kV note." },
    "132kV": { wheelingChargeRsPerKwh: 0.5, wheelingLossPct: 1.8, additionalSurchargeRsPerKwh: 0, bankingChargePct: 2, source: "AINERGY model, cross-checked against secondary reporting on KERC Open Access Regulations 2025/2026", sourceUrl: "https://solarsure.in/open-access-solar-charges-explained-wheeling-banking-css-more-india-2026/", lastVerified: "2026-08-20", isPlaceholder: false, notes: "See 11kV note." },
  },
  Maharashtra: {
    "11kV": { wheelingChargeRsPerKwh: 0.95, wheelingLossPct: 9.0, additionalSurchargeRsPerKwh: 0.6, bankingChargePct: 8, source: "Indicative, per MERC MYT Order commentary (secondary reporting)", sourceUrl: "https://bridgewaypower.in/blog/solar-wheeling-charges-maharashtra-merc-2026", lastVerified: "2026-08-20", isPlaceholder: false, notes: "Voltage-level wheeling split sourced from a secondary aggregator citing MERC MYT trajectories (LT/11kV bracket). Banking corroborated at 8% by two independent secondary sources (up from a historical 2%). Verify against the current MERC tariff order before commercial use." },
    "33kV": { wheelingChargeRsPerKwh: 0.22, wheelingLossPct: 6.0, additionalSurchargeRsPerKwh: 0.45, bankingChargePct: 8, source: "Indicative, per MERC MYT Order commentary (secondary reporting)", sourceUrl: "https://bridgewaypower.in/blog/solar-wheeling-charges-maharashtra-merc-2026", lastVerified: "2026-08-20", isPlaceholder: false, notes: "See 11kV note." },
    "66kV": { wheelingChargeRsPerKwh: 0.22, wheelingLossPct: 6.0, additionalSurchargeRsPerKwh: 0.35, bankingChargePct: 8, source: "Indicative, per MERC MYT Order commentary (secondary reporting)", sourceUrl: "https://bridgewaypower.in/blog/solar-wheeling-charges-maharashtra-merc-2026", lastVerified: "2026-08-20", isPlaceholder: true, notes: "66kV grouped with the 33kV EHV bracket — the source only distinguished 33kV / 22-11kV / LT bands, not a separate 66kV figure. Treat as a rougher estimate than the other Maharashtra cells." },
    "132kV": { wheelingChargeRsPerKwh: 0.15, wheelingLossPct: 4.0, additionalSurchargeRsPerKwh: 0.25, bankingChargePct: 8, source: "Indicative, per MERC MYT Order commentary (secondary reporting)", sourceUrl: "https://bridgewaypower.in/blog/solar-wheeling-charges-maharashtra-merc-2026", lastVerified: "2026-08-20", isPlaceholder: true, notes: "Extrapolated below the 33kV figure — source did not report a distinct 132kV+ wheeling charge. Treat as a rougher estimate than the other Maharashtra cells." },
  },
  Rajasthan: {
    "11kV": { wheelingChargeRsPerKwh: 0.69, wheelingLossPct: 5.5, additionalSurchargeRsPerKwh: 0, bankingChargePct: 8, source: "RERC Green Energy Open Access (GEOA) Regulations, 2025 (effective FY2026-27), via secondary reporting", sourceUrl: "https://feeds.optenpower.com/blog/solar-open-access-rajasthan", lastVerified: "2026-08-20", isPlaceholder: false, notes: "Wheeling and CSS sourced from RERC GEOA Regulations 2025. ASC is largely inapplicable to captive/renewable open access under this regulation. Banking cited at 8% by this source; one other secondary source states 2% for Rajasthan — flagged discrepancy, verify against the primary RERC order. A separate ₹166.98/kW/month transmission (demand) charge also applies for long-term access and is not folded into this per-kWh figure." },
    "33kV": { wheelingChargeRsPerKwh: 0.09, wheelingLossPct: 4.0, additionalSurchargeRsPerKwh: 0, bankingChargePct: 8, source: "RERC Green Energy Open Access (GEOA) Regulations, 2025 (effective FY2026-27), via secondary reporting", sourceUrl: "https://feeds.optenpower.com/blog/solar-open-access-rajasthan", lastVerified: "2026-08-20", isPlaceholder: false, notes: "See 11kV note." },
    "66kV": { wheelingChargeRsPerKwh: 0.04, wheelingLossPct: 2.8, additionalSurchargeRsPerKwh: 0, bankingChargePct: 8, source: "RERC Green Energy Open Access (GEOA) Regulations, 2025 (effective FY2026-27), via secondary reporting", sourceUrl: "https://feeds.optenpower.com/blog/solar-open-access-rajasthan", lastVerified: "2026-08-20", isPlaceholder: true, notes: "Interpolated between the sourced 33kV and 132kV+ figures — no distinct 66kV figure was reported." },
    "132kV": { wheelingChargeRsPerKwh: 0.01, wheelingLossPct: 1.8, additionalSurchargeRsPerKwh: 0, bankingChargePct: 8, source: "RERC Green Energy Open Access (GEOA) Regulations, 2025 (effective FY2026-27), via secondary reporting", sourceUrl: "https://feeds.optenpower.com/blog/solar-open-access-rajasthan", lastVerified: "2026-08-20", isPlaceholder: false, notes: "See 11kV note." },
  },
};

const FALLBACK_OPEN_ACCESS_CHARGE: OpenAccessChargeSet = {
  wheelingChargeRsPerKwh: 0.8,
  wheelingLossPct: 4.5,
  additionalSurchargeRsPerKwh: 0.3,
  bankingChargePct: 5,
  source: "AINERGY generic illustrative estimate — state not yet individually modeled",
  sourceUrl: "",
  lastVerified: "2026-08-20",
  isPlaceholder: true,
  notes: "This state hasn't been individually researched yet — these are generic placeholder figures. Do not use for a commercial proposal.",
};

export function lookupOpenAccessCharges(
  state: StateName,
  voltageLevel: VoltageLevel
): OpenAccessChargeSet {
  if (state === "Other") return FALLBACK_OPEN_ACCESS_CHARGE;
  return OPEN_ACCESS_CHARGES[state][voltageLevel];
}

// Kept for backward compatibility with any remaining direct wheeling-only
// lookups — prefer lookupOpenAccessCharges() for new code, since it also
// carries ASC, banking and source metadata.
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

// Solar generation-yield assumption (kWh/kWp/day, DC basis), by state and
// mount type. ~4.5 kWh/kWp/day is a reasonable pan-India baseline; actual
// yield varies with irradiance (Rajasthan is meaningfully higher, coastal/
// cloudier regions lower) — used both in the "How we calculated this"
// breakdown and, from this revision, directly in the sizing/landed-cost math
// (previously the sizing math used a flat 4.5 regardless of state).
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

// Indicative delivered generation cost, Rs/kWh, for off-site renewable
// routes — the piece "landed cost" adds wheeling/CSS/ASC/banking on top of.
// Third-party PPA includes a developer margin; captive/group captive is
// closer to raw LCOE since the consumer effectively owns the generation.
// Both fall with state irradiance (higher generation yield -> lower LCOE per
// unit for the same capex) — illustrative, same rule-of-thumb discipline as
// the rest of this file, not a substitute for an actual PPA quote.
export const GENERATION_COST_RS_PER_KWH: Record<
  Exclude<StateName, "Other">,
  { thirdPartyPpa: number; captiveLcoe: number }
> = {
  Karnataka: { thirdPartyPpa: 3.1, captiveLcoe: 2.7 },
  Maharashtra: { thirdPartyPpa: 3.3, captiveLcoe: 2.9 },
  Rajasthan: { thirdPartyPpa: 2.9, captiveLcoe: 2.5 },
};

export const DEFAULT_GENERATION_COST_RS_PER_KWH = { thirdPartyPpa: 3.2, captiveLcoe: 2.8 };

export function lookupGenerationCost(state: StateName) {
  if (state === "Other") return DEFAULT_GENERATION_COST_RS_PER_KWH;
  return GENERATION_COST_RS_PER_KWH[state];
}
