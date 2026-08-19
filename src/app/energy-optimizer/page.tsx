import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EnergyPlanner } from "@/components/EnergyPlanner";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "C&I Energy Optimizer — Rooftop, Ground-Mount, Wind & Open Access",
  description:
    "An interactive C&I energy optimizer that weighs rooftop solar, ground-mounted solar, on-site wind and Open Access against your business's load and site constraints.",
  alternates: { canonical: "/energy-optimizer" },
};

export default function EnergyOptimizerPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-graphite-950 pb-16 pt-36 lg:pt-44">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative">
          <SectionHeader
            eyebrow="C&I Energy Optimizer"
            title="What could your energy system look like?"
            description="Enter your load and site details to see an illustrative mix of rooftop solar, ground-mounted solar, on-site wind and Open Access — including where site constraints make Open Access the more practical route."
          />
        </Container>
      </section>

      <section className="bg-graphite-950 pb-24 lg:pb-32">
        <Container>
          <EnergyPlanner />
        </Container>
      </section>

      <CTASection
        title="Turn this into an actual energy plan."
        description="This tool is a simplified demonstration. A real AINERGY proposal is built on your electricity bills, load curve and a site assessment."
        primaryLabel="Get Your Energy Assessment"
        primaryHref="/for-business"
      />
    </>
  );
}
