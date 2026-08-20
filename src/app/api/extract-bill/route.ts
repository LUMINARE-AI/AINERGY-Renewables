import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  BillExtractionSchema,
  BILL_EXTRACTION_TOOL_SCHEMA,
  type BillExtraction,
} from "@/lib/billExtraction/schema";

// Deliberately anonymous, no database write — this powers the public
// /energy-optimizer teaser (see EnergyPlanner). A signed-in flow that
// persists to ElectricityBill/ElectricityBillLineItem is a natural next
// step but is out of scope here; the extraction shape already matches
// those columns so that migration is additive, not a reshape.

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB, comfortably under Claude's per-file limits
const ACCEPTED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Bill reading isn't set up on this deployment yet — add ANTHROPIC_API_KEY to your environment to enable it. You can still enter your details manually.",
      },
      { status: 501 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "bad_request", message: "Couldn't read the upload." },
      { status: 400 }
    );
  }

  const file = formData.get("bill");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "bad_request", message: "No file was attached." },
      { status: 400 }
    );
  }
  if (!ACCEPTED_TYPES.has(file.type)) {
    return NextResponse.json(
      {
        error: "unsupported_type",
        message: "Please upload a PDF, PNG, JPG or WEBP of your bill.",
      },
      { status: 415 }
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: "too_large", message: "That file is larger than 15MB." },
      { status: 413 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const base64 = bytes.toString("base64");

  const contentBlock =
    file.type === "application/pdf"
      ? {
          type: "document" as const,
          source: {
            type: "base64" as const,
            media_type: "application/pdf" as const,
            data: base64,
          },
        }
      : {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: file.type as "image/png" | "image/jpeg" | "image/webp",
            data: base64,
          },
        };

  const anthropic = new Anthropic({ apiKey });

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1500,
      system:
        "You are the bill-reading step inside AINERGY's Energy Procure Copilot, a tool that helps Indian commercial and industrial electricity consumers evaluate rooftop solar, wind, battery storage and Open Access renewable energy. You are given a photo or PDF of one electricity bill. Extract exactly the fields requested via the record_bill_extraction tool. Be honest about uncertainty: if a field isn't visible or you're guessing, give it a low confidence score rather than a false low-confidence-free answer. Never fabricate a number that isn't on the bill — if it's genuinely absent, set value to null and confidence to 0.",
      tools: [BILL_EXTRACTION_TOOL_SCHEMA],
      tool_choice: { type: "tool", name: BILL_EXTRACTION_TOOL_SCHEMA.name },
      messages: [
        {
          role: "user",
          content: [
            contentBlock,
            {
              type: "text",
              text: "Read this electricity bill and extract the fields via record_bill_extraction.",
            },
          ],
        },
      ],
    });

    const toolUse = message.content.find(
      (block) => block.type === "tool_use"
    );
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json(
        {
          error: "extraction_failed",
          message: "Couldn't read that bill. Try a clearer scan, or enter details manually.",
        },
        { status: 422 }
      );
    }

    const parsed = BillExtractionSchema.safeParse(toolUse.input);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "extraction_failed",
          message: "Got an unexpected response while reading that bill. Please enter details manually.",
        },
        { status: 422 }
      );
    }

    const extraction: BillExtraction = parsed.data;

    if (extraction.overallConfidence < 0.25) {
      return NextResponse.json(
        {
          error: "low_confidence",
          message:
            "That didn't look like a readable C&I electricity bill, so we didn't extract numbers from it. You can still enter details manually.",
          extraction,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ extraction });
  } catch (err) {
    console.error("extract-bill failed", err);
    return NextResponse.json(
      {
        error: "server_error",
        message: "Something went wrong reading that bill. Please try again or enter details manually.",
      },
      { status: 500 }
    );
  }
}
