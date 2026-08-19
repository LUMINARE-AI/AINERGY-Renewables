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
    <section className="bg-graphite-950 py-24 lg:py-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Intelligence"
              title="Energy intelligence, built in."
              description="AINERGY OS continuously analyzes weather, generation, demand, tariffs, battery state, grid conditions and energy prices — then recommends how a business should generate, store, procure and consume energy."
            />
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-offwhite-300/55">
              These are decision-support recommendations for the people who
              operate a business's energy system, not unsupervised control of
              physical assets.
            </p>
          </div>

          <Reveal delay={0.1}>
            <div className="relative rounded-3xl border border-white/10 bg-graphite-900/50 p-8">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {INPUTS.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center"
                  >
                    <Icon className="h-4 w-4 text-teal-300" />
                    <span className="text-xs text-offwhite-300/70">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="my-6 flex items-center justify-center">
                <div className="h-8 w-px bg-gradient-to-b from-teal-400/50 to-emerald-400/50" />
              </div>

              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/[0.06] p-5 text-center">
                <p className="font-mono-tag text-xs uppercase text-emerald-300">
                  AINERGY OS — AI / ML Engine
                </p>
              </div>

              <div className="my-6 flex items-center justify-center">
                <div className="h-8 w-px bg-gradient-to-b from-emerald-400/50 to-teal-400/50" />
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-offwhite-200/80">
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
