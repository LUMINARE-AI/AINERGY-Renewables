"use client";

import { ArrowDown, X, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";

const CHALLENGES = [
  "Rising energy costs",
  "Unpredictable demand",
  "Grid dependency",
  "Renewable-energy complexity",
  "Sustainability targets",
  "Storage challenges",
  "Fragmented energy decisions",
];

const TRADITIONAL = ["Grid", "Solar", "Wind", "Battery", "EV", "Procurement", "Carbon", "Data"];

export function WhyAinergy() {
  return (
    <section className="bg-graphite-950 py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="Why AINERGY"
          title="Energy is no longer just a utility. It's a strategic advantage."
          description="Businesses are navigating rising energy costs, unpredictable demand, grid dependency and mounting sustainability targets — with renewable complexity and storage decisions layered on top. AINERGY brings all of it together into one intelligent platform."
        />

        <div className="mt-10 flex flex-wrap gap-2.5">
          {CHALLENGES.map((c) => (
            <span
              key={c}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-offwhite-300/70"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-graphite-900/50 p-8">
              <span className="font-mono-tag text-xs uppercase text-offwhite-300/50">
                Traditional Energy
              </span>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {TRADITIONAL.map((t) => (
                  <div
                    key={t}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-offwhite-300/70"
                  >
                    {t}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-1 flex-col justify-end gap-2 border-t border-white/10 pt-6 text-sm text-offwhite-300/50">
                <p className="flex items-center gap-2">
                  <X className="h-3.5 w-3.5 shrink-0 text-red-400/70" /> Multiple
                  vendors
                </p>
                <p className="flex items-center gap-2">
                  <X className="h-3.5 w-3.5 shrink-0 text-red-400/70" /> Multiple
                  contracts
                </p>
                <p className="flex items-center gap-2">
                  <X className="h-3.5 w-3.5 shrink-0 text-red-400/70" /> Multiple
                  dashboards
                </p>
                <p className="flex items-center gap-2">
                  <X className="h-3.5 w-3.5 shrink-0 text-red-400/70" /> Multiple
                  decisions
                </p>
              </div>
            </div>
          </Reveal>

          <div className="flex items-center justify-center py-2 lg:rotate-0">
            <ArrowDown className="h-6 w-6 text-teal-400/60 lg:hidden" />
            <div className="hidden h-full w-px bg-gradient-to-b from-transparent via-teal-400/40 to-transparent lg:block" />
          </div>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-emerald-400/25 bg-gradient-to-b from-emerald-500/10 to-transparent p-8 shadow-glow">
              <div>
                <span className="font-mono-tag text-xs uppercase text-emerald-300">
                  AINERGY
                </span>
                <p className="mt-6 font-display text-2xl font-medium text-offwhite-100">
                  One Energy OS
                </p>
                <p className="mt-3 text-sm leading-relaxed text-offwhite-300/70">
                  Generation, storage, procurement, EV and carbon tracking —
                  coordinated through a single intelligent platform.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-offwhite-200/80">
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" /> One
                  relationship
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" /> One
                  intelligence layer
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" /> One
                  view of your energy system
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
