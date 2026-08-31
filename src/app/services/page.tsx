import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";
import { InfrastructureServiceCard } from "@/components/InfrastructureServiceCard";
import { CTASection } from "@/components/CTASection";
import { INFRASTRUCTURE_SERVICES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services — EPC, Storage, EV & Operations",
  description:
    "From energy strategy to physical infrastructure — AINERGY combines energy intelligence with solar EPC, EHV lines, rooftop solar, BESS, EV charging and O&M.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative flex min-h-[55dvh] items-center overflow-hidden bg-paper-50 sm:min-h-[62dvh] lg:min-h-[68dvh]">
        <Image
          src="/solutions.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative z-10 py-28 sm:py-32 lg:py-36">
          <SectionHeader
            eyebrow="Services"
            title="From Energy Strategy to Physical Infrastructure"
            description="AINERGY combines energy intelligence with engineering and execution capabilities."
            align="center"
            className="mx-auto"
          />
        </Container>
      </section>

      <section className="relative overflow-hidden bg-paper-50 py-16 sm:py-20 lg:py-28">
        <div className="bg-radial-fade pointer-events-none absolute inset-0 opacity-40" />
        <Container className="relative">
          <Reveal>
            <div className="mb-10 max-w-2xl sm:mb-12">
              <span className="font-mono-tag text-xs uppercase text-current-600">
                Engineering &amp; execution
              </span>
              <h2 className="mt-3 font-display text-2xl font-medium text-ink-900 sm:text-3xl">
                What AINERGY builds and operates.
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {INFRASTRUCTURE_SERVICES.map((service, i) => (
              <Reveal key={service.name} delay={(i % 3) * 0.06}>
                <InfrastructureServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Need infrastructure designed around your energy strategy?"
        primaryLabel="Get In Touch"
        primaryHref="/contact"
        secondaryLabel="Explore Solutions"
        secondaryHref="/solutions"
      />
    </>
  );
}
