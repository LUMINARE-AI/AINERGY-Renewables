import type { Metadata } from "next";
import { Layers, Zap, BrainCircuit, Database } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/CTASection";

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
      <section className="relative overflow-hidden bg-paper-50 pb-16 pt-36 lg:pt-44">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative">
          <SectionHeader
            eyebrow="About AINERGY"
            title="We believe businesses should have simpler, smarter and cleaner energy."
            description="AINERGY Renewable LLP develops and operates renewable-energy infrastructure and intelligent energy solutions for Commercial & Industrial businesses in India."
          />
        </Container>
      </section>

      <section className="bg-paper-100/50 py-20">
        <Container>
          <Reveal>
            <div className="grid gap-5 sm:grid-cols-4">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.label}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-ink-900/10 bg-paper-50 p-8 text-center shadow-premium"
                >
                  <pillar.icon className="h-6 w-6 text-current-600" />
                  <span className="font-display text-base font-medium text-ink-900">
                    {pillar.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
          <p className="mx-auto mt-8 max-w-2xl text-center text-ink-700/90">
            We combine these four elements to help businesses transition from
            fragmented energy decisions to a single, intelligent energy
            ecosystem.
          </p>
        </Container>
      </section>

      <section className="bg-paper-50 py-24 lg:py-32">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-3xl border border-ink-900/10 bg-paper-100/50 p-8 lg:p-10">
                <span className="font-mono-tag text-xs uppercase text-current-600">
                  Vision
                </span>
                <p className="text-balance mt-4 font-display text-2xl font-medium leading-snug text-ink-900">
                  To become India&apos;s most intelligent energy platform for
                  businesses.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-ink-900/10 bg-paper-100/50 p-8 lg:p-10">
                <span className="font-mono-tag text-xs uppercase text-current-600">
                  Mission
                </span>
                <p className="text-balance mt-4 font-display text-2xl font-medium leading-snug text-ink-900">
                  Make clean energy simpler, more accessible and more
                  intelligent for C&amp;I businesses.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="mt-14 max-w-3xl">
            <p className="text-lg leading-relaxed text-ink-700/90">
              AINERGY is starting with its own renewable-energy projects and
              will progressively evolve into an integrated C&amp;I energy
              platform — spanning solar, wind, hybrid generation, storage,
              Open Access, Energy-as-a-Service and AI-powered energy
              intelligence. The long-term direction is a single, intelligent
              operating system for a company&apos;s entire energy ecosystem.
            </p>
          </Reveal>
        </Container>
      </section>

      <CTASection
        title="Building the future energy system, together."
        description="Whether you're a business, a partner or an investor — we'd like to hear from you."
      />
    </>
  );
}
