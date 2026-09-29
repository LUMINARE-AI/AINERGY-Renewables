import type { Metadata } from "next";
import { Building2, Home, Store, Warehouse } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { StepIndex } from "@/components/ui/StepIndex";
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
      <BusinessModelFlow />

      <section className="bg-paper-100/60 py-8 sm:py-10 lg:py-12">
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

      <section className="bg-paper-50 pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24">
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
                  <StepIndex n={i + 1} />
                  <p className="mt-4 font-display text-lg font-medium leading-snug text-ink-900 sm:text-xl">
                    {step}
                  </p>
                  </article>
                </Reveal>
              ))}
          </div>

          <Reveal delay={0.12}>
            <div className="relative mt-10 overflow-hidden rounded-3xl bg-current-500 px-6 py-8 shadow-glow sm:mt-12 sm:px-10 sm:py-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
              />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
                <div className="max-w-xl">
                  <p className="font-mono-tag text-[11px] uppercase tracking-[0.16em] text-paper-50/80">
                    Community solar
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-medium leading-snug text-paper-50 sm:text-3xl">
                    Join community solar.
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-paper-50/90 sm:text-lg">
                    Participate in a shared solar plant without hosting it yourself.
                    Reserve your share on WattPe and earn credits as that clean
                    energy is used.
                  </p>
                </div>
                <Button
                  href="https://watt-pe.vercel.app/"
                  external
                  icon
                  className="shrink-0 self-start !bg-paper-50 !text-current-700 !shadow-none hover:!bg-white hover:!text-current-700 sm:mr-12 sm:self-center"
                >
                  Visit WattPe
                </Button>
              </div>
            </div>
          </Reveal>
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
