import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2, Home, Store, Warehouse } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/CTASection";
import { BusinessModelFlow } from "@/components/BusinessModelFlow";
import { ProductRow } from "@/components/products/ProductRow";
import { PRODUCTS } from "@/lib/productsContent";

export const metadata: Metadata = {
  title: "WattPe — Community energy beyond the rooftop",
  description:
    "Not everyone has a rooftop. WattPe is the digital layer that lets residents, renters and small businesses participate in AINERGY's clean-energy ecosystem.",
  alternates: { canonical: "/products/wattpe" },
};

const WITHOUT_A_ROOF = [
  { title: "Apartments", icon: Building2 },
  { title: "Rented homes", icon: Home },
  { title: "Rented shops", icon: Store },
  { title: "Buildings without suitable rooftops", icon: Warehouse },
] as const;

const IDEA = [
  "Your energy participation doesn't need to happen on your roof.",
  "AINERGY develops renewable-energy assets that serve C&I customers.",
  "WattPe creates the digital layer that enables individuals to participate in this clean-energy ecosystem.",
] as const;

export default function WattPePage() {
  const related = PRODUCTS.filter((item) => item.slug !== "wattpe");

  return (
    <>
      <section className="relative overflow-hidden bg-paper-50 pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_80%_20%,rgba(58,187,194,0.12),transparent_60%)]" />
        <Container className="relative">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm text-ink-600 transition-colors hover:text-current-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Our Products
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="font-mono-tag text-xs uppercase tracking-[0.16em] text-current-600">
              Community energy
            </p>
            <h1 className="mt-3 text-balance font-display text-4xl font-medium leading-[1.08] text-ink-900 sm:text-5xl lg:text-[3.6rem]">
              WattPe
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-700/90 sm:text-lg">
              Community energy beyond the rooftop — solar participation for
              residents, renters and small businesses.
            </p>
          </div>
        </Container>
      </section>

      <BusinessModelFlow />

      <section className="bg-paper-100/60 py-16 sm:py-20 lg:py-24">
        <Container>
          <Reveal>
            <p className="font-mono-tag text-xs uppercase tracking-[0.16em] text-current-600">
              The Problem
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-medium leading-tight text-ink-900 sm:text-4xl lg:text-[2.75rem]">
              Not everyone has a rooftop.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-700/85 sm:text-lg">
              Millions of people live in:
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {WITHOUT_A_ROOF.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <article className="flex h-full flex-col rounded-3xl border border-ink-900/10 bg-paper-50 p-5 shadow-sm transition-shadow duration-300 hover:shadow-premium sm:p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-current-400/15 text-current-600">
                    <item.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-medium leading-snug text-ink-900">
                    {item.title}
                  </h3>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12}>
            <p className="mt-8 max-w-3xl font-display text-2xl font-medium leading-snug text-ink-900 sm:mt-10 sm:text-3xl">
              But renewable energy shouldn&apos;t be limited by rooftop
              ownership.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-paper-50 py-16 sm:py-20 lg:py-24">
        <Container>
          <Reveal>
            <h2 className="max-w-3xl font-display text-3xl font-medium leading-tight text-ink-900 sm:text-4xl lg:text-[2.75rem]">
              The WattPe Idea
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-5">
            {IDEA.map((step, i) => (
              <Reveal key={step} delay={i * 0.06}>
                <article className="flex h-full flex-col rounded-3xl border border-ink-900/10 bg-white/80 p-5 shadow-sm sm:p-6">
                  <span className="font-mono-tag text-xs text-current-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-4 font-display text-lg font-medium leading-snug text-ink-900 sm:text-xl">
                    {step}
                  </p>
                  </article>
                </Reveal>
              ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper-50 pb-16 sm:pb-20">
        <Container>
          <h2 className="font-display text-xl font-medium text-ink-900 sm:text-2xl">
            More products
          </h2>
          <div className="mt-8 space-y-4">
            {related.map((item) => (
              <ProductRow key={item.slug} product={item} />
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Renewable energy shouldn't stop at rooftop ownership."
        primaryLabel="Talk to AINERGY"
        primaryHref="/contact"
        secondaryLabel="All products"
        secondaryHref="/products"
      />
    </>
  );
}
