import { Hero } from "@/components/Hero";
import { MetricStrip } from "@/components/MetricStrip";
import { WhyAinergy } from "@/components/WhyAinergy";
import { BusinessModelFlow } from "@/components/BusinessModelFlow";
import { AISection } from "@/components/AISection";
import { CTASection } from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <MetricStrip />
      <BusinessModelFlow />
      <WhyAinergy />
      <AISection />
      <CTASection
        title="Your energy system is bigger than solar."
        secondaryLabel="Explore Services"
        secondaryHref="/services"
      />
    </>
  );
}
