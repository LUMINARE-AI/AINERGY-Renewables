import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SolutionCard } from "@/components/SolutionCard";
import { ServiceCard } from "@/components/ServiceCard";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";
import { SOLUTIONS, CLOCK_247, SERVICES } from "@/lib/data";

export function SolutionsGrid() {
  const offerings = [...SOLUTIONS.slice(0, 4), CLOCK_247, ...SOLUTIONS.slice(4)].slice(
    0,
    4
  );
  const delivery = SERVICES.slice(0, 3);

  return (
    <section className="bg-paper-100/50 py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Solutions"
            title="Every layer of a modern C&I energy system."
            description="From on-site generation to storage, procurement and AI — plus the EPC and infrastructure that deliver it."
          />
          <Button href="/solutions" variant="secondary" icon className="shrink-0">
            All solutions
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {offerings.map((solution, i) => (
            <Reveal key={solution.slug} delay={(i % 4) * 0.06}>
              <SolutionCard solution={solution} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 border-t border-ink-900/10 pt-10 sm:mt-16 sm:pt-12">
          <Reveal>
            <p className="font-mono-tag text-xs uppercase text-current-600">
              Delivery &amp; infrastructure
            </p>
            <h3 className="mt-3 font-display text-xl font-medium text-ink-900 sm:text-2xl">
              What AINERGY builds and operates.
            </h3>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {delivery.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 3) * 0.06}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
