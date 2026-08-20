import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InsightCard } from "@/components/InsightCard";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";
import { INSIGHTS } from "@/lib/data";

export function InsightsPreview() {
  return (
    <section className="bg-paper-50 py-24 lg:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Insights"
            title="Understand the energy transition, not just buy into it."
            description="Guides and explainers on renewable procurement, storage economics and AI in energy — written for people who make energy decisions."
          />
          <Button href="/insights" variant="secondary" icon className="shrink-0">
            All insights
          </Button>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INSIGHTS.slice(0, 3).map((insight, i) => (
            <Reveal key={insight.slug} delay={i * 0.08}>
              <InsightCard insight={insight} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
