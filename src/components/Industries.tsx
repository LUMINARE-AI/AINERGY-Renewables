import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IndustryCard } from "@/components/IndustryCard";
import { Reveal } from "@/components/shared/Reveal";
import { INDUSTRIES } from "@/lib/data";

export function Industries() {
  return (
    <section className="bg-graphite-900/40 py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Industries"
          title="Built around how your business uses energy."
          description="Every industry has a distinct load profile, operating rhythm and energy risk. AINERGY designs around yours."
        />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {INDUSTRIES.map((industry, i) => (
            <Reveal key={industry.name} delay={(i % 6) * 0.05}>
              <IndustryCard industry={industry} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
