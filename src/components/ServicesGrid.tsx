import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";
import { SERVICES } from "@/lib/data";

export function ServicesGrid() {
  return (
    <section className="bg-paper-100/50 py-24 lg:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Services"
            title="What AINERGY builds and operates."
            description="From Open Access solar plants and the EHV lines that connect them, to EV charging, storage and the AI layer that runs on top — engineered and delivered end to end, not outsourced."
          />
          <Button href="/services" variant="secondary" icon className="shrink-0">
            All services
          </Button>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.slug} delay={(i % 3) * 0.06}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
