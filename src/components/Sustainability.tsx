import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";

const METRICS = [
  { label: "Renewable Energy Enabled", value: "Coming soon" },
  { label: "CO₂ Avoided", value: "Coming soon" },
  { label: "Energy Efficiency Gains", value: "Coming soon" },
  { label: "Renewable Percentage", value: "Coming soon" },
  { label: "Clean-Energy Capacity", value: "5 MW in development" },
];

export function Sustainability() {
  return (
    <section className="relative overflow-hidden bg-paper-100 py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest-500/[0.06] via-transparent to-transparent" />
      <Container className="relative">
        <SectionHeader
          eyebrow="Sustainability"
          title="Clean energy that moves business forward."
          description="As AINERGY's projects come online, we will report real, verified sustainability metrics here — not projections."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {METRICS.map((metric, i) => (
            <Reveal key={metric.label} delay={i * 0.06}>
              <div className="flex h-full flex-col items-center rounded-2xl border border-forest-600/15 bg-paper-50 p-6 text-center shadow-premium">
                <p className="font-display text-xl font-medium text-forest-600">
                  {metric.value}
                </p>
                <p className="mt-2 text-xs text-ink-500">{metric.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
