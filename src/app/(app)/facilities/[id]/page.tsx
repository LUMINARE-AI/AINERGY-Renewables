import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScenarioTable } from "@/components/analysis/ScenarioTable";
import { RecommendationPanel } from "@/components/analysis/RecommendationPanel";
import { InvestmentCalculator } from "@/components/analysis/InvestmentCalculator";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth/session";
import { saveConsumptionProfile } from "@/lib/actions/consumptionProfile";
import { saveAnalysis } from "@/lib/actions/analysis";
import { buildScenarios } from "@/lib/calculations/scenarios";
import { buildRecommendation } from "@/lib/recommendations/engine";
import { toPlannerInputs } from "@/lib/calculations/profileToInputs";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-graphite-950/60 px-4 py-3 text-sm text-offwhite-100 transition-colors focus:border-current-400/60 focus:outline-none focus:ring-1 focus:ring-current-400/20";
const labelClass = "mb-2 block text-sm text-offwhite-300/70";
const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-current-400 px-7 py-3.5 text-sm font-medium text-graphite-950 shadow-[0_0_0_1px_rgba(240,169,62,0.35)] transition-all hover:bg-current-300 hover:shadow-glow-dark";
const secondaryButtonClass =
  "rounded-full border border-white/15 px-5 py-2.5 text-xs font-medium text-offwhite-200 transition-colors hover:border-current-400/60 hover:bg-white/5";

export default async function FacilityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();

  const facility = await db.facility.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: {
      consumptionProfiles: { orderBy: { createdAt: "desc" }, take: 1 },
      recommendations: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!facility) notFound();

  const profile = facility.consumptionProfiles[0] ?? null;
  const outcomes = profile ? buildScenarios(toPlannerInputs(facility, profile)) : null;
  const recommendation = outcomes ? buildRecommendation(outcomes) : null;
  const boundSaveProfile = saveConsumptionProfile.bind(null, facility.id);
  const boundSaveAnalysis = saveAnalysis.bind(null, facility.id);

  return (
    <section className="py-16 lg:py-20">
      <Container className="max-w-5xl space-y-10">
        <SectionHeader
          eyebrow={`${facility.state} · ${facility.consumerType} · ${facility.voltageLevel}`}
          title={facility.name}
          description={`${facility.sanctionedLoadKva.toLocaleString("en-IN")} kVA sanctioned load${facility.discom ? ` · ${facility.discom}` : ""}`}
          tone="dark"
        />

        <div>
          <h2 className="font-display text-xl font-medium text-offwhite-100">Consumption profile</h2>
          <p className="mt-1 text-sm text-offwhite-300/55">
            {profile
              ? "Latest profile shown below. Saving again adds a new version."
              : "Enter your monthly consumption and site details to run an analysis."}
          </p>

          <form
            action={boundSaveProfile}
            className="mt-5 grid gap-5 rounded-2xl border border-white/10 bg-graphite-900/50 p-6 sm:grid-cols-2 lg:p-8"
          >
            <div>
              <label className={labelClass} htmlFor="monthlyConsumptionKwh">
                Monthly consumption (kWh)
              </label>
              <input
                id="monthlyConsumptionKwh"
                name="monthlyConsumptionKwh"
                type="number"
                step="any"
                required
                defaultValue={profile?.monthlyConsumptionKwh}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="tariffRsPerKwh">
                Tariff (₹/kWh)
              </label>
              <input
                id="tariffRsPerKwh"
                name="tariffRsPerKwh"
                type="number"
                step="any"
                required
                defaultValue={profile?.tariffRsPerKwh}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="operatingHoursPerDay">
                Operating hours/day
              </label>
              <input
                id="operatingHoursPerDay"
                name="operatingHoursPerDay"
                type="number"
                step="any"
                min={1}
                max={24}
                required
                defaultValue={profile?.operatingHoursPerDay ?? 16}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="renewableTargetPct">
                Renewable target (%)
              </label>
              <input
                id="renewableTargetPct"
                name="renewableTargetPct"
                type="number"
                step="any"
                min={0}
                max={100}
                required
                defaultValue={profile?.renewableTargetPct ?? 60}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="rooftopAreaSqft">
                Rooftop area (sq ft)
              </label>
              <input
                id="rooftopAreaSqft"
                name="rooftopAreaSqft"
                type="number"
                step="any"
                min={0}
                defaultValue={profile?.rooftopAreaSqft ?? 0}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="groundAreaAcres">
                Ground area (acres)
              </label>
              <input
                id="groundAreaAcres"
                name="groundAreaAcres"
                type="number"
                step="any"
                min={0}
                defaultValue={profile?.groundAreaAcres ?? 0}
                className={fieldClass}
              />
            </div>

            <div className="flex flex-wrap gap-6 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm text-offwhite-300/70">
                <input
                  type="checkbox"
                  name="considerGround"
                  defaultChecked={profile?.considerGround ?? false}
                  className="h-4 w-4 rounded border-white/20 bg-graphite-950 accent-current-400"
                />
                Consider ground-mount
              </label>
              <label className="flex items-center gap-2 text-sm text-offwhite-300/70">
                <input
                  type="checkbox"
                  name="considerWind"
                  defaultChecked={profile?.considerWind ?? false}
                  className="h-4 w-4 rounded border-white/20 bg-graphite-950 accent-current-400"
                />
                Consider wind
              </label>
              <label className="flex items-center gap-2 text-sm text-offwhite-300/70">
                <input
                  type="checkbox"
                  name="includeOpenAccess"
                  defaultChecked={profile?.includeOpenAccess ?? true}
                  className="h-4 w-4 rounded border-white/20 bg-graphite-950 accent-current-400"
                />
                Include Open Access
              </label>
              <label className="flex items-center gap-2 text-sm text-offwhite-300/70">
                <input
                  type="checkbox"
                  name="considerBattery"
                  defaultChecked={profile?.considerBattery ?? false}
                  className="h-4 w-4 rounded border-white/20 bg-graphite-950 accent-current-400"
                />
                Include battery (BESS) — optional, off by default
              </label>
            </div>

            <div className="sm:col-span-2">
              <button type="submit" className={primaryButtonClass}>
                {profile ? "Update consumption profile" : "Save consumption profile"}
              </button>
            </div>
          </form>
        </div>

        {outcomes && recommendation && (
          <>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-medium text-offwhite-100">Scenario comparison</h2>
                <form action={boundSaveAnalysis}>
                  <button type="submit" className={secondaryButtonClass}>
                    Save this analysis
                  </button>
                </form>
              </div>
              <div className="mt-5">
                <ScenarioTable outcomes={outcomes} />
              </div>
            </div>

            <div>
              <h2 className="mb-5 font-display text-xl font-medium text-offwhite-100">Recommendation</h2>
              <RecommendationPanel recommendation={recommendation} />
            </div>

            <div>
              <h2 className="mb-5 font-display text-xl font-medium text-offwhite-100">Investment Path</h2>
              <div className="space-y-6">
                {outcomes
                  .filter((o) => o.investableCapexRs && o.investableCapexRs > 0)
                  .map((o) => (
                    <InvestmentCalculator
                      key={o.strategy}
                      label={o.label}
                      initialCapexRs={o.investableCapexRs!}
                      initialAnnualAvoidedCostRs={o.annualSavingsRs}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
