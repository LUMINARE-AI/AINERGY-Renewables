// Per-facility "current vs projected annual cost" comparison. Plain HTML/CSS
// bars (not a chart library) so it reads as part of the same dark, restrained
// visual system as the rest of the site rather than a bolted-on generic
// chart-library look. Two series (Current / Projected) — legend + direct
// value labels, no color-alone identity.

type Row = {
  facilityName: string;
  currentAnnualCostRs: number;
  projectedAnnualCostRs: number;
};

export function CurrentVsProjectedChart({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null;
  const max = Math.max(...rows.flatMap((r) => [r.currentAnnualCostRs, r.projectedAnnualCostRs]), 1);

  return (
    <div className="rounded-2xl border border-white/10 bg-graphite-900/50 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-offwhite-100">Current vs. projected annual cost</p>
        <div className="flex items-center gap-4 text-xs text-offwhite-300/60">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-offwhite-300/40" /> Current (grid)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-forest-400" /> Projected (best scenario)
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {rows.map((r) => (
          <div key={r.facilityName}>
            <p className="mb-1.5 text-xs text-offwhite-300/60">{r.facilityName}</p>
            <div className="space-y-1">
              <Bar value={r.currentAnnualCostRs} max={max} colorClass="bg-offwhite-300/30" />
              <Bar value={r.projectedAnnualCostRs} max={max} colorClass="bg-forest-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bar({ value, max, colorClass }: { value: number; max: number; colorClass: string }) {
  const pct = Math.max(2, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-28 shrink-0 text-right text-xs text-offwhite-300/70">
        ₹{value.toLocaleString("en-IN")}
      </span>
    </div>
  );
}
