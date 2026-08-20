// Shared shape for AI-extracted electricity bill fields, used by both the
// /api/extract-bill route and the client-side BillUploadStep component.
// Mirrors the ElectricityBillLineItem model (field/value/unit/confidence)
// in prisma/schema.prisma so this can graduate to writing real rows later
// without a reshape.

import { z } from "zod";

export const CONSUMER_TYPE_VALUES = ["commercial", "industrial"] as const;
export const VOLTAGE_LEVEL_VALUES = ["11kV", "33kV", "66kV", "132kV"] as const;
export const STATE_VALUES = ["Karnataka", "Maharashtra", "Rajasthan", "Other"] as const;

const confidence = z.number().min(0).max(1);

// A single extracted field: the value the model read, how sure it is, and
// which page/line it came from (for the "show your work" UI).
function field<T extends z.ZodTypeAny>(valueSchema: T) {
  return z.object({
    value: valueSchema.nullable(),
    confidence: confidence,
    sourceNote: z.string().nullable().describe(
      "Short quote or line reference from the bill this was read from, e.g. 'Sanctioned Load: 1250 kVA'."
    ),
  });
}

export const BillExtractionSchema = z.object({
  state: field(z.enum(STATE_VALUES)),
  consumerType: field(z.enum(CONSUMER_TYPE_VALUES)),
  voltageLevel: field(z.enum(VOLTAGE_LEVEL_VALUES)),
  sanctionedLoadKva: field(z.number().positive()),
  monthlyConsumptionKwh: field(z.number().positive()),
  monthlyBillRs: field(z.number().positive()),
  averageTariffRsPerKwh: field(z.number().positive()),
  billingPeriod: field(z.string()),
  utilityOrDiscom: field(z.string()),
  overallConfidence: confidence.describe(
    "Your overall confidence that this is a readable Indian C&I electricity bill and the fields above are accurate."
  ),
  extractionNotes: z
    .string()
    .nullable()
    .describe(
      "Anything the reviewer should double check, or null if nothing stands out."
    ),
});

export type BillExtraction = z.infer<typeof BillExtractionSchema>;

// JSON Schema mirror of BillExtractionSchema for the Anthropic tool-use call
// (kept hand-written rather than derived so the descriptions read well to
// the model — this is the actual extraction prompt surface).
export const BILL_EXTRACTION_TOOL_SCHEMA = {
  name: "record_bill_extraction",
  description:
    "Record the fields extracted from an Indian commercial/industrial electricity bill.",
  input_schema: {
    type: "object" as const,
    properties: {
      state: fieldSchema(
        { type: "string", enum: STATE_VALUES as unknown as string[] },
        "Indian state the connection is in. Use 'Other' if it isn't Karnataka, Maharashtra or Rajasthan, or if unclear."
      ),
      consumerType: fieldSchema(
        { type: "string", enum: CONSUMER_TYPE_VALUES as unknown as string[] },
        "Whether the tariff category on the bill is commercial or industrial."
      ),
      voltageLevel: fieldSchema(
        { type: "string", enum: VOLTAGE_LEVEL_VALUES as unknown as string[] },
        "Supply voltage level (LT connections are usually treated as 11kV here). Pick the closest of 11kV/33kV/66kV/132kV."
      ),
      sanctionedLoadKva: fieldSchema(
        { type: "number" },
        "Sanctioned or contract demand, in kVA (convert from kW if needed, kVA = kW / 0.9 as a rule of thumb)."
      ),
      monthlyConsumptionKwh: fieldSchema(
        { type: "number" },
        "Total energy consumed this billing period, in kWh (units)."
      ),
      monthlyBillRs: fieldSchema(
        { type: "number" },
        "Total amount payable on the bill, in INR."
      ),
      averageTariffRsPerKwh: fieldSchema(
        { type: "number" },
        "Blended average tariff in Rs/kWh — total bill amount divided by units consumed, unless a clearer effective rate is stated."
      ),
      billingPeriod: fieldSchema(
        { type: "string" },
        "The billing period covered, e.g. '1–31 May 2026'."
      ),
      utilityOrDiscom: fieldSchema(
        { type: "string" },
        "Name of the DISCOM / utility issuing the bill."
      ),
      overallConfidence: {
        type: "number",
        minimum: 0,
        maximum: 1,
        description:
          "Overall confidence (0-1) that this is a legible Indian C&I electricity bill and the fields above are accurate.",
      },
      extractionNotes: {
        type: ["string", "null"],
        description:
          "Anything a human reviewer should double-check, or null if nothing stands out.",
      },
    },
    required: [
      "state",
      "consumerType",
      "voltageLevel",
      "sanctionedLoadKva",
      "monthlyConsumptionKwh",
      "monthlyBillRs",
      "averageTariffRsPerKwh",
      "billingPeriod",
      "utilityOrDiscom",
      "overallConfidence",
      "extractionNotes",
    ],
  },
};

function fieldSchema(valueSchema: Record<string, unknown>, description: string) {
  return {
    type: "object" as const,
    description,
    properties: {
      value: { ...valueSchema, description: "null if not found on the bill." },
      confidence: { type: "number", minimum: 0, maximum: 1 },
      sourceNote: {
        type: ["string", "null"],
        description: "Short quote or line reference this was read from.",
      },
    },
    required: ["value", "confidence", "sourceNote"],
  };
}
