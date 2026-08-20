// Investment Path — deterministic own-asset / group-captive project-finance
// model. IRR is found by bisection on the NPV root (not a black-box library)
// so the method is auditable and testable, per the calculation-engine
// discipline used across this codebase. No LLM in this file.
//
// All financial assumptions (debt:equity split, debt rate/tenor, O&M
// escalation, depreciation, tax, discount rate) are caller-supplied inputs —
// none are hard-coded defaults baked into the formulas. Depreciation is
// modeled straight-line for auditability; Indian solar assets often qualify
// for accelerated (WDV) depreciation in practice — that's a documented
// simplification, not a claim about actual tax treatment.

export type InvestmentInputs = {
  capexRs: number;
  debtEquityRatio: number; // fraction of capex financed by debt, e.g. 0.7
  debtRatePct: number; // annual interest rate on debt, %
  debtTenorYears: number;
  annualAvoidedCostRs: number; // revenue-equivalent: year-1 avoided grid cost
  revenueEscalationPct: number; // annual escalation of the avoided-cost benefit, %
  omRsPerYear: number; // year-1 O&M cost
  omEscalationPct: number; // annual O&M escalation, %
  depreciationPct: number; // straight-line %, of capex, per year
  taxRatePct: number;
  discountRatePct: number; // used for reference NPV only; IRR is solved independently
  projectLifeYears: number;
};

export type CashFlowYear = {
  year: number;
  revenue: number;
  om: number;
  depreciation: number;
  interest: number;
  principalRepayment: number;
  ebit: number;
  netIncome: number;
  projectCashFlow: number; // unlevered, post-tax — used for project IRR / payback
  equityCashFlow: number; // levered, post-tax, post-debt-service — used for equity IRR
  dscr: number | null;
};

export type InvestmentResult = {
  capexRs: number;
  debtAmountRs: number;
  equityAmountRs: number;
  cashFlow: CashFlowYear[];
  projectIrrPct: number | null;
  equityIrrPct: number | null;
  simplePaybackYrs: number | null;
  dscrYear1: number | null;
};

function buildCashFlow(inputs: InvestmentInputs): CashFlowYear[] {
  const debtAmountRs = inputs.capexRs * inputs.debtEquityRatio;
  const straightLineDepreciation = (inputs.depreciationPct / 100) * inputs.capexRs;
  const annualPrincipal =
    inputs.debtTenorYears > 0 ? debtAmountRs / inputs.debtTenorYears : 0;

  const rows: CashFlowYear[] = [];
  let outstandingDebt = debtAmountRs;

  for (let year = 1; year <= inputs.projectLifeYears; year++) {
    const revenue =
      inputs.annualAvoidedCostRs * Math.pow(1 + inputs.revenueEscalationPct / 100, year - 1);
    const om = inputs.omRsPerYear * Math.pow(1 + inputs.omEscalationPct / 100, year - 1);
    const depreciation = straightLineDepreciation;
    const ebit = revenue - om - depreciation;

    const interest = year <= inputs.debtTenorYears ? outstandingDebt * (inputs.debtRatePct / 100) : 0;
    const principalRepayment = year <= inputs.debtTenorYears ? annualPrincipal : 0;
    outstandingDebt = Math.max(0, outstandingDebt - principalRepayment);

    const taxUnlevered = Math.max(0, ebit) * (inputs.taxRatePct / 100);
    const projectCashFlow = ebit - taxUnlevered + depreciation;

    const taxableLevered = Math.max(0, ebit - interest);
    const taxLevered = taxableLevered * (inputs.taxRatePct / 100);
    const netIncome = ebit - interest - taxLevered;
    const equityCashFlow = netIncome + depreciation - principalRepayment;

    const debtService = interest + principalRepayment;
    const dscr = debtService > 0 ? (netIncome + depreciation + interest) / debtService : null;

    rows.push({
      year,
      revenue: Math.round(revenue),
      om: Math.round(om),
      depreciation: Math.round(depreciation),
      interest: Math.round(interest),
      principalRepayment: Math.round(principalRepayment),
      ebit: Math.round(ebit),
      netIncome: Math.round(netIncome),
      projectCashFlow: Math.round(projectCashFlow),
      equityCashFlow: Math.round(equityCashFlow),
      dscr: dscr !== null ? Math.round(dscr * 100) / 100 : null,
    });
  }

  return rows;
}

/** Bisection on the NPV root. Returns null if no sign change is found in
 * [-99%, 1000%] — i.e. the cash flow series has no real IRR in a sane range. */
export function irrBisection(cashFlows: number[]): number | null {
  const npv = (rate: number) =>
    cashFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0);

  let lo = -0.99;
  let hi = 10;
  let npvLo = npv(lo);
  const npvHi = npv(hi);
  if (npvLo === 0) return lo;
  if (npvLo * npvHi > 0) return null;

  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const npvMid = npv(mid);
    if (Math.abs(npvMid) < 1e-6) return mid;
    if (Math.sign(npvMid) === Math.sign(npvLo)) {
      lo = mid;
      npvLo = npvMid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) / 2;
}

