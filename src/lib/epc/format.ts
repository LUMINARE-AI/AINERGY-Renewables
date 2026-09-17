import type { CostRange } from "./types";

const CRORE = 1_00_00_000;
const LAKH = 1_00_000;

function indianNumber(value: number, fractionDigits = 0): string {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/** Format a rupee amount with Indian grouping, switching to Cr / Lakh for large values. */
export function formatInr(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "−" : "";

  if (abs >= CRORE) {
    const crores = abs / CRORE;
    return `${sign}₹${indianNumber(crores, 2)} Cr`;
  }

  if (abs >= LAKH) {
    const lakhs = abs / LAKH;
    if (lakhs >= 10) {
      return `${sign}₹${indianNumber(lakhs, 2)} L`;
    }
    return `${sign}₹${indianNumber(Math.round(abs))}`;
  }

  return `${sign}₹${indianNumber(Math.round(abs))}`;
}

export function formatRsPerWp(value: number): string {
  return `₹${indianNumber(value, 2)} / Wp`;
}

export function formatCrPerMw(value: number): string {
  const digits = Math.abs(value) < 1 ? 3 : 2;
  return `₹${indianNumber(value, digits)} Cr/MW`;
}

export function formatRange(
  range: CostRange,
  formatter: (value: number) => string = formatInr
): { base: string; band: string } {
  return {
    base: formatter(range.base),
    band: `${formatter(range.low)} – ${formatter(range.high)}`,
  };
}

export function formatRatio(value: number): string {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatMw(value: number): string {
  return `${value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })} MW`;
}

export function formatPct(value: number): string {
  return `${value.toLocaleString("en-IN", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}
