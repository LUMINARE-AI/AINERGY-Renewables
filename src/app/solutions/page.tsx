import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SolutionCard } from "@/components/SolutionCard";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/CTASection";
import { SOLUTIONS, CLOCK_247 } from "@/lib/data";

export const metadata: Metadata = {
  title: "Solutions — Solar, Wind, Storage & Energy Intelligence",
  description:
    "AINERGY's C&I energy solutions: on-site solar, Open Access, wind-solar hybrid, battery storage, 24×7 clean energy, energy intelligence, EV energy and Energy-as-a-Service.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  const cards = [...SOLUTIONS.slice(0, 4), CLOCK_247, ...SOLUTIONS.slice(4)];

  return (
    <>
      <section className="relative overflow-hidden bg-paper-50 pb-16 pt-36 lg:pt-44">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative">
          <SectionHeader
            eyebrow="Solutions"
            title="Every layer of a modern C&I energy system."
            description="Adopt individually or as one integrated platform — AINERGY's solutions span generation, storage, procurement and the AI that ties them together."
          />
        </Container>
      </section>

      <section className="surface-dark relative overflow-hidden bg-ink-950 pb-24 pt-16 lg:pb-32">
        <div className="bg-radial-fade-dark pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((solution, i) => (
              <Reveal key={solution.slug} delay={(i % 3) * 0.06}>
                <SolutionCard solution={solution} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Not sure which combination fits your business?"
        description="Share your electricity bill and load profile — AINERGY will design an energy mix around it."
        primaryLabel="Get Your Energy Assessment"
        primaryHref="/for-business"
      />
    </>
  );
}
