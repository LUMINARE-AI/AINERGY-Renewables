import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/CTASection";
import { EpcCalculator } from "@/components/epc/EpcCalculator";

export const metadata: Metadata = {
  title: "EPC Calculator — Planning-grade solar EPC estimate",
  description:
    "Instant planning-grade BOM cost estimate for utility-scale solar EPC — modules, mounting, inverters, BOS, GST and ₹/Wp. Not a quote.",
  alternates: { canonical: "/products/epc-calculator" },
};

export default function EpcCalculatorPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-paper-50 pb-24 pt-28 lg:pb-32 lg:pt-32">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <div className="paper-grain" />
        <div
          className="pointer-events-none absolute -right-24 top-16 h-[28rem] w-[28rem] rounded-full bg-current-400/10 blur-3xl lg:right-0"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 bottom-0 h-[22rem] w-[22rem] rounded-full bg-gold-500/10 blur-3xl"
          aria-hidden
        />

        <Container className="relative z-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm text-ink-600 transition-colors hover:text-current-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Our Products
          </Link>

          <div className="mt-6 overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-premium">
            <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div className="relative px-6 py-7 sm:px-8 sm:py-8">
                <div
                  className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-current-400/15 blur-3xl"
                  aria-hidden
                />
                <p className="relative font-mono-tag text-xs uppercase text-current-600">
                  EPC Calculator
                </p>
                <h1 className="relative mt-3 max-w-lg font-display text-3xl font-medium leading-[1.15] text-ink-900 sm:text-4xl">
                  A planning budget for the plant
                </h1>
                <p className="relative mt-3 max-w-lg text-base leading-relaxed text-ink-600">
                  Modules, structure, power equipment and evacuation. The figure updates as you set capacity, technology and scope.
                </p>
              </div>
              <div className="grid grid-cols-3 border-t border-ink-900/8 bg-paper-50/80 lg:grid-cols-1 lg:border-l lg:border-t-0">
                {[
                  ["Live", "Changes as you edit"],
                  ["Ex-GST", "GST shown beside the total"],
                  ["Not a quote", "A band, not a firm price"],
                ].map(([label, detail]) => (
                  <div key={label} className="px-4 py-4 sm:px-6 sm:py-5">
                    <p className="font-display text-sm font-medium text-ink-900 sm:text-base">{label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-500 sm:text-sm">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <EpcCalculator />
          </div>
        </Container>
      </section>

      <CTASection
        title="Want this turned into a real EPC proposal?"
        primaryLabel="Get Your Energy Assessment"
        primaryHref="/energy-optimizer"
        secondaryLabel="Explore Products"
        secondaryHref="/products"
      />
    </>
  );
}
