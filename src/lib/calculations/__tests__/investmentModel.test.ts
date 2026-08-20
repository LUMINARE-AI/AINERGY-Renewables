import { describe, expect, it } from "vitest";
import { computeInvestmentModel, irrBisection, type InvestmentInputs } from "../investmentModel";

const baseInputs: InvestmentInputs = {
  capexRs: 10_000_000,
  debtEquityRatio: 0,
  debtRatePct: 9,
  debtTenorYears: 10,
  annualAvoidedCostRs: 2_000_000,
  revenueEscalationPct: 0,
  omRsPerYear: 150_000,
  omEscalationPct: 3,
  depreciationPct: 5,
  taxRatePct: 25,
  discountRatePct: 10,
  projectLifeYears: 15,
};

describe("irrBisection", () => {
  it("finds the known IRR of a simple two-cashflow series", () => {
    // -100 today, +121 in year 2 -> ~10% IRR (1.1^2 = 1.21)
    const irr = irrBisection([-100, 0, 121]);
    expect(irr).not.toBeNull();
    expect(irr!).toBeCloseTo(0.1, 2);
  });

  it("returns null when the series never turns negative (no NPV root at all)", () => {
    // All-positive cash flows: NPV(r) > 0 for every r > -1, so there's no
    // root in the searched range — unlike an outlay-then-inflows series,
    // which by construction always has a (possibly deeply negative) IRR.
    const irr = irrBisection([50, 50, 50]);
    expect(irr).toBeNull();
  });
});

describe("computeInvestmentModel — leverage direction", () => {
  it("equity IRR rises with debt when the debt rate is below the unlevered return (positive leverage)", () => {
    const unlevered = computeInvestmentModel({ ...baseInputs, debtEquityRatio: 0 });
    const levered = computeInvestmentModel({ ...baseInputs, debtEquityRatio: 0.7 });

    expect(unlevered.equityIrrPct).not.toBeNull();
    expect(levered.equityIrrPct).not.toBeNull();
    expect(levered.equityIrrPct!).toBeGreaterThan(unlevered.equityIrrPct!);
  });

  it("DSCR is null with no debt and a finite number once debt is introduced", () => {
    const unlevered = computeInvestmentModel({ ...baseInputs, debtEquityRatio: 0 });
    const levered = computeInvestmentModel({ ...baseInputs, debtEquityRatio: 0.6 });
    expect(unlevered.dscrYear1).toBeNull();
    expect(levered.dscrYear1).not.toBeNull();
  });

  it("a higher debt rate lowers equity IRR, all else equal", () => {
    const cheapDebt = computeInvestmentModel({ ...baseInputs, debtEquityRatio: 0.7, debtRatePct: 6 });
    const expensiveDebt = computeInvestmentModel({ ...baseInputs, debtEquityRatio: 0.7, debtRatePct: 16 });
    expect(expensiveDebt.equityIrrPct!).toBeLessThan(cheapDebt.equityIrrPct!);
  });

  it("a shorter debt tenor (same debt amount) raises year-1 debt service and lowers DSCR", () => {
    const longTenor = computeInvestmentModel({ ...baseInputs, debtEquityRatio: 0.7, debtTenorYears: 15 });
    const shortTenor = computeInvestmentModel({ ...baseInputs, debtEquityRatio: 0.7, debtTenorYears: 5 });
    expect(shortTenor.dscrYear1!).toBeLessThan(longTenor.dscrYear1!);
  });
});

describe("computeInvestmentModel — payback", () => {
  it("higher avoided cost shortens simple payback", () => {
    const low = computeInvestmentModel({ ...baseInputs, annualAvoidedCostRs: 1_500_000 });
    const high = computeInvestmentModel({ ...baseInputs, annualAvoidedCostRs: 3_000_000 });
    expect(high.simplePaybackYrs).not.toBeNull();
    expect(low.simplePaybackYrs).not.toBeNull();
    expect(high.simplePaybackYrs!).toBeLessThan(low.simplePaybackYrs!);
  });
});
