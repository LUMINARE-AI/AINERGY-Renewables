// Regulatory data refresh pipeline — keeps the DB-backed TariffProfile /
// OpenAccessCharge tables (the authenticated app's live source) in sync with
// src/lib/regulatory/tariffData.ts (the sourced, dated, human-researched
// figures — the same discipline as every other number in this app: no
// fabrication, no silent averaging, every figure traceable to a cited
// source). "Auto-update when charges change" does NOT mean an LLM
// autonomously scrapes and rewrites tariff numbers — that would break the
// auditability guarantee this whole app is built on. It means: whenever
// tariffData.ts is revised (a developer/analyst updates a figure after
// checking the latest tariff order) and deployed, this route is what
// actually pushes that change into the DB the app reads at runtime, and
// logs exactly what changed — so "automatic" describes the DB sync, not the
// research step.
//
// Two ways to trigger it:
//  - GET with `Authorization: Bearer <CRON_SECRET>` — Vercel Cron always
//    issues GET requests, and automatically attaches this header when a
//    `CRON_SECRET` env var is configured (see vercel.json's schedule and
//    Vercel's Cron Jobs docs) — this is what makes the refresh "automatic".
//    A GET without that header instead just returns the most recent refresh
//    log entries (read-only, no auth needed — these numbers aren't secret).
//  - POST from an authenticated session (any signed-in user) — a manual
//    "Refresh regulatory data" action from Settings.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth/auth";
import {
  VOLTAGE_LEVELS,
  lookupTariff,
  lookupOpenAccessCharges,
  OPEN_ACCESS_THRESHOLD_KVA,
  type ConsumerType,
  type StateName,
} from "@/lib/regulatory/tariffData";

export const runtime = "nodejs";

const CONSUMER_TYPES: ConsumerType[] = ["commercial", "industrial"];
const SEEDED_STATES: Exclude<StateName, "Other">[] = ["Karnataka", "Maharashtra", "Rajasthan"];
const TARIFF_SOURCE = "AINERGY illustrative tariff model (src/lib/regulatory/tariffData.ts)";

const EPSILON = 0.001; // float-compare tolerance, Rs/kWh or %

function differs(a: number, b: number): boolean {
  return Math.abs(a - b) > EPSILON;
}

async function refreshState(state: Exclude<StateName, "Other">) {
  const changedFields = new Set<string>();

  for (const consumerType of CONSUMER_TYPES) {
    for (const voltageLevel of VOLTAGE_LEVELS) {
      const { tariff, crossSubsidySurcharge } = lookupTariff(state, consumerType, voltageLevel);
      const existing = await db.tariffProfile.findUnique({
        where: { state_consumerType_voltageLevel: { state, consumerType, voltageLevel } },
      });

      if (
        !existing ||
        differs(existing.tariffRsPerKwh, tariff) ||
        differs(existing.crossSubsidySurcharge, crossSubsidySurcharge)
      ) {
        changedFields.add(`TariffProfile:${state}:${consumerType}:${voltageLevel}`);
      }

      await db.tariffProfile.upsert({
        where: { state_consumerType_voltageLevel: { state, consumerType, voltageLevel } },
        create: {
          state,
          consumerType,
          voltageLevel,
          tariffRsPerKwh: tariff,
          crossSubsidySurcharge,
          source: TARIFF_SOURCE,
          isPlaceholder: false,
        },
        update: {
          tariffRsPerKwh: tariff,
          crossSubsidySurcharge,
          source: TARIFF_SOURCE,
        },
      });
    }
  }

  for (const voltageLevel of VOLTAGE_LEVELS) {
    const charge = lookupOpenAccessCharges(state, voltageLevel);
    const existing = await db.openAccessCharge.findUnique({
      where: { state_voltageLevel: { state, voltageLevel } },
    });

    if (
      !existing ||
      differs(existing.wheelingLossPct, charge.wheelingLossPct) ||
      differs(existing.wheelingChargeRsPerKwh, charge.wheelingChargeRsPerKwh) ||
      differs(existing.additionalSurchargeRsPerKwh, charge.additionalSurchargeRsPerKwh) ||
      differs(existing.bankingChargePct, charge.bankingChargePct)
    ) {
      changedFields.add(`OpenAccessCharge:${state}:${voltageLevel}`);
    }

    await db.openAccessCharge.upsert({
      where: { state_voltageLevel: { state, voltageLevel } },
      create: {
        state,
        voltageLevel,
        wheelingLossPct: charge.wheelingLossPct,
        wheelingChargeRsPerKwh: charge.wheelingChargeRsPerKwh,
        additionalSurchargeRsPerKwh: charge.additionalSurchargeRsPerKwh,
        bankingChargePct: charge.bankingChargePct,
        openAccessThresholdKva: OPEN_ACCESS_THRESHOLD_KVA[state],
        source: charge.source,
        sourceUrl: charge.sourceUrl || undefined,
        lastVerified: new Date(charge.lastVerified),
        isPlaceholder: charge.isPlaceholder,
        notes: charge.notes,
      },
      update: {
        wheelingLossPct: charge.wheelingLossPct,
        wheelingChargeRsPerKwh: charge.wheelingChargeRsPerKwh,
        additionalSurchargeRsPerKwh: charge.additionalSurchargeRsPerKwh,
        bankingChargePct: charge.bankingChargePct,
        openAccessThresholdKva: OPEN_ACCESS_THRESHOLD_KVA[state],
        source: charge.source,
        sourceUrl: charge.sourceUrl || undefined,
        lastVerified: new Date(charge.lastVerified),
        isPlaceholder: charge.isPlaceholder,
        notes: charge.notes,
      },
    });
  }

  return Array.from(changedFields);
}

function hasValidCronSecret(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

async function runRefresh(triggeredBy: "scheduled" | "manual") {
  const results: { state: string; status: "unchanged" | "updated"; changedFields: string[] }[] = [];

  for (const state of SEEDED_STATES) {
    const changedFields = await refreshState(state);
    const status = changedFields.length > 0 ? "updated" : "unchanged";
    results.push({ state, status, changedFields });

    await db.regulatoryRefreshLog.create({
      data: {
        state,
        status,
        summary:
          status === "updated"
            ? `${changedFields.length} field group(s) changed: ${changedFields.join(", ")}`
            : "No change — DB already matches tariffData.ts.",
        changedFields,
        triggeredBy,
      },
    });
  }

  return { ok: true, refreshedAt: new Date().toISOString(), results };
}

/** Vercel Cron (see vercel.json) hits this with GET + the CRON_SECRET
 * bearer token — that's the "automatic" path. A plain GET (no valid secret)
 * is just a read of the most recent refresh history, no auth required. */
export async function GET(req: NextRequest) {
  if (hasValidCronSecret(req)) {
    return NextResponse.json(await runRefresh("scheduled"));
  }

  const logs = await db.regulatoryRefreshLog.findMany({
    orderBy: { runAt: "desc" },
    take: 20,
  });
  return NextResponse.json({ logs });
}

/** Manual "Refresh regulatory data" trigger from the authenticated app. */
export async function POST(req: NextRequest) {
  if (hasValidCronSecret(req)) {
    return NextResponse.json(await runRefresh("scheduled"));
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await runRefresh("manual"));
}
