import { CloudSun, Gauge, Battery, LineChart, Landmark, Wind } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";

const INPUTS = [
  { label: "Weather", icon: CloudSun },
  { label: "Generation", icon: Wind },
  { label: "Demand", icon: Gauge },
  { label: "Tariffs", icon: Landmark },
  { label: "Battery state", icon: Battery },
  { label: "Energy prices", icon: LineChart },
];

export function AISection() {
  return (
    <section className="bg-paper-50 py-24 lg:py-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Intelligence"
              title="Energy intelligence, built in."
            />
          </div>

          <Reveal delay={0.1}>
            <div className="relative rounded-3xl border border-ink-900/10 bg-paper-100/70 p-8 shadow-premium">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {INPUTS.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 rounded-xl border border-ink-900/10 bg-paper-50 p-4 text-center"
                  >
                    <Icon className="h-4 w-4 text-current-600" />
                    <span className="text-xs text-ink-700">{label}</span>
                  </div>
                ))}
              </div>

              <div className="my-6 flex items-center justify-center">
                <div className="h-8 w-px bg-gradient-to-b from-current-500/50 to-forest-500/50" />
              </div>

              <div className="rounded-2xl border border-current-500/30 bg-current-400/10 p-5 text-center">
                <p className="font-mono-tag text-xs uppercase text-current-600">
                  AINERGY OS — AI / ML Engine
                </p>
              </div>

              <div className="my-6 flex items-center justify-center">
                <div className="h-8 w-px bg-gradient-to-b from-forest-500/50 to-current-500/50" />
              </div>

              <div className="rounded-xl border border-ink-900/10 bg-paper-50 p-4 text-center text-sm text-ink-800">
                Recommended actions: generation mix, storage dispatch,
                procurement timing
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
