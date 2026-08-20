// Itemized landed-cost engine — Grid vs Third-Party Open Access vs Captive vs
// Group Captive, each broken into its constituent Rs/kWh charges rather than
// a flat "discount off tariff" hack. Same deterministic, auditable-math
// discipline as the rest of src/lib/calculations: every term below is a named
// field a UI can render as a line item, and every input charge traces back to
// src/lib/regulatory/tariffData.ts's sourced, dated OPEN_ACCESS_CHARGES /
// TARIFF_TABLE — nothing here is fabricated or averaged away.
//
// Rule 3 of the Electricity Rules, 2005 (as amended) exempts captive
// generation — a plant meeting the 26% equity / 51% consumption captive test,
// whether wholly owned ("captive") or pooled with other members ("group
// captive") — from the cross-subsidy surcharge; several state regulators also
// waive or reduce the additional surcharge for captive routes (see the
// per-state `notes` in tariffData.ts). Third-party Open Access (a pure PPA,
// no captive equity stake) does not get this waiver. That distinction is the
// one landed-cost difference this module encodes between "third_party" and
// "captive"/"group_captive" — the rest of the charge stack (wheeling, losses,
// banking) applies identically to all three off-site routes.

import {
  type StateName,
  type VoltageLevel,
  type ConsumerType,
  lookupOpenAccessCharges,
  lookupTariff,
  lookupGenerationCost,
} from "../regulatory/tariffData";

export type LandedCostRoute = "grid" | "third_party" | "captive" | "group_captive";

export type LandedCostLineItem = {
  label: string;
  valueRsPerKwh: number;
  note?: string;
};

export type LandedCostBreakdown = {
  route: LandedCostRoute;
  landedCostRsPerKwh: number;
  lineItems: LandedCostLineItem[];
  isPlaceholder: boolean;
  notes: string[];
};

export type LandedCostInputs = {
  state: StateName;
  consumerType: ConsumerType;
  voltageLevel: VoltageLevel;
  gridTariffRsPerKwh: number; // current landed cost — the bill's Rs/kWh today
};

/** Grid: today's landed cost is simply the retail tariff on the bill — no
 * open-access charge stack applies. Kept as a function (rather than inlining
 * `inputs.gridTariffRsPerKwh`) so callers always go through one entry point
 * and the "current landing cost" line item is labeled consistently. */
export function computeGridLandedCost(inputs: LandedCostInputs): LandedCostBreakdown {
  return {
    route: "grid",
    landedCostRsPerKwh: Math.round(inputs.gridTariffRsPerKwh * 100) / 100,
    lineItems: [
      { label: "Grid tariff (current bill)", valueRsPerKwh: Math.round(inputs.gridTariffRsPerKwh * 100) / 100 },
    ],
    isPlaceholder: false,
    notes: [],
  };
}

function offSiteLandedCost(
  route: "third_party" | "captive" | "group_captive",
  inputs: LandedCostInputs
): LandedCostBreakdown {
  const charge = lookupOpenAccessCharges(inputs.state, inputs.voltageLevel);
  const tariffCell = lookupTariff(inputs.state, inputs.consumerType, inputs.voltageLevel);
  const generation = lookupGenerationCost(inputs.state);

  const generationCostRsPerKwh =
    route === "third_party" ? generation.thirdPartyPpa : generation.captiveLcoe;

  // Captive routes (single-owner or pooled/"group") are CSS + ASC exempt
  // under Rule 3 of the Electricity Rules, 2005, subject to the 26%/51%
  // captive test — third-party OA is not, since there's no captive equity
  // stake. See file header.
  const captiveExempt = route === "captive" || route === "group_captive";
  const crossSubsidySurchargeRsPerKwh = captiveExempt ? 0 : tariffCell.crossSubsidySurcharge;
  const additionalSurchargeRsPerKwh = captiveExempt ? 0 : charge.additionalSurchargeRsPerKwh;

  // Technical losses: units lost in wheeling still had to be generated, so
  // the loss shows up as an extra generation-cost line rather than being
  // silently absorbed — e.g. a 5% loss means ~5.3% more generation cost per
  // kWh actually delivered.
  const lossFraction = charge.wheelingLossPct / 100;
  const lossCostRsPerKwh =
    lossFraction > 0 && lossFraction < 1
      ? generationCostRsPerKwh * (1 / (1 - lossFraction) - 1)
      : 0;

  // Banking charge: the % of banked energy the DISCOM retains (not returned
  // when drawn back) — approximated as that % of the generation cost, since
  // it's effectively generated energy the consumer forfeits the value of.
  const bankingCostRsPerKwh = generationCostRsPerKwh * (charge.bankingChargePct / 100);

  const lineItems: LandedCostLineItem[] = [
    { label: route === "third_party" ? "Third-party PPA rate" : "Captive generation cost (LCOE)", valueRsPerKwh: round2(generationCostRsPerKwh) },
    { label: "Wheeling charge", valueRsPerKwh: round2(charge.wheelingChargeRsPerKwh) },
    { label: `Wheeling losses (${charge.wheelingLossPct}%)`, valueRsPerKwh: round2(lossCostRsPerKwh) },
    {
      label: "Cross-subsidy surcharge (CSS)",
      valueRsPerKwh: round2(crossSubsidySurchargeRsPerKwh),
      note: captiveExempt ? "Waived — captive route exempt under Rule 3, Electricity Rules 2005" : undefined,
    },
    {
      label: "Additional surcharge (ASC)",
      valueRsPerKwh: round2(additionalSurchargeRsPerKwh),
      note: captiveExempt ? "Waived — captive route" : undefined,
    },
    { label: `Banking charge (${charge.bankingChargePct}%)`, valueRsPerKwh: round2(bankingCostRsPerKwh) },
  ];

  const landedCostRsPerKwh = round2(
    lineItems.reduce((sum, item) => sum + item.valueRsPerKwh, 0)
  );

  const notes = [charge.notes].filter(Boolean);
  if (charge.isPlaceholder) {
    notes.unshift(
      `${inputs.state} ${inputs.voltageLevel} open-access charges include a placeholder figure — verify before commercial use.`
    );
  }

  return {
    route,
    landedCostRsPerKwh,
    lineItems,
    isPlaceholder: charge.isPlaceholder,
    notes,
  };
}

export function computeThirdPartyLandedCost(inputs: LandedCostInputs): LandedCostBreakdown {
  return offSiteLandedCost("third_party", inputs);
}

export function computeCaptiveLandedCost(inputs: LandedCostInputs): LandedCostBreakdown {
  return offSiteLandedCost("captive", inputs);
}

export function computeGroupCaptiveLandedCost(inputs: LandedCostInputs): LandedCostBreakdown {
  return offSiteLandedCost("group_captive", inputs);
}

/** All four landed-cost routes for one facility, side by side — the shape
 * the comparison UI ("current landing cost vs open access vs captive vs
 * group captive") renders directly. */
export function compareLandedCosts(inputs: LandedCostInputs): Record<LandedCostRoute, LandedCostBreakdown> {
  return {
    grid: computeGridLandedCost(inputs),
    third_party: computeThirdPartyLandedCost(inputs),
    captive: computeCaptiveLandedCost(inputs),
    group_captive: computeGroupCaptiveLandedCost(inputs),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
