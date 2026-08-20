import { describe, expect, it } from "vitest";
import { buildRecommendation } from "../engine";
import { buildScenarios } from "../../calculations/scenarios";
import type { PlannerInputs } from "../../calculations/optimizer";

const strongCandidate: PlannerInputs = {
  state: "Rajasthan",
  consumerType: "industrial",
  voltageLevel: "132kV",
  sanctionedLoadKva: 5000,
  consumption: 900000,
  tariff: 6.9,
  operatingHours: 20,
  renewableTarget: 90,
  rooftopArea: 200000,
  considerGround: true,
  groundArea: 50,
  considerWind: true,
  includeOpenAccess: true,
  considerBattery: false,
};

// Small consumer, no rooftop/ground, and a low enough target capacity that
// even the forced-100%-target hybrid scenario can't clear the wind/ground
// minimum-viable-capacity floors — and too small a sanctioned load for Open
// Access. Every non-grid scenario should collapse to ~0% achieved.
const ineligibleSmallLoad: PlannerInputs = {
  state: "Rajasthan",
  consumerType: "commercial",
  voltageLevel: "11kV",
  sanctionedLoadKva: 150,
  consumption: 20000,
  tariff: 8,
  operatingHours: 10,
  renewableTarget: 60,
  rooftopArea: 0,
  considerGround: false,
  groundArea: 0,
  considerWind: false,
  includeOpenAccess: true,
  considerBattery: false,
};

describe("buildRecommendation", () => {
  it("recommends a non-grid strategy when a scenario clears the savings threshold", () => {
    const outcomes = buildScenarios(strongCandidate);
    const rec = buildRecommendation(outcomes);
    expect(rec.recommendedStrategy).not.toBe("grid_only");
    expect(rec.expectedSavingsPct).toBeGreaterThan(0);
    expect(rec.assumptions.length).toBeGreaterThan(0);
    expect(rec.assumptions.join(" ")).not.toMatch(/guarantee|assured/i);
  });

  it("falls back to grid_only when nothing is eligible or economical", () => {
    const outcomes = buildScenarios(ineligibleSmallLoad);
    const rec = buildRecommendation(outcomes);
    expect(rec.recommendedStrategy).toBe("grid_only");
    expect(rec.expectedSavingsRs).toBe(0);
  });

  it("flags the captive equity/consumption test as a risk when recommending captive or group captive", () => {
    const outcomes = buildScenarios(strongCandidate);
    const rec = buildRecommendation(outcomes);
    if (rec.recommendedStrategy === "captive" || rec.recommendedStrategy === "group_captive") {
      expect(rec.risks.join(" ")).toMatch(/26% equity/);
    }
  });
});
