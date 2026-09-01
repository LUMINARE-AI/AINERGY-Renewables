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
      <section className="bg-paper-50 pb-24 pt-28 lg:pb-32 lg:pt-32">
        <Container>
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
