import { describe, expect, it } from "vitest";
import { computePlan, kwhFromBill, billFromKwh, type PlannerInputs } from "../optimizer";

const rajasthanBase: PlannerInputs = {
  state: "Rajasthan",
  consumerType: "industrial",
  voltageLevel: "33kV",
  sanctionedLoadKva: 5000,
  consumption: 900000, // kWh/month -> 10.8 GWh/yr
  tariff: 6.6,
  operatingHours: 16,
  renewableTarget: 60,
  rooftopArea: 50000,
  considerGround: true,
  groundArea: 10,
  considerWind: false,
  includeOpenAccess: true,
  considerBattery: false,
};

describe("kwhFromBill / billFromKwh", () => {
  it("round-trip within rounding tolerance", () => {
    const kwh = kwhFromBill(650000, 6.5);
    expect(kwh).toBeCloseTo(100000, -1);
    expect(billFromKwh(kwh, 6.5)).toBeCloseTo(650000, -1);
  });

  it("returns 0 kWh for a zero tariff (guards divide-by-zero)", () => {
    expect(kwhFromBill(1000, 0)).toBe(0);
  });
});

describe("computePlan — Open Access eligibility", () => {
  it("is eligible when sanctioned load is at/above the state threshold", () => {
    const result = computePlan(rajasthanBase);
    expect(result.openAccessEligible).toBe(true);
    expect(result.openAccessThresholdKva).toBe(1000);
  });

  it("is not eligible below the threshold, and open access kW stays 0", () => {
    const result = computePlan({ ...rajasthanBase, sanctionedLoadKva: 500 });
    expect(result.openAccessEligible).toBe(false);
    expect(result.openAccessKw).toBe(0);
  });
});

describe("computePlan — landed Open Access tariff", () => {
  it("itemizes third-party PPA + wheeling + losses + CSS + ASC + banking (see landedCost.ts)", () => {
    const result = computePlan(rajasthanBase);
    // Rajasthan 33kV industrial, from tariffData.ts: thirdPartyPpa 2.9,
    // wheeling 0.09 Rs/kWh @ 4.0% loss, CSS 1.48 (flat, RERC GEOA 2025), ASC
    // 0, banking 8% — see OPEN_ACCESS_CHARGES.Rajasthan["33kV"].
    const generationCost = 2.9;
    const wheeling = 0.09;
    const lossCost = Math.round(generationCost * (1 / (1 - 0.04) - 1) * 100) / 100;
    const css = 1.48;
    const asc = 0;
    const banking = Math.round(generationCost * 0.08 * 100) / 100;
    const expected = Math.round((generationCost + wheeling + lossCost + css + asc + banking) * 100) / 100;
    expect(result.landedOpenAccessTariff).toBeCloseTo(expected, 2);
    expect(result.landedCostBreakdown.route).toBe("third_party");
    expect(result.landedCostBreakdown.lineItems.length).toBeGreaterThan(0);
  });

  it("landed tariff falls as voltage rises (lower wheeling charge)", () => {
    const low = computePlan({ ...rajasthanBase, voltageLevel: "11kV" });
    const high = computePlan({ ...rajasthanBase, voltageLevel: "132kV" });
    expect(high.landedOpenAccessTariff).toBeLessThan(low.landedOpenAccessTariff);
  });
});

describe("computePlan — sizing and mix", () => {
  it("achieved renewable % never exceeds the requested target", () => {
    const result = computePlan(rajasthanBase);
    expect(result.achievedRenewablePct).toBeLessThanOrEqual(rajasthanBase.renewableTarget);
  });

  it("grid share + achieved renewable % sums to 100", () => {
    const result = computePlan(rajasthanBase);
    expect(result.gridSharePct + result.achievedRenewablePct).toBe(100);
  });

  it("rooftop sizing scales with available rooftop area", () => {
    const small = computePlan({ ...rajasthanBase, rooftopArea: 6000 });
    const large = computePlan({ ...rajasthanBase, rooftopArea: 600000 });
    expect(large.rooftopSolarKw).toBeGreaterThanOrEqual(small.rooftopSolarKw);
  });
});
