import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/CTASection";
import { SERVICES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services — Solar EPC, EHV Lines, EV, BESS & AI",
  description:
    "AINERGY's end-to-end services: Open Access-focused solar plant development, EHV line EPC from 11 kV to 220 kV, EV charger infrastructure, BESS, AI products and asset O&M.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-paper-50 pb-16 pt-36 lg:pt-44">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative">
          <SectionHeader
            eyebrow="Services"
            title="What AINERGY builds and operates."
            description="From Open Access solar plants and the EHV lines that connect them, to EV charging, storage and the AI layer that runs on top — engineered and delivered end to end, not outsourced."
          />
        </Container>
      </section>

      <section className="surface-dark relative overflow-hidden bg-ink-950 pb-24 pt-16 lg:pb-32">
        <div className="bg-radial-fade-dark pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 3) * 0.06}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Have a specific requirement in mind?"
        description="Whether it's an Open Access plant, an EHV line, or an EV charging rollout — tell AINERGY what you need built."
        primaryLabel="Get In Touch"
      />
    </>
  );
}
