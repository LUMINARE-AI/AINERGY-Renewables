// Seeds TariffProfile / OpenAccessCharge from the existing, already-vetted
// src/lib/regulatory/tariffData.ts constants (Karnataka/Maharashtra/
// Rajasthan), plus one Gujarat fixture explicitly flagged isPlaceholder —
// per the spec's TESTING section ("add Gujarat as a placeholder-flagged
// fixture, don't silently skip it"). Also seeds one demo org/user/facility
// for local manual verification (see README).

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  VOLTAGE_LEVELS,
  lookupTariff,
  lookupOpenAccessCharges,
  OPEN_ACCESS_THRESHOLD_KVA,
  type ConsumerType,
  type StateName,
} from "../src/lib/regulatory/tariffData";
import {
  GUJARAT_PLACEHOLDER_TARIFF,
  GUJARAT_PLACEHOLDER_CSS,
  GUJARAT_PLACEHOLDER_THRESHOLD_KVA,
  GUJARAT_PLACEHOLDER_SOURCE,
  GUJARAT_PLACEHOLDER_ASC,
  GUJARAT_PLACEHOLDER_BANKING_PCT,
} from "../src/lib/regulatory/gujaratFixture";

const db = new PrismaClient();

const CONSUMER_TYPES: ConsumerType[] = ["commercial", "industrial"];
const SEEDED_STATES: Exclude<StateName, "Other">[] = ["Karnataka", "Maharashtra", "Rajasthan"];

const TARIFF_SOURCE = "AINERGY illustrative tariff model (src/lib/regulatory/tariffData.ts)";

async function main() {
  for (const state of SEEDED_STATES) {
    for (const consumerType of CONSUMER_TYPES) {
      for (const voltageLevel of VOLTAGE_LEVELS) {
        const { tariff, crossSubsidySurcharge } = lookupTariff(state, consumerType, voltageLevel);
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
  }

  for (const consumerType of CONSUMER_TYPES) {
    for (const voltageLevel of VOLTAGE_LEVELS) {
      await db.tariffProfile.upsert({
        where: { state_consumerType_voltageLevel: { state: "Gujarat", consumerType, voltageLevel } },
        create: {
          state: "Gujarat",
          consumerType,
          voltageLevel,
          tariffRsPerKwh: GUJARAT_PLACEHOLDER_TARIFF[consumerType],
          crossSubsidySurcharge: GUJARAT_PLACEHOLDER_CSS,
          source: GUJARAT_PLACEHOLDER_SOURCE,
          isPlaceholder: true,
        },
        update: {},
      });
    }
  }
  for (const voltageLevel of VOLTAGE_LEVELS) {
    // Gujarat has no per-voltage wheeling source yet either — reuse
    // Rajasthan's 33kV shape as a rough order-of-magnitude stand-in, still
    // clearly flagged isPlaceholder.
    const fallback = lookupOpenAccessCharges("Rajasthan", voltageLevel);
    await db.openAccessCharge.upsert({
      where: { state_voltageLevel: { state: "Gujarat", voltageLevel } },
      create: {
        state: "Gujarat",
        voltageLevel,
        wheelingLossPct: fallback.wheelingLossPct,
        wheelingChargeRsPerKwh: fallback.wheelingChargeRsPerKwh,
        additionalSurchargeRsPerKwh: GUJARAT_PLACEHOLDER_ASC,
        bankingChargePct: GUJARAT_PLACEHOLDER_BANKING_PCT,
        openAccessThresholdKva: GUJARAT_PLACEHOLDER_THRESHOLD_KVA,
        source: GUJARAT_PLACEHOLDER_SOURCE,
        isPlaceholder: true,
        notes: "Gujarat has not been individually researched — wheeling/loss figures borrowed from Rajasthan's shape as a rough stand-in.",
      },
      update: {},
    });
  }

  const org = await db.organization.upsert({
    where: { id: "demo-org" },
    create: { id: "demo-org", name: "Demo Organization" },
    update: {},
  });

  const passwordHash = await bcrypt.hash("password123", 10);
  await db.user.upsert({
    where: { email: "demo@ainergy.local" },
    create: {
      email: "demo@ainergy.local",
      passwordHash,
      name: "Demo User",
      organizationId: org.id,
    },
    update: {},
  });

  await db.facility.upsert({
    where: { id: "demo-facility" },
    create: {
      id: "demo-facility",
      organizationId: org.id,
      name: "Demo Facility — Rajasthan HT Industry",
      state: "Rajasthan",
      discom: "JVVNL",
      consumerType: "industrial",
      voltageLevel: "33kV",
      sanctionedLoadKva: 5000,
    },
    update: {},
  });

  console.log("Seed complete: 3 verified states + Gujarat placeholder fixture, demo org/user/facility.");
  console.log("Demo login: demo@ainergy.local / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
