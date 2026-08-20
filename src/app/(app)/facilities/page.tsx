import Link from "next/link";
import { Plus, Factory } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";

export default async function FacilitiesPage() {
  const session = await requireSession();

  const facilities = await db.facility.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { consumptionProfiles: true } } },
  });

  return (
    <section className="py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Facilities"
            title="Your facilities"
            description="Each facility carries its own load profile, tariff and Open Access analysis."
            tone="dark"
          />
          <Button href="/facilities/new" tone="dark" className="shrink-0">
            <Plus className="h-4 w-4" />
            New facility
          </Button>
        </div>

        {facilities.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-white/15 bg-graphite-900/30 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-current-400/10">
              <Factory className="h-5 w-5 text-current-300" />
            </div>
            <p className="mt-4 text-sm text-offwhite-300/60">
              No facilities yet. Add one to start an Open Access analysis.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => (
              <Link
                key={facility.id}
                href={`/facilities/${facility.id}`}
                className="rounded-2xl border border-white/10 bg-graphite-900/50 p-6 transition-colors hover:border-current-400/40 hover:bg-graphite-900/70"
              >
                <p className="font-display text-lg font-medium text-offwhite-100">{facility.name}</p>
                <p className="mt-1 text-sm text-offwhite-300/60">
                  {facility.state} · {facility.consumerType} · {facility.voltageLevel}
                </p>
                <p className="mt-3 text-xs text-offwhite-300/45">
                  {facility.sanctionedLoadKva.toLocaleString("en-IN")} kVA sanctioned
                </p>
                <p
                  className={`mt-1 text-xs ${
                    facility._count.consumptionProfiles === 0
                      ? "text-current-300/70"
                      : "text-forest-300/70"
                  }`}
                >
                  {facility._count.consumptionProfiles === 0
                    ? "No consumption profile yet"
                    : `${facility._count.consumptionProfiles} consumption profile(s)`}
                </p>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
