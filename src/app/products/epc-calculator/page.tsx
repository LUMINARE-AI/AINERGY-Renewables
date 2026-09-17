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
          <h1 className="mt-6 max-w-3xl text-balance font-display text-3xl font-medium leading-[1.15] text-ink-900 sm:text-4xl lg:text-[2.75rem]">
            EPC Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-700/85">
            Planning-grade estimate for utility-scale solar EPC — not a quote.
          </p>
          <div className="mt-10">
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
