import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { InsightCard } from "@/components/InsightCard";
import { Reveal } from "@/components/shared/Reveal";
import { INSIGHTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Insights — Renewable Energy & C&I Energy Guides",
  description:
    "Guides and explainers on Open Access, battery storage economics, AI in energy, C&I energy economics, the energy transition and regulatory basics.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <>
      <section className="relative flex min-h-[55dvh] items-center overflow-hidden bg-paper-50 sm:min-h-[62dvh] lg:min-h-[68dvh]">
        <Image
          src="/insights.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
        <Container className="relative z-10 py-28 sm:py-32 lg:py-36">
          <SectionHeader
            eyebrow="Insights"
            title="Understand the energy transition, not just buy into it."
            description="Guides and explainers on renewable procurement, storage economics, AI in energy and the regulations that shape C&I energy decisions in India."
            align="center"
            className="mx-auto [&_h2]:drop-shadow-[0_1px_12px_rgba(247,248,246,0.95)] [&_p]:drop-shadow-[0_1px_10px_rgba(247,248,246,0.9)] [&_span]:drop-shadow-[0_1px_8px_rgba(247,248,246,0.9)]"
          />
        </Container>
      </section>

      <section className="surface-dark relative overflow-hidden bg-ink-950 pb-24 pt-16 lg:pb-32">
        <div className="bg-radial-fade-dark pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INSIGHTS.map((insight, i) => (
              <Reveal key={insight.slug} delay={(i % 3) * 0.06}>
                <InsightCard insight={insight} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
