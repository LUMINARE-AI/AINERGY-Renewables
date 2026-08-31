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
    <section className="bg-paper-50 pt-12 pb-24 lg:pt-16 lg:pb-32">
      <Container>
        <SectionHeader
          eyebrow="Why AINERGY"
          title="Energy is no longer just a utility. It's a strategic advantage."
        />

        <div className="mt-10 flex flex-wrap gap-2.5">
          {CHALLENGES.map((c) => (
            <span
              key={c}
              className="rounded-full border border-ink-900/10 bg-paper-100 px-4 py-2 text-sm text-ink-700"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-ink-900/10 bg-paper-100/60 p-8">
              <span className="font-mono-tag text-xs uppercase text-ink-500">
                Traditional Energy
              </span>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {TRADITIONAL.map((t) => (
                  <div
                    key={t}
                    className="rounded-lg border border-ink-900/10 bg-paper-50 px-3 py-2.5 text-sm text-ink-700"
                  >
                    {t}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-1 flex-col justify-end gap-2 border-t border-ink-900/10 pt-6 text-sm text-ink-500">
                <p className="flex items-center gap-2">
                  <X className="h-3.5 w-3.5 shrink-0 text-ink-400" /> Multiple
                  vendors
                </p>
                <p className="flex items-center gap-2">
                  <X className="h-3.5 w-3.5 shrink-0 text-ink-400" /> Multiple
                  contracts
                </p>
                <p className="flex items-center gap-2">
                  <X className="h-3.5 w-3.5 shrink-0 text-ink-400" /> Multiple
                  dashboards
                </p>
                <p className="flex items-center gap-2">
                  <X className="h-3.5 w-3.5 shrink-0 text-ink-400" /> Multiple
                  decisions
                </p>
              </div>
            </div>
          </Reveal>

          <div className="flex items-center justify-center py-2 lg:rotate-0">
            <ArrowDown className="h-6 w-6 text-current-500/60 lg:hidden" />
            <div className="hidden h-full w-px bg-gradient-to-b from-transparent via-current-500/40 to-transparent lg:block" />
          </div>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-current-500/25 bg-gradient-to-b from-current-400/10 to-transparent p-8 shadow-glow">
              <div>
                <span className="font-mono-tag text-xs uppercase text-current-600">
                  AINERGY
                </span>
                <p className="mt-6 font-display text-2xl font-medium text-ink-900">
                  One Energy OS
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  Generation, storage, procurement, EV and carbon tracking —
                  coordinated through a single intelligent platform.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-2 border-t border-ink-900/10 pt-6 text-sm text-ink-800">
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-forest-600" /> One
                  relationship
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-forest-600" /> One
                  intelligence layer
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 shrink-0 text-forest-600" /> One
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
