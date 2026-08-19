"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";
import { AI_CAPABILITIES, OS_NODES } from "@/lib/data";

function OrbitDiagram() {
  const [active, setActive] = useState<string | null>(null);
  const radius = 42;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.3"
        />
        {OS_NODES.map((node, i) => {
          const angle = (i / OS_NODES.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          const isActive = active === node;
          return (
            <line
              key={node}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke={isActive ? "#2dd4c8" : "rgba(45,212,200,0.18)"}
              strokeWidth={isActive ? 0.5 : 0.25}
            />
          );
        })}
      </svg>

      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-emerald-400/40 bg-graphite-900 text-center shadow-glow sm:h-32 sm:w-32">
        <span className="font-display text-sm font-semibold text-offwhite-100 sm:text-base">
          AINERGY
        </span>
        <span className="font-mono-tag text-[10px] text-emerald-300">OS</span>
      </div>

      {OS_NODES.map((node, i) => {
        const angle = (i / OS_NODES.length) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        const isActive = active === node;
        return (
          <button
            key={node}
            onMouseEnter={() => setActive(node)}
            onFocus={() => setActive(node)}
            onMouseLeave={() => setActive(null)}
            onBlur={() => setActive(null)}
            style={{ left: `${x}%`, top: `${y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
              isActive
                ? "border-teal-400 bg-teal-400/10 text-teal-200 scale-110"
                : "border-white/15 bg-graphite-900/90 text-offwhite-300/70"
            }`}
          >
            {node}
          </button>
        );
      })}
    </div>
  );
}

export function EnergyOSDiagram() {
  return (
    <section className="relative overflow-hidden bg-graphite-900/40 py-24 lg:py-32">
      <div className="bg-radial-fade pointer-events-none absolute inset-0" />
      <Container className="relative">
        <SectionHeader
          eyebrow="AINERGY OS"
          title="One operating system. Your entire energy ecosystem."
          description="Solar, wind, storage, grid, Open Access, EV and factory load — read alongside weather, tariffs and carbon data — coordinated by a single intelligence layer."
          align="center"
          className="mx-auto"
        />

        <Reveal className="mt-16" delay={0.1}>
          <OrbitDiagram />
        </Reveal>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AI_CAPABILITIES.map((cap, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[
              cap.icon
            ];
            return (
              <Reveal key={cap.title} delay={i * 0.06}>
                <div className="group h-full rounded-2xl border border-white/10 bg-graphite-950/60 p-6 transition-colors hover:border-teal-400/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/10 text-teal-300">
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-medium text-offwhite-100">
                    {cap.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-offwhite-300/60">
                    {cap.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
