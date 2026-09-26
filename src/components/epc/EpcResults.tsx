import {
  formatCrore,
  formatMw,
  formatRatio,
  formatRupee,
} from "@/lib/epc/format";
import type { EstimateResponse, LineItem } from "@/lib/epc/types";

const BREAKDOWN = [
  { id: "modules", label: "Modules", match: /module/i },
  { id: "structure", label: "Structure", match: /mount|struct|tracker/i },
  {
    id: "ac",
    label: "AC power",
    match: /invert|transformer|switchgear|bus.?duct|ac.?cabl|\blt\b|\bht\b|panel/i,
  },
  {
    id: "dc",
    label: "DC balance",
    match: /dc.?cabl|combiner|isolat|earthing|lightning|\bmca\b|conduit/i,
  },
  { id: "evac", label: "Evacuation", match: /transmiss|evacuat|dp.?yard|\bbay\b|cieg/i },
  { id: "monitor", label: "Monitoring", match: /scada|monitor/i },
  { id: "civil", label: "Civil / BoP", match: /civil|bop|road|clean/i },
  { id: "land", label: "Land", match: /\bland\b/i },
  {
    id: "services",
    label: "Services",
    match: /install|commission|design|engineer|service/i,
  },
] as const;

function groupLineItems(items: LineItem[], landCost: number | null) {
  const buckets = new Map<string, number>(BREAKDOWN.map((group) => [group.id, 0]));
  let other = 0;

  for (const item of items) {
    const haystack = `${item.key} ${item.label}`;
    const group = BREAKDOWN.find((entry) => entry.match.test(haystack));
    if (!group) {
      other += item.amount_inr;
      continue;
    }
    buckets.set(group.id, (buckets.get(group.id) ?? 0) + item.amount_inr);
  }

  if (landCost && (buckets.get("land") ?? 0) === 0) {
    buckets.set("land", landCost);
  }

  const rows: { id: string; label: string; amount: number }[] = BREAKDOWN.map((group) => ({
    id: group.id,
    label: group.label,
    amount: buckets.get(group.id) ?? 0,
  })).filter((row) => row.amount > 0);

  if (other > 0) rows.push({ id: "other", label: "Other", amount: other });
  return rows;
}

function heroDigits(amount: number): number {
  const crores = Math.abs(amount) / 1_00_00_000;
  return crores >= 10 ? 1 : 2;
}

const SWATCH = [
  "bg-current-600",
  "bg-current-400",
  "bg-forest-500",
  "bg-gold-500",
  "bg-forest-300",
  "bg-ink-400",
  "bg-gold-300",
  "bg-current-300",
  "bg-ink-700",
];

export function EpcSummary({
  estimate,
  loading,
  waking,
}: {
  estimate: EstimateResponse | null;
  loading: boolean;
  waking: boolean;
}) {
  const total = estimate?.total_ex_gst_inr;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-current-gradient px-5 py-5 text-paper-50 shadow-glow sm:px-7">
      <div
        className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-current-300/25 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono-tag text-[0.65rem] uppercase tracking-[0.16em] text-current-300">
            Budget before GST
          </p>
          {total ? (
            <>
              <p className="mt-1 font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
                {formatCrore(total.base, heroDigits(total.base))}
              </p>
              <p className="mt-1 text-sm text-current-300">
                {formatCrore(total.low, heroDigits(total.low))} –{" "}
                {formatCrore(total.high, heroDigits(total.high))} band
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-current-300">
              {loading || waking ? "Working out the budget…" : "Waiting for the first estimate."}
            </p>
          )}
        </div>
        {estimate ? (
          <dl className="grid grid-cols-3 gap-4 sm:gap-6">
            <Stat label="Per Wp" value={formatRupee(estimate.rs_per_wp_dc.base, 1)} />
            <Stat
              label="Per MW DC"
              value={formatCrore(estimate.cr_per_mw_dc.base * 1_00_00_000, 2)}
            />
            <Stat
              label="With GST"
              value={formatCrore(
                estimate.total_incl_gst_inr.base,
                heroDigits(estimate.total_incl_gst_inr.base)
              )}
            />
          </dl>
        ) : null}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.65rem] uppercase tracking-[0.08em] text-current-300">{label}</dt>
      <dd className="mt-1 text-sm font-medium tabular-nums text-white">{value}</dd>
    </div>
  );
}

export function EpcBreakdown({ estimate }: { estimate: EstimateResponse | null }) {
  const rows = estimate ? groupLineItems(estimate.line_items, estimate.land_cost_inr) : [];
  const sum = rows.reduce((total, row) => total + row.amount, 0);

  return (
    <aside className="rounded-2xl border border-ink-900/10 bg-white px-5 py-6 shadow-sm sm:px-7">
      <p className="font-mono-tag text-[0.65rem] uppercase tracking-[0.16em] text-current-600">
        Share of budget
      </p>
      {rows.length > 0 ? (
        <>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-paper-200">
            {rows.map((row, index) => (
              <div
                key={row.id}
                className={SWATCH[index % SWATCH.length]}
                style={{ width: `${sum > 0 ? (row.amount / sum) * 100 : 0}%` }}
                title={row.label}
              />
            ))}
          </div>
          <ul className="mt-5 divide-y divide-ink-900/8">
            {rows.map((row, index) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="flex items-center gap-2 text-ink-700">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${SWATCH[index % SWATCH.length]}`} />
                  {row.label}
                </span>
                <span className="tabular-nums text-ink-900">
                  <span className="mr-3 text-xs text-ink-400">
                    {sum > 0 ? Math.round((row.amount / sum) * 100) : 0}%
                  </span>
                  {formatCrore(row.amount, 2)}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-4 text-sm text-ink-500">The split shows up with the first estimate.</p>
      )}
    </aside>
  );
}

export function EpcDetails({ estimate }: { estimate: EstimateResponse }) {
  const items = estimate.line_items;

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-white px-5 py-6 shadow-sm sm:px-7">
      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <p className="font-mono-tag text-[0.65rem] uppercase tracking-[0.16em] text-current-600">
            Bill of materials
          </p>
          <table className="mt-3 w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 text-xs text-ink-400">
                <th className="pb-2 pr-3 font-medium">Item</th>
                <th className="pb-2 pr-3 text-right font-medium">₹ / Wp</th>
                <th className="pb-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.key} className="border-b border-ink-900/6">
                  <td className="py-2.5 pr-3 text-ink-800">{item.label}</td>
                  <td className="py-2.5 pr-3 text-right tabular-nums text-ink-500">
                    {formatRupee(item.rs_per_wp_dc, 2)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums font-medium text-ink-900">
                    {formatCrore(item.amount_inr, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 border-t border-ink-900/8 pt-5 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-ink-400">Assumptions</p>
          <p className="mt-2 text-sm text-ink-800">
            DC {formatMw(estimate.capacity_dc_mw).replace(" MW", " MWp")} / AC{" "}
            {formatMw(estimate.capacity_ac_mw)} at DC:AC {formatRatio(estimate.resolved_dc_ac_ratio)}.
          </p>
          {estimate.assumptions.length > 0 ? (
            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-ink-600">
              {estimate.assumptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <p className="text-sm leading-relaxed text-ink-500">
          {estimate.disclaimer ||
            "Planning-grade only. A firm line-item number needs a benchmarked proposal."}
        </p>
      </div>
    </div>
  );
}
