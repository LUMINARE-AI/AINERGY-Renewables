import { Hero } from "@/components/Hero";
import { MetricStrip } from "@/components/MetricStrip";
import { WhyAinergy } from "@/components/WhyAinergy";
import { EnergyOSDiagram } from "@/components/EnergyOSDiagram";
import { WhyOpenAccess } from "@/components/WhyOpenAccess";
import { EnergyNetwork } from "@/components/EnergyNetwork";
import { AISection } from "@/components/AISection";
import { CTASection } from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <MetricStrip />
      <WhyAinergy />
      <EnergyOSDiagram />
      <WhyOpenAccess />
      <EnergyNetwork />
      <AISection />
      <CTASection
        title="Your energy system is bigger than solar."
        description="Let AINERGY design the intelligent energy system your business needs next."
        secondaryLabel="Explore AINERGY OS"
        secondaryHref="/energy-os"
      />
    </>
  );
}
