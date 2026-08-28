import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, Database, Cpu, SlidersHorizontal, LayoutGrid, Landmark } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Energy OS — AI Energy Intelligence Platform",
  description:
    "The architecture behind AINERGY OS: a data layer, AI/ML engine and optimization engine that turn energy data into business decisions.",
  alternates: { canonical: "/energy-os" },
};

const DATA_SOURCES = [
  "Smart Meters",
  "Bills",
  "Solar",
  "Wind",
  "BESS",
  "Weather",
  "Tariffs",
  "Grid",
];

const LAYERS = [
  {
    title: "Energy Data Layer",
    description:
      "Ingests and normalizes data from smart meters, bills, generation assets, storage, weather and tariff sources into a single, structured record of a business's energy system.",
    icon: Database,
  },
  {
    title: "Asset Intelligence",
    description:
      "Continuously tracks the health, performance and availability of every connected generation and storage asset.",
    icon: LayoutGrid,
  },
  {
    title: "Forecasting",
    description:
      "Predicts generation and demand using weather, historical load and operating patterns.",
    icon: Cpu,
  },
  {
    title: "Optimization",
    description:
      "Determines the lowest-cost, most reliable combination of generation, storage, grid and Open Access at any point in time.",
    icon: SlidersHorizontal,
  },
  {
    title: "Storage Intelligence",
    description:
      "Decides when to charge and discharge storage to maximize renewable use and minimize demand charges.",
    icon: Database,
  },
  {
    title: "Procurement Intelligence",
    description:
      "Recommends when and where to procure renewable energy against forecast demand and market conditions.",
    icon: Landmark,
  },
  {
    title: "Carbon Intelligence",
    description:
      "Tracks renewable share and emissions avoided across a business's energy consumption.",
    icon: Cpu,
  },
  {
    title: "Reporting",
    description:
      "Turns operating data into the reports finance, sustainability and operations teams actually need.",
    icon: LayoutGrid,
  },
  {
    title: "APIs / Integrations",
    description:
      "Connects AINERGY OS with a business's existing ERP, BMS and utility systems.",
    icon: Cpu,
  },
];

export default function EnergyOSPage() {
  return (
    <>
      <section className="relative flex min-h-[55dvh] items-center overflow-hidden bg-paper-50 sm:min-h-[62dvh] lg:min-h-[68dvh]">
        <Image
          src="/EnergyOS.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
        <Container className="relative z-10 py-28 sm:py-32 lg:py-36">
          <SectionHeader
            eyebrow="Energy OS"
            title="The technology layer beneath every AINERGY solution."
            description="AINERGY OS is the operating system that connects generation, storage, grid and business load into one continuously optimizing platform."
            align="center"
            className="mx-auto"
          />
        </Container>
      </section>

      <section className="surface-dark relative overflow-hidden bg-ink-950 py-20">
        <div className="bg-radial-fade-dark pointer-events-none absolute inset-0" />
        <Container className="relative">
          <Reveal>
            <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-graphite-950/60 p-8 lg:p-12">
              <p className="text-center font-mono-tag text-xs uppercase text-offwhite-300/50">
                Data
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {DATA_SOURCES.map((source) => (
                  <div
                    key={source}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-center text-xs text-offwhite-300/70"
                  >
                    {source}
                  </div>
                ))}
              </div>

              {[
                "AINERGY Data Layer",
                "AI / ML Engine",
                "Optimization Engine",
                "Energy OS",
                "Business Decisions",
              ].map((stage) => (
                <div key={stage} className="mt-5 flex flex-col items-center">
                  <ArrowDown className="h-4 w-4 text-current-400/50" />
                  <div className="mt-5 w-full rounded-xl border border-current-400/25 bg-current-400/[0.06] py-3.5 text-center text-sm font-medium text-current-300">
                    {stage}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-paper-50 py-24 lg:py-32">
        <Container>
          <SectionHeader
            eyebrow="Platform Layers"
            title="Nine layers, one intelligence system."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LAYERS.map((layer, i) => (
              <Reveal key={layer.title} delay={(i % 3) * 0.08}>
                <div className="h-full rounded-2xl border border-ink-900/10 bg-paper-100/50 p-7">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-current-400/10 text-current-600">
                    <layer.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-medium text-ink-900">
                    {layer.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700/85">
                    {layer.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="See what AINERGY OS could recommend for your business."
        secondaryLabel="Open the energy planner"
        secondaryHref="/energy-optimizer"
      />
    </>
  );
}