function simplePayback(cashFlows: number[]): number | null {
  let cumulative = cashFlows[0];
  for (let year = 1; year < cashFlows.length; year++) {
    const prevCumulative = cumulative;
    cumulative += cashFlows[year];
    if (cumulative >= 0) {
      const fraction = -prevCumulative / cashFlows[year];
      return Math.round((year - 1 + fraction) * 10) / 10;
    }
  }
  return null; // never pays back within the modeled project life
}

// ---------------------------------------------------------------------------
// Captive / Group Captive IRR inputs — DC:AC ratio + debt:equity
// ---------------------------------------------------------------------------
//
// The Copilot asks a Captive/Group Captive user for two extra numbers beyond
// what a third-party PPA needs: the debt:equity ratio (financing structure,
// already the `debtEquityRatio` field above) and the DC:AC ratio (inverter
// loading ratio — how much DC solar array capacity is installed per unit of
// AC inverter/grid-interconnection capacity). This helper turns those two
// plus a generation-yield assumption into the `InvestmentInputs` the IRR
// solver above already accepts — it doesn't change the IRR math, it just
// derives capex and year-1 revenue the same way a developer's own model
// would, so the caller (the UI form) supplies raw numbers, not pre-computed
// capex.

export type CaptiveSizingInputs = {
  acCapacityKw: number; // inverter / grid-interconnection capacity
  dcAcRatio: number; // typically 1.1–1.4; higher = more panels per inverter
  capexRsPerKwDc: number; // blended installed cost, Rs per kW of DC array
  generationYieldKwhPerKwpPerDay: number; // from lookupGenerationYield(state)
  landedCostRsPerKwh: number; // what the consumer would otherwise pay (grid or OA) — sets the avoided-cost benefit
  omRsPerKwYear: number; // year-1 O&M, Rs per kW (DC) per year
};

/** Rule-of-thumb inverter clipping loss: at higher DC:AC ratios, some energy
 * generated above the inverter's AC ceiling during peak sun is clipped
 * (lost). ~0% below a 1.2 ratio, rising roughly linearly above it — a
 * simplification (real clipping depends on the site's irradiance profile),
 * not an engineering-grade loss model. */
function estimateClippingLossPct(dcAcRatio: number): number {
  return Math.max(0, (dcAcRatio - 1.2) * 6);
}

export function deriveCaptiveDcCapacityKw(sizing: CaptiveSizingInputs): number {
  return Math.round(sizing.acCapacityKw * sizing.dcAcRatio);
}

export function buildCaptiveInvestmentInputs(
  sizing: CaptiveSizingInputs,
  financing: Pick<
    InvestmentInputs,
    | "debtEquityRatio"
    | "debtRatePct"
    | "debtTenorYears"
    | "revenueEscalationPct"
    | "omEscalationPct"
    | "depreciationPct"
    | "taxRatePct"
    | "discountRatePct"
    | "projectLifeYears"
  >
): InvestmentInputs {
  const dcCapacityKw = deriveCaptiveDcCapacityKw(sizing);
  const capexRs = Math.round(dcCapacityKw * sizing.capexRsPerKwDc);

  const clippingLossPct = estimateClippingLossPct(sizing.dcAcRatio);
  const grossAnnualKwh = dcCapacityKw * sizing.generationYieldKwhPerKwpPerDay * 365;
  const netAnnualKwh = Math.round(grossAnnualKwh * (1 - clippingLossPct / 100));

  const annualAvoidedCostRs = Math.round(netAnnualKwh * sizing.landedCostRsPerKwh);
  const omRsPerYear = Math.round(dcCapacityKw * sizing.omRsPerKwYear);

  return {
    capexRs,
    annualAvoidedCostRs,
    omRsPerYear,
    ...financing,
  };
}

export function computeInvestmentModel(inputs: InvestmentInputs): InvestmentResult {
  const debtAmountRs = Math.round(inputs.capexRs * inputs.debtEquityRatio);
  const equityAmountRs = Math.round(inputs.capexRs - debtAmountRs);
  const cashFlow = buildCashFlow(inputs);

  const projectSeries = [-inputs.capexRs, ...cashFlow.map((r) => r.projectCashFlow)];
  const equitySeries = [-equityAmountRs, ...cashFlow.map((r) => r.equityCashFlow)];

  const projectIrr = irrBisection(projectSeries);
  const equityIrr = irrBisection(equitySeries);

  return {
    capexRs: Math.round(inputs.capexRs),
    debtAmountRs,
    equityAmountRs,
    cashFlow,
    projectIrrPct: projectIrr !== null ? Math.round(projectIrr * 1000) / 10 : null,
    equityIrrPct: equityIrr !== null ? Math.round(equityIrr * 1000) / 10 : null,
    simplePaybackYrs: simplePayback(projectSeries),
    dscrYear1: cashFlow[0]?.dscr ?? null,
  };
}
