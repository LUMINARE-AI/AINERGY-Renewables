import type { Metadata } from "next";
import Image from "next/image";
import {
  FileSearch,
  PenTool,
  Calculator,
  HardHat,
  ShoppingCart,
  Activity,
  SlidersHorizontal,
  FileBarChart,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/CTASection";
import { Industries } from "@/components/Industries";

export const metadata: Metadata = {
  title: "For Business — C&I Energy Platform",
  description:
    "Energy assessment, solution design, financial modelling, project development, procurement, operations, optimization and sustainability reporting — on one platform.",
  alternates: { canonical: "/for-business" },
};

const CAPABILITIES = [
  { title: "Energy Assessment", description: "Understand your current load, tariffs and renewable potential.", icon: FileSearch },
  { title: "Solution Design", description: "An energy mix designed around your business, not a generic package.", icon: PenTool },
  { title: "Financial Modelling", description: "Clear economics across commercial structures before you commit.", icon: Calculator },
  { title: "Project Development", description: "AINERGY develops or partners to build the required infrastructure.", icon: HardHat },
  { title: "Energy Procurement", description: "Structured, ongoing procurement of renewable power.", icon: ShoppingCart },
  { title: "Operations", description: "Monitoring and management across the asset's operating life.", icon: Activity },
  { title: "Optimization", description: "Continuous improvement of energy economics via AINERGY OS.", icon: SlidersHorizontal },
  { title: "Sustainability Reporting", description: "Renewable share and emissions data, ready for stakeholders.", icon: FileBarChart },
];

export default function ForBusinessPage() {
  return (
    <>
      <section className="relative flex min-h-[70dvh] items-center overflow-hidden bg-ink-900 sm:min-h-[78dvh] lg:min-h-[85dvh]">
        <Image
          src="/ForBusinessBG.avif"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
        {/* Light vignette for text contrast — photo stays sharp */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,13,12,0.18)_0%,rgba(10,13,12,0.45)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/50 to-transparent" />

        <Container className="relative z-10 w-full py-28 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="font-mono-tag text-xs uppercase text-current-300">
                For Business
              </span>
              <h1 className="text-balance mt-4 font-display text-[1.85rem] font-semibold tracking-tight text-offwhite-100 sm:text-4xl lg:text-[2.85rem] lg:leading-[1.1]">
                Your energy. One intelligent platform.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-balance mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-offwhite-100/85 sm:text-lg">
                From first assessment to long-term operation, AINERGY manages
                the full lifecycle of a business&apos;s energy system so your
                team doesn&apos;t have to coordinate it across a dozen vendors.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-paper-50 pb-24 lg:pb-32">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((cap, i) => (
              <Reveal key={cap.title} delay={(i % 4) * 0.06}>
                <div className="h-full rounded-2xl border border-ink-900/10 bg-paper-100/50 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-current-400/10 text-current-600">
                    <cap.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-base font-medium text-ink-900">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700/85">
                    {cap.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <Industries />

      <CTASection
        title="Start with an energy assessment."
        description="Share your electricity bills and load data — AINERGY will map out what your energy system could look like."
        primaryLabel="Get Your Energy Assessment"
      />
    </>
  );
}
