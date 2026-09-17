import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SolutionCard } from "@/components/SolutionCard";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/CTASection";
import { Industries } from "@/components/Industries";
import { SOLUTIONS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Solutions — Open Access, Captive, Hybrid, Storage & EaaS",
  description:
    "AINERGY's C&I energy offerings: Green Energy Open Access, Captive, Group Captive, Solar + Wind Hybrid, BESS, 24×7 clean energy, Energy-as-a-Service and integrated strategies.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <section className="relative flex min-h-[55dvh] items-center overflow-hidden bg-paper-50 sm:min-h-[62dvh] lg:min-h-[68dvh]">
        <Image
          src="/solutions.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#59AFE7]/55 via-[#59AFE7]/25 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#59AFE7]/20 via-transparent to-[#59AFE7]/15" />
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative z-10 py-28 sm:py-32 lg:py-36">
          <div className="max-w-3xl">
            <SectionHeader title="Every layer of a modern C&I energy system" />
            <p className="mt-5 max-w-2xl rounded-2xl border border-[#59AFE7]/25 bg-[#59AFE7]/45 px-4 py-3 text-lg font-medium leading-relaxed text-ink-900 shadow-sm backdrop-blur-sm sm:px-5 sm:py-3.5">
              Adopt the energy mix you need — and the infrastructure, EPC and AI
              that deliver it — individually or as one integrated platform.
            </p>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-paper-50 pb-16 pt-14 sm:pb-20 sm:pt-16 lg:pb-24">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative">
          <Reveal>
            <div className="mb-8 max-w-2xl sm:mb-10">
              <span className="font-mono-tag text-xs uppercase text-current-600">
                Energy offerings
              </span>
              <h2 className="mt-3 font-display text-2xl font-medium text-ink-900 sm:text-3xl">
                How your business gets cleaner, smarter power.
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {SOLUTIONS.map((solution, i) => (
              <Reveal
                key={solution.slug}
                delay={(i % 3) * 0.06}
                className={
                  solution.featured ? "sm:col-span-2 lg:col-span-2" : undefined
                }
              >
                <SolutionCard solution={solution} tone="light" />
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
