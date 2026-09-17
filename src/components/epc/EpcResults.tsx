import {
  formatCrPerMw,
  formatInr,
  formatMw,
  formatPct,
  formatRange,
  formatRatio,
  formatRsPerWp,
} from "@/lib/epc/format";
import type { CostRange, EstimateResponse, RateCardEntry } from "@/lib/epc/types";

function Kpi({
  label,
  range,
  formatter = formatInr,
  featured = false,
}: {
  label: string;
  range: CostRange;
  formatter?: (value: number) => string;
  featured?: boolean;
}) {
  const { base, band } = formatRange(range, formatter);
  return (
    <div
      className={
        featured
          ? "rounded-2xl border border-current-500/25 bg-current-400/10 px-4 py-4 sm:col-span-2 sm:px-5"
          : "rounded-2xl border border-ink-900/10 bg-paper-50 px-4 py-4 sm:px-5"
      }
    >
      <p className="font-mono-tag text-[0.65rem] uppercase tracking-[0.14em] text-ink-500">
        {label}
      </p>
      <p
        className={
          featured
            ? "mt-2 font-display text-2xl font-medium leading-tight text-ink-900 sm:text-3xl"
            : "mt-2 font-display text-xl font-medium leading-tight text-ink-900 sm:text-2xl"
        }
      >
        {base}
      </p>
      <p className="mt-1 text-xs text-ink-500">{band}</p>
    </div>
  );
}

function TotalsRow({
  label,
  range,
  hint,
  strong = false,
  formatter = formatInr,
}: {
  label: string;
  range: CostRange;
  hint?: string;
  strong?: boolean;
  formatter?: (value: number) => string;
}) {
  const { base, band } = formatRange(range, formatter);
  return (
    <div
      className={
        strong
          ? "flex flex-col gap-1 border-t border-ink-900/10 pt-3 sm:flex-row sm:items-baseline sm:justify-between"
          : "flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"
      }
    >
      <div>
        <p className={strong ? "font-medium text-ink-900" : "text-sm text-ink-700"}>
          {label}
        </p>
        {hint ? <p className="text-xs text-ink-500">{hint}</p> : null}
      </div>
      <div className="sm:text-right">
        <p className={strong ? "font-display text-lg font-medium text-ink-900" : "text-sm font-medium text-ink-900"}>
          {base}
        </p>
        <p className="text-xs text-ink-500">{band}</p>
      </div>
    </div>
  );
}

export function EpcResults({
  estimate,
  rateCard,
}: {
  estimate: EstimateResponse;
  rateCard: RateCardEntry[] | null;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <Kpi
          label="Total incl. GST"
          range={estimate.total_incl_gst_inr}
          featured
        />
        <Kpi label="Total ex-GST" range={estimate.total_ex_gst_inr} />
        <Kpi
          label="₹ / Wp (DC)"
          range={estimate.rs_per_wp_dc}
          formatter={formatRsPerWp}
        />
        <Kpi
          label="₹ Cr / MW (AC)"
          range={estimate.cr_per_mw_ac}
          formatter={formatCrPerMw}
        />
        <Kpi
          label="₹ Cr / MW (DC)"
          range={estimate.cr_per_mw_dc}
          formatter={formatCrPerMw}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-ink-900/10 bg-paper-50 px-3 py-3 sm:px-4">
        <div>
          <p className="font-mono-tag text-[0.6rem] uppercase tracking-[0.12em] text-ink-500">
            AC
          </p>
          <p className="mt-1 text-sm font-medium text-ink-900">
            {formatMw(estimate.capacity_ac_mw)}
          </p>
        </div>
        <div>
          <p className="font-mono-tag text-[0.6rem] uppercase tracking-[0.12em] text-ink-500">
            DC
          </p>
          <p className="mt-1 text-sm font-medium text-ink-900">
            {formatMw(estimate.capacity_dc_mw)}
          </p>
        </div>
        <div>
          <p className="font-mono-tag text-[0.6rem] uppercase tracking-[0.12em] text-ink-500">
            DC:AC
          </p>
          <p className="mt-1 text-sm font-medium text-ink-900">
            {formatRatio(estimate.resolved_dc_ac_ratio)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <caption className="mb-3 text-left font-display text-base font-medium text-ink-900">
            Bill of materials
          </caption>
          <thead>
            <tr className="border-b border-ink-900/10 text-xs uppercase tracking-[0.08em] text-ink-500">
              <th className="pb-2 pr-3 font-medium">Item</th>
              <th className="pb-2 pr-3 text-right font-medium">₹/Wp (DC)</th>
              <th className="pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {estimate.line_items.map((item) => (
              <tr key={item.key} className="border-b border-ink-900/6">
                <td className="py-2.5 pr-3 text-ink-800">{item.label}</td>
                <td className="py-2.5 pr-3 text-right tabular-nums text-ink-700">
                  {formatRsPerWp(item.rs_per_wp_dc)}
                </td>
                <td className="py-2.5 text-right tabular-nums font-medium text-ink-900">
                  {formatInr(item.amount_inr)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 rounded-2xl border border-ink-900/10 bg-paper-50 px-4 py-4 sm:px-5">
        <TotalsRow
          label="EPC subtotal (ex-GST)"
          range={estimate.epc_subtotal_ex_gst_inr}
          hint="Equipment, BOS and evacuation, before GST and land"
        />
        {estimate.land_cost_inr != null ? (
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-sm text-ink-700">Land</p>
              <p className="text-xs text-ink-500">GST-exempt point estimate</p>
            </div>
            <p className="text-sm font-medium text-ink-900">
              {formatInr(estimate.land_cost_inr)}
            </p>
          </div>
        ) : null}
        <TotalsRow
          label={`GST (${formatPct(estimate.blended_gst_rate_pct)})`}
          range={estimate.gst_amount_inr}
          hint="GST applies to the EPC subtotal only"
        />
        <TotalsRow
          label="Grand total incl. GST"
          range={estimate.total_incl_gst_inr}
          strong
        />
      </div>

      {estimate.assumptions.length > 0 ? (
        <div>
          <h3 className="font-display text-base font-medium text-ink-900">
            Assumptions
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-700/90">
            {estimate.assumptions.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-ink-500">{estimate.disclaimer}</p>

      {rateCard && rateCard.length > 0 ? (
        <details className="rounded-2xl border border-ink-900/10 bg-paper-50 px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium text-current-700">
            Rate assumptions
          </summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <tbody>
                {rateCard.map((row) => (
                  <tr key={row.key} className="border-t border-ink-900/8">
                    <td className="py-2 pr-3 capitalize text-ink-700">{row.label}</td>
                    <td className="py-2 text-right tabular-nums text-ink-900">
                      {row.rs_per_wp != null
                        ? formatRsPerWp(row.rs_per_wp)
                        : row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ) : null}
    </div>
  );
}
