import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
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
      <section className="relative overflow-hidden bg-paper-50 pb-16 pt-36 lg:pt-44">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative">
          <SectionHeader
            eyebrow="Energy Procure Copilot"
            title="Upload a bill. Get a real energy plan."
            description="Upload your electricity bill and AINERGY reads your tariff, load and consumption automatically — then weighs rooftop solar, ground-mounted solar, on-site wind, battery storage and Open Access against your site constraints."
          />
        </Container>
      </section>

      <section className="bg-paper-50 pb-24 lg:pb-32">
        <Container>
          <EnergyPlanner />
        </Container>
      </section>

      <CTASection
        title="Turn this into an actual energy plan."
        primaryLabel="Run a Full Analysis"
        primaryHref="/analysis"
        secondaryLabel="Get Your Energy Assessment"
        secondaryHref="/for-business"
      />
    </>
  );
}
