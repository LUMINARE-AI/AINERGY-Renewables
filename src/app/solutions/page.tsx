import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SolutionCard } from "@/components/SolutionCard";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/CTASection";
import { Industries } from "@/components/Industries";
import { SOLUTIONS, CLOCK_247 } from "@/lib/data";

export const metadata: Metadata = {
  title: "Solutions — Solar, Wind, Storage, EPC & Energy Intelligence",
  description:
    "AINERGY's C&I solutions: on-site solar, Open Access, hybrid, storage, energy intelligence, EV and Energy-as-a-Service — plus the EPC, BESS, EV charging and AI delivery behind them.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  const offerings = [...SOLUTIONS.slice(0, 4), CLOCK_247, ...SOLUTIONS.slice(4)];

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
        <Container className="relative z-10 py-28 sm:py-32 lg:py-36">
          <SectionHeader
            title="Every layer of a modern C&I energy system."
            description="Adopt the energy mix you need — and the infrastructure, EPC and AI that deliver it — individually or as one integrated platform."
          />
        </Container>
      </section>

      <section className="surface-dark relative overflow-hidden bg-ink-950 pb-16 pt-14 sm:pb-20 sm:pt-16 lg:pb-24">
        <div className="bg-radial-fade-dark pointer-events-none absolute inset-0" />
        <Container className="relative">
          <Reveal>
            <div className="mb-8 max-w-2xl sm:mb-10">
              <span className="font-mono-tag text-xs uppercase text-current-300">
                Energy offerings
              </span>
              <h2 className="mt-3 font-display text-2xl font-medium text-offwhite-100 sm:text-3xl">
                How your business gets cleaner, smarter power.
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {offerings.map((solution, i) => (
              <Reveal key={solution.slug} delay={(i % 3) * 0.06}>
                <SolutionCard solution={solution} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Industries />

      <CTASection
        title="Not sure which combination fits your business?"
        primaryLabel="Get Your Energy Assessment"
        primaryHref="/energy-optimizer"
      />
    </>
  );
}
