import { describe, expect, it } from "vitest";
import {
  formatCrPerMw,
  formatInr,
  formatRange,
  formatRsPerWp,
} from "../format";

describe("formatInr", () => {
  it("uses Indian grouping below one lakh", () => {
    expect(formatInr(38025)).toBe("₹38,025");
  });

  it("uses Indian grouping for mid-lakh amounts", () => {
    expect(formatInr(3_80_250)).toBe("₹3,80,250");
  });

  it("switches to crores at one crore", () => {
    expect(formatInr(3_80_25_000)).toBe("₹3.80 Cr");
  });

  it("keeps two decimals for large crore values", () => {
    expect(formatInr(12_50_00_000)).toBe("₹12.50 Cr");
  });
});

describe("formatRsPerWp", () => {
  it("shows two decimal places", () => {
    expect(formatRsPerWp(28.45)).toBe("₹28.45 / Wp");
  });
});

describe("formatCrPerMw", () => {
  it("shows two decimals for typical values", () => {
    expect(formatCrPerMw(2.84)).toBe("₹2.84 Cr/MW");
  });

  it("shows three decimals when below 1", () => {
    expect(formatCrPerMw(0.845)).toBe("₹0.845 Cr/MW");
  });
});

describe("formatRange", () => {
  it("formats base and low–high band", () => {
    const range = formatRange({ low: 100, base: 150, high: 200 });
    expect(range.base).toBe("₹150");
    expect(range.band).toBe("₹100 – ₹200");
  });
});
