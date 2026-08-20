"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { STATES, VOLTAGE_LEVELS } from "@/lib/regulatory/tariffData";

const facilitySchema = z.object({
  name: z.string().min(1).max(200),
  state: z.enum(STATES as [string, ...string[]]),
  discom: z.string().max(200).optional(),
  consumerType: z.enum(["commercial", "industrial"]),
  voltageLevel: z.enum(VOLTAGE_LEVELS as [string, ...string[]]),
  sanctionedLoadKva: z.coerce.number().positive(),
});

export async function createFacility(formData: FormData) {
  const session = await requireSession();

  const parsed = facilitySchema.safeParse({
    name: formData.get("name"),
    state: formData.get("state"),
    discom: formData.get("discom") || undefined,
    consumerType: formData.get("consumerType"),
    voltageLevel: formData.get("voltageLevel"),
    sanctionedLoadKva: formData.get("sanctionedLoadKva"),
  });

  if (!parsed.success) {
    throw new Error("Please check the facility details and try again.");
  }

  const facility = await db.facility.create({
    data: {
      ...parsed.data,
      organizationId: session.user.organizationId,
    },
  });

  redirect(`/facilities/${facility.id}`);
}
