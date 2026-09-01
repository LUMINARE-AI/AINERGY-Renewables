import type { Metadata } from "next";
import Image from "next/image";
import { Layers, Zap, BrainCircuit, Database } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/CTASection";
import { FoundersSection } from "@/components/FoundersSection";

export const metadata: Metadata = {
  title: "About — AINERGY Renewable LLP",
  description:
    "AINERGY combines infrastructure, energy, AI and data to help businesses move from fragmented energy decisions to an intelligent energy ecosystem.",
  alternates: { canonical: "/about" },
};

const PILLARS = [
  { label: "Infrastructure", icon: Layers },
  { label: "Energy", icon: Zap },
  { label: "AI", icon: BrainCircuit },
  { label: "Data", icon: Database },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[78dvh] items-center overflow-hidden bg-paper-50 sm:min-h-[85dvh] lg:min-h-dvh">
        <Image
          src="/AboutBG.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%] sm:object-center"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper-50/60 via-paper-50/35 to-paper-50/70" />
        <Container className="relative z-10 w-full px-5 py-24 sm:px-6 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <h1 className="text-balance font-display text-[2rem] font-semibold tracking-tight text-ink-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                We are AINERGY
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-balance mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-ink-700/85 sm:mt-6 sm:text-xl sm:leading-relaxed">
                Renewable infrastructure and intelligent energy for India&apos;s{" "}
                <span className="bg-current-400/45 bg-no-repeat px-0.5 font-semibold text-ink-900 [background-position:0_88%] [background-size:100%_0.35em] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                  C&amp;I businesses
                </span>
                .
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-current-600 via-current-500 to-current-700 py-10 sm:py-12 lg:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,255,255,0.18),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(8,121,127,0.45),transparent_45%)]" />
        <Container className="relative px-5 sm:px-6">
          <Reveal>
            <div className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              <div
                aria-hidden
                className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent lg:block"
              />
              {PILLARS.map((pillar, i) => (
                <div
                  key={pillar.label}
                  className="group relative flex flex-col items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-4 text-center shadow-[0_8px_32px_rgba(8,121,127,0.25)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/35 hover:bg-white/15 hover:shadow-[0_12px_40px_rgba(8,121,127,0.35)] sm:gap-2.5 sm:px-4 sm:py-5"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-paper-50 transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11">
                    <pillar.icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                  </div>
                  <span className="font-display text-sm font-medium text-paper-50 sm:text-base">
                    {pillar.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-paper-50 pt-8 pb-16 sm:pt-10 sm:pb-24 lg:pt-12 lg:pb-32">
        <div className="bg-radial-fade pointer-events-none absolute inset-0 opacity-60" />
        <Container className="relative px-5 sm:px-6">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="font-mono-tag text-xs uppercase text-current-600">
                Leadership
              </span>
              <h2 className="text-balance mt-3 font-display text-[1.75rem] font-semibold tracking-tight text-ink-900 sm:mt-4 sm:text-4xl lg:text-[2.75rem]">
                Meet the Founders
              </h2>
            </div>
          </Reveal>

          <FoundersSection />

          <Reveal delay={0.15}>
            <div className="mx-auto mt-14 max-w-3xl border-t border-ink-900/10 pt-10 text-center sm:mt-20 sm:pt-14">
              <p className="text-balance font-display text-xl font-semibold leading-snug text-ink-900 sm:text-2xl lg:text-3xl">
                Technology that thinks.{" "}
                <span className="text-current-600">Execution that delivers.</span>
              </p>
              <p className="text-balance mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-700/85 sm:mt-5 sm:text-base lg:text-lg">
                AINERGY brings together technology-led energy intelligence and
                strong project execution to build smarter, scalable energy
                solutions for C&amp;I businesses.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <CTASection
        title="Building the future energy system, together."
      />
    </>
  );
}
