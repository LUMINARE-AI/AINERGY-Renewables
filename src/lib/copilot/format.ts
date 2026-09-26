import type { EnergyProfile, FinancialScenario } from "./types";

const EMPTY = "—";

export function isBlankNumber(value: number | null | undefined): value is null | undefined {
  return value == null || Number.isNaN(value);
}

export function formatNumber(value: number | null | undefined, digits = 2): string {
  if (isBlankNumber(value)) return EMPTY;
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

export function formatInr(value: number | null | undefined, digits = 0): string {
  if (isBlankNumber(value)) return EMPTY;
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

export function formatRate(value: number | null | undefined): string {
  if (isBlankNumber(value)) return EMPTY;
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}/kWh`;
}

export function formatPct(value: number | null | undefined): string {
  if (isBlankNumber(value)) return EMPTY;
  return `${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })}%`;
}

export function formatYears(value: number | null | undefined): string {
  if (isBlankNumber(value)) return EMPTY;
  const n = value.toLocaleString("en-IN", { maximumFractionDigits: 1 });
  return `${n} ${value === 1 ? "year" : "years"}`;
}

export const ROUTE_LABELS: Record<string, string> = {
  grid: "Grid",
  rooftop: "Rooftop",
  third_party: "Third-party",
  rooftop_plus_third_party: "Rooftop + third-party",
  captive: "Captive",
  group_captive: "Group captive",
};

export function routeLabel(route: string | null | undefined): string {
  if (!route) return EMPTY;
  return ROUTE_LABELS[route] ?? route.replaceAll("_", " ");
}

export const PROFILE_FIELD_LABELS: Record<keyof EnergyProfile, string> = {
  state: "State",
  consumerType: "Consumer type",
  voltageLevel: "Voltage level",
  sanctionedLoadKw: "Sanctioned load",
  sanctionedLoadKva: "Sanctioned load",
  monthlyConsumptionKwh: "Monthly consumption",
  monthlyBillRs: "Monthly bill",
  fixedChargesRs: "Fixed charges",
  gridTariffRsPerKwh: "Grid tariff",
  gridTariffInclFixedRsPerKwh: "Tariff including fixed charges",
  gridTariffExclFixedRsPerKwh: "Tariff excluding fixed charges",
  utilityOrDiscom: "DISCOM",
  roofAreaSqM: "Roof area",
  rooftopCapacityKw: "Rooftop capacity",
  targetRenewableSharePct: "Renewable share target",
};

export function profileFieldSuffix(field: string): string | undefined {
  switch (field) {
    case "sanctionedLoadKva":
      return "kVA";
    case "sanctionedLoadKw":
    case "rooftopCapacityKw":
      return "kW";
    case "monthlyConsumptionKwh":
      return "kWh";
    case "monthlyBillRs":
    case "fixedChargesRs":
      return "₹";
    case "gridTariffRsPerKwh":
    case "gridTariffInclFixedRsPerKwh":
    case "gridTariffExclFixedRsPerKwh":
      return "₹/kWh";
    case "roofAreaSqM":
      return "m²";
    case "targetRenewableSharePct":
      return "%";
    default:
      return undefined;
  }
}

export function profileFieldLabel(field: string): string {
  if (field in PROFILE_FIELD_LABELS) {
    return PROFILE_FIELD_LABELS[field as keyof EnergyProfile];
  }
  return field.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

const NUMBER_FIELDS = new Set<keyof EnergyProfile>([
  "sanctionedLoadKw",
  "sanctionedLoadKva",
  "monthlyConsumptionKwh",
  "monthlyBillRs",
  "fixedChargesRs",
  "gridTariffRsPerKwh",
  "gridTariffInclFixedRsPerKwh",
  "gridTariffExclFixedRsPerKwh",
  "roofAreaSqM",
  "rooftopCapacityKw",
  "targetRenewableSharePct",
]);

export function isProfileNumberField(field: string): boolean {
  return NUMBER_FIELDS.has(field as keyof EnergyProfile);
}

export function formatProfileValue(field: string, value: unknown): string {
  if (value == null || value === "") return EMPTY;
  if (typeof value === "number") {
    if (
      field === "monthlyBillRs" ||
      field === "fixedChargesRs"
    ) {
      return formatInr(value);
    }
    if (field.includes("RsPerKwh") || field.includes("Tariff")) return formatRate(value);
    if (field.endsWith("Pct")) return formatPct(value);
    if (field === "sanctionedLoadKva") return `${formatNumber(value, 1)} kVA`;
    if (field.endsWith("Kw")) return `${formatNumber(value, 1)} kW`;
    if (field === "monthlyConsumptionKwh") return `${formatNumber(value, 0)} kWh`;
    if (field === "roofAreaSqM") return `${formatNumber(value, 0)} m²`;
    return formatNumber(value);
  }
  if (field === "consumerType" && typeof value === "string") {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return String(value);
}

export function isFinancialScenario(value: unknown): value is FinancialScenario {
  return Boolean(
    value &&
      typeof value === "object" &&
      "route" in value &&
      "annualSavingsRs" in value
  );
}
