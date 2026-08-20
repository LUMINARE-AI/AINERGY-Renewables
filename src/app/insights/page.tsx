import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InsightCard } from "@/components/InsightCard";
import { Reveal } from "@/components/shared/Reveal";
import { INSIGHTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Insights — Renewable Energy & C&I Energy Guides",
  description:
    "Guides and explainers on Open Access, battery storage economics, AI in energy, C&I energy economics, the energy transition and regulatory basics.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-paper-50 pb-16 pt-36 lg:pt-44">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative">
          <SectionHeader
            eyebrow="Insights"
            title="Understand the energy transition, not just buy into it."
            description="Guides and explainers on renewable procurement, storage economics, AI in energy and the regulations that shape C&I energy decisions in India."
          />
        </Container>
      </section>

      <section className="surface-dark relative overflow-hidden bg-ink-950 pb-24 pt-16 lg:pb-32">
        <div className="bg-radial-fade-dark pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INSIGHTS.map((insight, i) => (
              <Reveal key={insight.slug} delay={(i % 3) * 0.06}>
                <InsightCard insight={insight} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
