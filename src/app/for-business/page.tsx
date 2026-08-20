import type { Metadata } from "next";
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
import { SectionHeader } from "@/components/ui/SectionHeader";
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
      <section className="relative overflow-hidden bg-paper-50 pb-16 pt-36 lg:pt-44">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative">
          <SectionHeader
            eyebrow="For Business"
            title="Your energy. One intelligent platform."
            description="From first assessment to long-term operation, AINERGY manages the full lifecycle of a business's energy system so your team doesn't have to coordinate it across a dozen vendors."
          />
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
