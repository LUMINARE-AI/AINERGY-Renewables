import { formatInr, formatPct, formatYears, routeLabel } from "@/lib/copilot/format";
import type { RankedOption } from "@/lib/copilot/types";
import { cn } from "@/lib/utils";

export function RankedOptionsList({
  options,
  selectedRoute,
  onSelect,
}: {
  options: RankedOption[];
  selectedRoute?: string | null;
  onSelect?: (route: string) => void;
}) {
  if (options.length === 0) {
    return <p className="text-sm text-ink-500">No ranked options came back.</p>;
  }

  return (
    <ol className="space-y-3">
      {options.map((option, index) => {
        const ineligible = option.status === "ineligible";
        const selected = selectedRoute === option.route;
        return (
          <li key={`${option.route}-${index}`}>
            <button
              type="button"
              disabled={!onSelect}
              onClick={() => onSelect?.(option.route)}
              className={cn(
                "w-full rounded-2xl border p-4 text-left transition-colors",
                selected
                  ? "border-ink-900 bg-ink-900 text-paper-50"
                  : "border-ink-900/10 bg-paper-100/70 hover:border-ink-900/25",
                !onSelect && "cursor-default"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={cn("font-mono-tag text-[10px] uppercase", selected ? "text-paper-50/70" : "text-ink-500")}>
                    {index + 1}. {routeLabel(option.route)}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {ineligible ? "Ineligible" : "Available"}
                  </p>
                </div>
                <p className="text-right text-sm">
                  {formatInr(option.annualSavingsRs)}
                  <span className={cn("mt-0.5 block text-[11px]", selected ? "text-paper-50/70" : "text-ink-500")}>
                    annual savings
                  </span>
                </p>
              </div>
              <p className={cn("mt-3 text-xs", selected ? "text-paper-50/80" : "text-ink-600")}>
                Payback {formatYears(option.paybackYears)} · IRR {formatPct(option.irrPct)} · Equity IRR{" "}
                {formatPct(option.equityIrrPct)}
              </p>
              {ineligible && option.reason && (
                <p className={cn("mt-2 text-xs leading-relaxed", selected ? "text-paper-50/90" : "text-current-800")}>
                  {option.reason}
                </p>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
