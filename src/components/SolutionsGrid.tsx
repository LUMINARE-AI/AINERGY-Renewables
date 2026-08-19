import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SolutionCard } from "@/components/SolutionCard";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";
import { SOLUTIONS, CLOCK_247 } from "@/lib/data";

export function SolutionsGrid() {
  const cards = [...SOLUTIONS.slice(0, 4), CLOCK_247, ...SOLUTIONS.slice(4)];

  return (
    <section className="bg-graphite-950 py-24 lg:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Solutions"
            title="Every layer of a modern C&I energy system."
            description="From on-site generation to storage, procurement and AI-driven optimization — built to be adopted individually or as one integrated platform."
          />
          <Button href="/solutions" variant="secondary" icon className="shrink-0">
            All solutions
          </Button>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((solution, i) => (
            <Reveal key={solution.slug} delay={(i % 4) * 0.06}>
              <SolutionCard solution={solution} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
