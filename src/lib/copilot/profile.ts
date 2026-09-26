import type { BillContext, EnergyProfile } from "./types";

export function compactProfile(profile: EnergyProfile): EnergyProfile {
  const next: EnergyProfile = {};
  for (const [key, value] of Object.entries(profile) as [keyof EnergyProfile, EnergyProfile[keyof EnergyProfile]][]) {
    if (value == null || value === "") continue;
    if (typeof value === "number" && Number.isNaN(value)) continue;
    next[key] = value as never;
  }
  return next;
}

export function profileToBillContext(profile: EnergyProfile): BillContext {
  const tariff =
    profile.gridTariffRsPerKwh ??
    profile.gridTariffInclFixedRsPerKwh ??
    profile.gridTariffExclFixedRsPerKwh ??
    null;

  const context: BillContext = {
    state: profile.state,
    consumerType: profile.consumerType,
    voltageLevel: profile.voltageLevel,
    sanctionedLoadKva: profile.sanctionedLoadKva,
    monthlyConsumptionKwh: profile.monthlyConsumptionKwh,
    monthlyBillRs: profile.monthlyBillRs,
    averageTariffRsPerKwh: tariff,
    utilityOrDiscom: profile.utilityOrDiscom,
  };

  const defined: BillContext = {};
  for (const [key, value] of Object.entries(context) as [keyof BillContext, BillContext[keyof BillContext]][]) {
    if (value == null || value === "") continue;
    defined[key] = value as never;
  }
  return defined;
}
