"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";

const profileSchema = z.object({
  monthlyConsumptionKwh: z.coerce.number().positive(),
  tariffRsPerKwh: z.coerce.number().positive(),
  operatingHoursPerDay: z.coerce.number().min(1).max(24),
  renewableTargetPct: z.coerce.number().min(0).max(100),
  rooftopAreaSqft: z.coerce.number().min(0),
  groundAreaAcres: z.coerce.number().min(0).optional(),
  considerGround: z.coerce.boolean().optional(),
  considerWind: z.coerce.boolean().optional(),
  includeOpenAccess: z.coerce.boolean().optional(),
  considerBattery: z.coerce.boolean().optional(),
});

async function assertFacilityAccess(facilityId: string, organizationId: string) {
  const facility = await db.facility.findFirst({
    where: { id: facilityId, organizationId },
  });
  if (!facility) throw new Error("Facility not found.");
  return facility;
}

export async function saveConsumptionProfile(facilityId: string, formData: FormData) {
  const session = await requireSession();
  await assertFacilityAccess(facilityId, session.user.organizationId);

  const parsed = profileSchema.safeParse({
    monthlyConsumptionKwh: formData.get("monthlyConsumptionKwh"),
    tariffRsPerKwh: formData.get("tariffRsPerKwh"),
    operatingHoursPerDay: formData.get("operatingHoursPerDay"),
    renewableTargetPct: formData.get("renewableTargetPct"),
    rooftopAreaSqft: formData.get("rooftopAreaSqft"),
    groundAreaAcres: formData.get("groundAreaAcres") || 0,
    considerGround: formData.get("considerGround") === "on",
    considerWind: formData.get("considerWind") === "on",
    includeOpenAccess: formData.get("includeOpenAccess") === "on",
    considerBattery: formData.get("considerBattery") === "on",
  });

  if (!parsed.success) {
    throw new Error("Please check the consumption profile details and try again.");
  }

  await db.consumptionProfile.create({
    data: {
      facilityId,
      ...parsed.data,
      source: "manual",
    },
  });

  redirect(`/facilities/${facilityId}`);
}
