import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

// .nullish() (not .optional()) — these values come from FormData.get() on
// the client, which returns null (not undefined) for an unselected <select>
// or an empty field, and JSON.stringify preserves that null.
const leadSchema = z.object({
  source: z.enum(["energy_optimizer", "contact_form"]),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).nullish(),
  company: z.string().max(200).nullish(),
  city: z.string().max(200).nullish(),
  industry: z.string().max(200).nullish(),
  consumption: z.string().max(200).nullish(),
  tariff: z.string().max(200).nullish(),
  requirement: z.string().max(200).nullish(),
  message: z.string().max(4000).nullish(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  await db.lead.create({ data: parsed.data });

  return NextResponse.json({ ok: true });
}
