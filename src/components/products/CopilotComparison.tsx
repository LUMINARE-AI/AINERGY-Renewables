"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { COMPARISON_SCENARIOS } from "@/lib/productsContent";
import { cn } from "@/lib/utils";

export function CopilotComparison() {
  return (
    <div className="border-t border-white/10 py-16 lg:py-20">
      <Container>
        <Reveal>
          <h3 className="font-display text-2xl font-medium text-offwhite-100 sm:text-3xl">
            The core comparison
          </h3>
          <p className="mt-3 max-w-xl text-sm text-offwhite-300/60">
            Indicative comparison across five energy procurement scenarios — no
            prices shown.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-12">
            <div className="hidden lg:block">
              <svg
                className="pointer-events-none absolute left-[10%] right-[10%] top-8 h-px w-[80%] overflow-visible"
                aria-hidden
              >
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="rgba(58,187,194,0.35)"
                  strokeWidth="1"
                  strokeDasharray="6 4"
                />
              </svg>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory thin-scroll lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
              {COMPARISON_SCENARIOS.map((scenario, i) => (
                <div
                  key={scenario.id}
                  className={cn(
                    "min-w-[11rem] flex-1 snap-start rounded-2xl border px-4 py-5 text-center transition-all duration-300 hover:-translate-y-0.5 lg:min-w-0",
                    i === 0
                      ? "border-white/15 bg-white/5"
                      : i === COMPARISON_SCENARIOS.length - 1
                        ? "border-forest-500/30 bg-forest-500/10"
                        : "border-current-500/25 bg-current-400/5 hover:border-current-500/40 hover:shadow-glow-dark"
                  )}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="font-mono-tag text-[10px] uppercase text-current-300/70">
                    {scenario.short}
                  </span>
                  <p className="mt-3 text-sm font-medium leading-snug text-offwhite-100">
                    {scenario.label}
                  </p>
                  <p className="mt-3 text-[10px] uppercase tracking-wide text-offwhite-300/40">
                    Scenario
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
