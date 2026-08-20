import Link from "next/link";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { CurrentVsProjectedChart } from "@/components/analysis/CurrentVsProjectedChart";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { buildScenarios, rankScenarios } from "@/lib/calculations/scenarios";
import { toPlannerInputs } from "@/lib/calculations/profileToInputs";

function StatTile({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "forest";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-graphite-900/50 p-6 transition-colors hover:border-white/15">
      <p className="text-xs uppercase tracking-wide text-offwhite-300/45">{label}</p>
      <p
        className={`mt-2 font-display text-2xl font-medium ${
          tone === "forest" ? "text-forest-300" : "text-offwhite-100"
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-offwhite-300/50">{hint}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const session = await requireSession();

  const facilities = await db.facility.findMany({
    where: { organizationId: session.user.organizationId },
    include: { consumptionProfiles: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  const withProfile = facilities.filter((f) => f.consumptionProfiles[0]);

  const rows = withProfile.map((f) => {
    const profile = f.consumptionProfiles[0];
    const outcomes = buildScenarios(toPlannerInputs(f, profile));
    const gridOnly = outcomes.find((o) => o.strategy === "grid_only")!;
    const best = rankScenarios(outcomes.filter((o) => o.eligible))[0] ?? gridOnly;
    return { facility: f, gridOnly, best };
  });

  const currentAnnualCostRs = rows.reduce((sum, r) => sum + r.gridOnly.annualCostRs, 0);
  const projectedAnnualCostRs = rows.reduce((sum, r) => sum + r.best.annualCostRs, 0);
  const annualSavingsRs = currentAnnualCostRs - projectedAnnualCostRs;
  const dataQualityScore =
    facilities.length > 0 ? Math.round((withProfile.length / facilities.length) * 100) : 0;

  return (
    <section className="py-16 lg:py-20">
      <Container className="space-y-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Dashboard"
            title="Your Open Access overview"
            description="Aggregated across all facilities with a saved consumption profile."
            tone="dark"
          />
          <Button href="/facilities/new" tone="dark" className="shrink-0">
            <Plus className="h-4 w-4" />
            New facility
          </Button>
        </div>

        {facilities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-graphite-900/30 p-12 text-center">
            <p className="text-sm text-offwhite-300/60">
              Add your first facility to see a cost and savings overview here.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="Current annual cost"
                value={`₹${currentAnnualCostRs.toLocaleString("en-IN")}`}
                hint="Grid-only, across facilities with a profile"
              />
              <StatTile
                label="Potential annual cost"
                value={`₹${projectedAnnualCostRs.toLocaleString("en-IN")}`}
                hint="Best eligible scenario per facility"
              />
              <StatTile
                label="Potential annual savings"
                value={`₹${annualSavingsRs.toLocaleString("en-IN")}`}
                tone="forest"
              />
              <StatTile
                label="Data quality"
                value={`${dataQualityScore}/100`}
                hint={`${withProfile.length} of ${facilities.length} facilities have a profile`}
              />
            </div>

            <CurrentVsProjectedChart
              rows={rows.map((r) => ({
                facilityName: r.facility.name,
                currentAnnualCostRs: r.gridOnly.annualCostRs,
                projectedAnnualCostRs: r.best.annualCostRs,
              }))}
            />

            <div>
              <h2 className="mb-4 font-display text-lg font-medium text-offwhite-100">Facilities</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {facilities.map((f) => (
                  <Link
                    key={f.id}
                    href={`/facilities/${f.id}`}
                    className="rounded-2xl border border-white/10 bg-graphite-900/50 p-6 transition-colors hover:border-current-400/40 hover:bg-graphite-900/70"
                  >
                    <p className="font-medium text-offwhite-100">{f.name}</p>
                    <p className="mt-1 text-xs text-offwhite-300/55">
                      {f.state} · {f.voltageLevel}
                    </p>
                    <p
                      className={`mt-3 text-xs ${
                        f.consumptionProfiles[0] ? "text-forest-300/70" : "text-current-300/70"
                      }`}
                    >
                      {f.consumptionProfiles[0] ? "Analysis ready" : "Needs a consumption profile"}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
