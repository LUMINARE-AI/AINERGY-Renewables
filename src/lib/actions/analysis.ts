"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { buildScenarios } from "@/lib/calculations/scenarios";
import { buildRecommendation } from "@/lib/recommendations/engine";
import { toPlannerInputs } from "@/lib/calculations/profileToInputs";

/** Persists the current deterministic scenario comparison + recommendation
 * for a facility's latest consumption profile. Recomputes from scratch each
 * time (cheap, pure functions) rather than trying to diff against prior
 * saved runs. */
export async function saveAnalysis(facilityId: string) {
  const session = await requireSession();

  const facility = await db.facility.findFirst({
    where: { id: facilityId, organizationId: session.user.organizationId },
    include: { consumptionProfiles: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  if (!facility) throw new Error("Facility not found.");

  const profile = facility.consumptionProfiles[0];
  if (!profile) throw new Error("Add a consumption profile before running an analysis.");

  const inputs = toPlannerInputs(facility, profile);
  const outcomes = buildScenarios(inputs);
  const recommendation = buildRecommendation(outcomes);

  for (const outcome of outcomes) {
    const scenario = await db.openAccessScenario.create({
      data: { facilityId, strategy: outcome.strategy },
    });
    await db.scenarioResult.create({
      data: {
        scenarioId: scenario.id,
        deliveredCostRsPerKwh: outcome.deliveredCostRsPerKwh,
        annualCostRs: outcome.annualCostRs,
        annualSavingsRs: outcome.annualSavingsRs,
        savingsPct: outcome.savingsPct,
        riskScore: outcome.riskScore,
      },
    });
  }

  await db.recommendation.create({
    data: {
      facilityId,
      recommendedStrategy: recommendation.recommendedStrategy,
      expectedSavingsRs: recommendation.expectedSavingsRs,
      assumptions: recommendation.assumptions,
      risks: recommendation.risks,
      dataGaps: recommendation.dataGaps,
      nextActions: recommendation.nextActions,
    },
  });

  revalidatePath(`/facilities/${facilityId}`);
}
