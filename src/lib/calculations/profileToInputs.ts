import type { PlannerInputs } from "./optimizer";
import type { ConsumerType, StateName, VoltageLevel } from "../regulatory/tariffData";

type FacilityLike = {
  state: string;
  consumerType: string;
  voltageLevel: string;
  sanctionedLoadKva: number;
};

type ProfileLike = {
  monthlyConsumptionKwh: number;
  tariffRsPerKwh: number;
  operatingHoursPerDay: number;
  renewableTargetPct: number;
  rooftopAreaSqft: number;
  groundAreaAcres: number | null;
  considerGround: boolean;
  considerWind: boolean;
  includeOpenAccess: boolean;
  considerBattery?: boolean;
};

export function toPlannerInputs(facility: FacilityLike, profile: ProfileLike): PlannerInputs {
  return {
    state: facility.state as StateName,
    consumerType: facility.consumerType as ConsumerType,
    voltageLevel: facility.voltageLevel as VoltageLevel,
    sanctionedLoadKva: facility.sanctionedLoadKva,
    consumption: profile.monthlyConsumptionKwh,
    tariff: profile.tariffRsPerKwh,
    operatingHours: profile.operatingHoursPerDay,
    renewableTarget: profile.renewableTargetPct,
    rooftopArea: profile.rooftopAreaSqft,
    considerGround: profile.considerGround,
    groundArea: profile.groundAreaAcres ?? 0,
    considerWind: profile.considerWind,
    includeOpenAccess: profile.includeOpenAccess,
    considerBattery: profile.considerBattery ?? false,
  };
}
