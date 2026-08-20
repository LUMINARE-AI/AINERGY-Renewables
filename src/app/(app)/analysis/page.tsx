import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";

// A full scenario/recommendation/investment analysis lives on each
// facility's own page (one hub per facility, since every calculation is
// facility-scoped) — this route is the spec-named entry point that routes
// there: to the single facility if there's exactly one, to the facility
// list otherwise.
export default async function AnalysisEntryPage() {
  const session = await requireSession();
  const facilities = await db.facility.findMany({
    where: { organizationId: session.user.organizationId },
    select: { id: true },
    take: 2,
  });

  if (facilities.length === 1) redirect(`/facilities/${facilities[0].id}`);
  if (facilities.length === 0) redirect("/facilities/new");
  redirect("/facilities");
}
