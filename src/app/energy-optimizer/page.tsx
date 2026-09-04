import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { EnergyPlanner } from "@/components/EnergyPlanner";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Energy Procure Copilot — Upload a Bill, Get a C&I Energy Plan",
  description:
    "AINERGY's Energy Procure Copilot reads your electricity bill and weighs rooftop solar, ground-mounted solar, on-site wind, battery storage and Open Access against your business's load and site constraints.",
  alternates: { canonical: "/energy-optimizer" },
};

export default function EnergyOptimizerPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-paper-50 pb-24 pt-28 lg:pb-32 lg:pt-32">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <div className="paper-grain" />
        <div
          className="pointer-events-none absolute -right-24 top-16 h-[28rem] w-[28rem] rounded-full bg-current-400/10 blur-3xl lg:right-0"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 bottom-0 h-[22rem] w-[22rem] rounded-full bg-gold-500/10 blur-3xl"
          aria-hidden
        />
        <svg
          className="pointer-events-none absolute -right-8 top-24 hidden h-[22rem] w-[22rem] text-current-500/10 lg:block"
          viewBox="0 0 320 320"
          fill="none"
          aria-hidden
        >
          <circle cx="160" cy="160" r="118" stroke="currentColor" strokeWidth="14" />
          <circle cx="160" cy="160" r="72" stroke="currentColor" strokeWidth="14" />
          <circle cx="160" cy="160" r="28" fill="currentColor" opacity="0.35" />
        </svg>

        <Container className="relative z-10">
          <h1 className="sr-only">
            Energy Procure Copilot — upload a bill, get a C&amp;I energy plan
          </h1>
          <EnergyPlanner />
        </Container>
      </section>

      <CTASection
        title="Turn this into an actual energy plan."
        primaryLabel="Run a Full Analysis"
        primaryHref="/analysis"
        secondaryLabel="Explore Products"
        secondaryHref="/products"
      />
    </>
  );
}
