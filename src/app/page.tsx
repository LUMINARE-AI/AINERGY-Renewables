import { Hero } from "@/components/Hero";
import { MetricStrip } from "@/components/MetricStrip";
import { WhyAinergy } from "@/components/WhyAinergy";
import { BusinessModelFlow } from "@/components/BusinessModelFlow";
import { EnergyNetwork } from "@/components/EnergyNetwork";
import { AISection } from "@/components/AISection";
import { CTASection } from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <MetricStrip />
      <WhyAinergy />
      <BusinessModelFlow />
      <EnergyNetwork />
      <AISection />
      <CTASection
        title="Your energy system is bigger than solar."
        secondaryLabel="Explore AINERGY OS"
        secondaryHref="/energy-os"
      />
    </>
  );
}
