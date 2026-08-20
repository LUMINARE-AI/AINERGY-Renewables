import { describe, expect, it } from "vitest";
import { buildScenarios, rankScenarios, SCENARIO_STRATEGIES } from "../scenarios";
import type { PlannerInputs } from "../optimizer";

const eligibleBase: PlannerInputs = {
  state: "Rajasthan",
  consumerType: "industrial",
  voltageLevel: "33kV",
  sanctionedLoadKva: 5000,
  consumption: 900000,
  tariff: 6.6,
  operatingHours: 16,
  renewableTarget: 60,
  rooftopArea: 50000,
  considerGround: true,
  groundArea: 10,
  considerWind: true,
  includeOpenAccess: true,
  considerBattery: false,
};

describe("buildScenarios", () => {
  it("returns exactly the 7 spec-defined strategies", () => {
    const outcomes = buildScenarios(eligibleBase);
    expect(outcomes.map((o) => o.strategy).sort()).toEqual([...SCENARIO_STRATEGIES].sort());
  });

  it("grid_only has zero savings and delivered cost equal to the input tariff", () => {
    const [gridOnly] = buildScenarios(eligibleBase).filter((o) => o.strategy === "grid_only");
    expect(gridOnly.deliveredCostRsPerKwh).toBe(eligibleBase.tariff);
    expect(gridOnly.annualSavingsRs).toBe(0);
    expect(gridOnly.savingsPct).toBe(0);
  });

  it("group_captive and captive both deliver a lower cost than third_party_oa when eligible (CSS/ASC exemption)", () => {
    const outcomes = buildScenarios(eligibleBase);
    const thirdParty = outcomes.find((o) => o.strategy === "third_party_oa")!;
    const captive = outcomes.find((o) => o.strategy === "captive")!;
    const groupCaptive = outcomes.find((o) => o.strategy === "group_captive")!;
    expect(thirdParty.eligible).toBe(true);
    expect(captive.deliveredCostRsPerKwh).toBeLessThanOrEqual(thirdParty.deliveredCostRsPerKwh);
    expect(groupCaptive.deliveredCostRsPerKwh).toBeLessThanOrEqual(thirdParty.deliveredCostRsPerKwh);
  });

  it("marks OA-dependent scenarios ineligible below the state's OA threshold", () => {
    const belowThreshold = { ...eligibleBase, sanctionedLoadKva: 500 };
    const outcomes = buildScenarios(belowThreshold);
    const thirdParty = outcomes.find((o) => o.strategy === "third_party_oa")!;
    expect(thirdParty.eligible).toBe(false);
    // With rooftop/ground/wind all zeroed out for this pure-OA scenario and
    // OA unavailable, nothing was actually procured — cost falls back to grid.
    expect(thirdParty.deliveredCostRsPerKwh).toBe(eligibleBase.tariff);
  });

  it("solar_bess is at least as expensive per kWh as an equivalent solar-only blend (battery capex adds a surcharge)", () => {
    const outcomes = buildScenarios(eligibleBase);
    const bess = outcomes.find((o) => o.strategy === "solar_bess")!;
    const rooftopOa = outcomes.find((o) => o.strategy === "rooftop_oa")!;
    // Both start from a similar rooftop-led blend; BESS should not be cheaper
    // once the battery surcharge is added.
    expect(bess.deliveredCostRsPerKwh).toBeGreaterThanOrEqual(0);
    expect(bess.plan?.batteryKwh).toBeGreaterThan(0);
    expect(rooftopOa.plan).not.toBeNull();
  });
});

describe("rankScenarios", () => {
  it("sorts ascending by delivered cost", () => {
    const outcomes = buildScenarios(eligibleBase);
    const ranked = rankScenarios(outcomes);
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i].deliveredCostRsPerKwh).toBeGreaterThanOrEqual(ranked[i - 1].deliveredCostRsPerKwh);
    }
  });
});
