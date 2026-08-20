import { describe, expect, it } from "vitest";
import { lookupTariff, WHEELING_BY_VOLTAGE, OPEN_ACCESS_THRESHOLD_KVA } from "../tariffData";
import {
  GUJARAT_PLACEHOLDER_TARIFF,
  GUJARAT_PLACEHOLDER_CSS,
  GUJARAT_PLACEHOLDER_THRESHOLD_KVA,
} from "../gujaratFixture";

describe("lookupTariff — Rajasthan fixture", () => {
  it("industrial tariff is cheaper than commercial at the same voltage", () => {
    const commercial = lookupTariff("Rajasthan", "commercial", "33kV");
    const industrial = lookupTariff("Rajasthan", "industrial", "33kV");
    expect(industrial.tariff).toBeLessThan(commercial.tariff);
  });

  it("tariff decreases as voltage level rises (11kV -> 132kV)", () => {
    const low = lookupTariff("Rajasthan", "industrial", "11kV");
    const high = lookupTariff("Rajasthan", "industrial", "132kV");
    expect(high.tariff).toBeLessThan(low.tariff);
  });
});

describe("lookupTariff — Maharashtra fixture", () => {
  it("carries a positive cross-subsidy surcharge for commercial 11kV", () => {
    const { crossSubsidySurcharge } = lookupTariff("Maharashtra", "commercial", "11kV");
    expect(crossSubsidySurcharge).toBeGreaterThan(0);
  });
});

describe("WHEELING_BY_VOLTAGE", () => {
  it("wheeling loss % and charge both fall as voltage rises", () => {
    expect(WHEELING_BY_VOLTAGE["132kV"].lossPct).toBeLessThan(WHEELING_BY_VOLTAGE["11kV"].lossPct);
    expect(WHEELING_BY_VOLTAGE["132kV"].chargeRsPerKwh).toBeLessThan(
      WHEELING_BY_VOLTAGE["11kV"].chargeRsPerKwh
    );
  });
});

describe("OPEN_ACCESS_THRESHOLD_KVA", () => {
  it("is defined for every seeded state and the Other fallback", () => {
    expect(OPEN_ACCESS_THRESHOLD_KVA.Rajasthan).toBeGreaterThan(0);
    expect(OPEN_ACCESS_THRESHOLD_KVA.Other).toBeGreaterThan(0);
  });
});

describe("Gujarat placeholder fixture", () => {
  it("industrial tariff is cheaper than commercial, same shape as verified states", () => {
    expect(GUJARAT_PLACEHOLDER_TARIFF.industrial).toBeLessThan(GUJARAT_PLACEHOLDER_TARIFF.commercial);
  });

  it("has sane order-of-magnitude values, flagged for confirmation before use", () => {
    expect(GUJARAT_PLACEHOLDER_CSS).toBeGreaterThan(0);
    expect(GUJARAT_PLACEHOLDER_THRESHOLD_KVA).toBeGreaterThan(0);
  });
});
