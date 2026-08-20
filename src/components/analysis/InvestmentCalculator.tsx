"use client";

import { useMemo, useState } from "react";
import { computeInvestmentModel, type InvestmentInputs } from "@/lib/calculations/investmentModel";

const fieldClass =
  "w-full rounded-lg border border-white/15 bg-graphite-950/60 px-3 py-2 text-sm text-offwhite-100 transition-colors focus:border-current-400/60 focus:outline-none focus:ring-1 focus:ring-current-400/20";
const labelClass = "mb-1.5 block text-xs text-offwhite-300/60";

export function InvestmentCalculator({
  label,
  initialCapexRs,
  initialAnnualAvoidedCostRs,
}: {
  label: string;
  initialCapexRs: number;
  initialAnnualAvoidedCostRs: number;
}) {
  const [inputs, setInputs] = useState<InvestmentInputs>({
    capexRs: Math.max(1, Math.round(initialCapexRs)),
    debtEquityRatio: 0.7,
    debtRatePct: 9,
    debtTenorYears: 10,
    annualAvoidedCostRs: Math.max(0, Math.round(initialAnnualAvoidedCostRs)),
    revenueEscalationPct: 0,
    omRsPerYear: Math.round(initialCapexRs * 0.015),
    omEscalationPct: 3,
    depreciationPct: 5,
    taxRatePct: 25,
    discountRatePct: 10,
    projectLifeYears: 25,
  });

  const result = useMemo(() => computeInvestmentModel(inputs), [inputs]);

  function update<K extends keyof InvestmentInputs>(key: K, value: number) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-graphite-950/50 p-6 lg:p-8">
      <p className="text-sm font-medium text-offwhite-100">Model {label} as an investment</p>
      <p className="mt-1 text-xs text-offwhite-300/50">
        All assumptions below are editable — IRR is a projection based on the stated inputs, not a
        guaranteed or promised return.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <NumberField
          label="Capex (₹)"
          value={inputs.capexRs}
          onChange={(v) => update("capexRs", v)}
        />
        <NumberField
          label="Debt share (0–1)"
          value={inputs.debtEquityRatio}
          step={0.05}
          onChange={(v) => update("debtEquityRatio", Math.min(1, Math.max(0, v)))}
        />
        <NumberField label="Debt rate (%)" value={inputs.debtRatePct} onChange={(v) => update("debtRatePct", v)} />
        <NumberField
          label="Debt tenor (yrs)"
          value={inputs.debtTenorYears}
          onChange={(v) => update("debtTenorYears", v)}
        />
        <NumberField
          label="Avoided cost, yr 1 (₹/yr)"
          value={inputs.annualAvoidedCostRs}
          onChange={(v) => update("annualAvoidedCostRs", v)}
        />
        <NumberField
          label="Avoided-cost escalation (%/yr)"
          value={inputs.revenueEscalationPct}
          onChange={(v) => update("revenueEscalationPct", v)}
        />
        <NumberField label="O&M, yr 1 (₹/yr)" value={inputs.omRsPerYear} onChange={(v) => update("omRsPerYear", v)} />
        <NumberField
          label="O&M escalation (%/yr)"
          value={inputs.omEscalationPct}
          onChange={(v) => update("omEscalationPct", v)}
        />
        <NumberField
          label="Depreciation (%/yr, SLM)"
          value={inputs.depreciationPct}
          onChange={(v) => update("depreciationPct", v)}
        />
        <NumberField label="Tax rate (%)" value={inputs.taxRatePct} onChange={(v) => update("taxRatePct", v)} />
        <NumberField
          label="Discount rate (%)"
          value={inputs.discountRatePct}
          onChange={(v) => update("discountRatePct", v)}
        />
        <NumberField
          label="Project life (yrs)"
          value={inputs.projectLifeYears}
          onChange={(v) => update("projectLifeYears", v)}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
        <Stat
          label="Project IRR"
          value={result.projectIrrPct !== null ? `${result.projectIrrPct}%` : "—"}
          accent
        />
        <Stat
          label="Equity IRR"
          value={result.equityIrrPct !== null ? `${result.equityIrrPct}%` : "—"}
          accent
        />
        <Stat
          label="Simple payback"
          value={result.simplePaybackYrs !== null ? `${result.simplePaybackYrs} yrs` : "—"}
        />
        <Stat label="DSCR (yr 1)" value={result.dscrYear1 !== null ? result.dscrYear1.toFixed(2) : "—"} />
      </div>

      <details className="mt-5">
        <summary className="cursor-pointer text-xs text-current-300">View annual cash flow</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-left text-offwhite-300/50">
                <th className="px-2 py-2">Year</th>
                <th className="px-2 py-2">Revenue</th>
                <th className="px-2 py-2">O&amp;M</th>
                <th className="px-2 py-2">Interest</th>
                <th className="px-2 py-2">Principal</th>
                <th className="px-2 py-2">Net income</th>
                <th className="px-2 py-2">DSCR</th>
              </tr>
            </thead>
            <tbody>
              {result.cashFlow.map((row) => (
                <tr key={row.year} className="border-b border-white/5 text-offwhite-300/70">
                  <td className="px-2 py-1.5">{row.year}</td>
                  <td className="px-2 py-1.5">₹{row.revenue.toLocaleString("en-IN")}</td>
                  <td className="px-2 py-1.5">₹{row.om.toLocaleString("en-IN")}</td>
                  <td className="px-2 py-1.5">₹{row.interest.toLocaleString("en-IN")}</td>
                  <td className="px-2 py-1.5">₹{row.principalRepayment.toLocaleString("en-IN")}</td>
                  <td className="px-2 py-1.5">₹{row.netIncome.toLocaleString("en-IN")}</td>
                  <td className="px-2 py-1.5">{row.dscr !== null ? row.dscr.toFixed(2) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

function NumberField({
  label,
  value,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="number"
        step={step}
        className={fieldClass}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-offwhite-300/45">{label}</p>
      <p
        className={`mt-1 font-display text-lg font-medium ${
          accent ? "text-current-300" : "text-offwhite-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
