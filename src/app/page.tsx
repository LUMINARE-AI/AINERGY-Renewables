import { Hero } from "@/components/Hero";
import { MetricStrip } from "@/components/MetricStrip";
import { BrandDifferentiation } from "@/components/BrandDifferentiation";
import { WhyAinergy } from "@/components/WhyAinergy";
import { EnergyOSDiagram } from "@/components/EnergyOSDiagram";
import { SolutionsGrid } from "@/components/SolutionsGrid";
import { WhyOpenAccess } from "@/components/WhyOpenAccess";
import { ServicesGrid } from "@/components/ServicesGrid";
import { EnergyNetwork } from "@/components/EnergyNetwork";
import { AISection } from "@/components/AISection";
import { Industries } from "@/components/Industries";
import { BusinessModels } from "@/components/BusinessModels";
import { Sustainability } from "@/components/Sustainability";
import { InsightsPreview } from "@/components/InsightsPreview";
import { CTASection } from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <MetricStrip />
      <BrandDifferentiation />
      <WhyAinergy />
      <EnergyOSDiagram />
      <SolutionsGrid />
      <WhyOpenAccess />
      <ServicesGrid />
      <EnergyNetwork />
      <AISection />
      <Industries />
      <BusinessModels />
      <Sustainability />
      <InsightsPreview />
      <CTASection
        title="Your energy system is bigger than solar."
        description="Let AINERGY design the intelligent energy system your business needs next."
        secondaryLabel="Explore AINERGY OS"
        secondaryHref="/energy-os"
      />
    </>
  );
}
