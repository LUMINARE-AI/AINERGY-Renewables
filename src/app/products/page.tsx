import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { CTASection } from "@/components/CTASection";
import { ProductsListing } from "@/components/products/ProductsListing";
import { WATTPE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Products — AI Energy Copilot & WattPe",
  description:
    "AINERGY's digital products: AI Energy Copilot for C&I bill analysis and energy strategy, and WattPe for community solar participation.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <section className="relative flex min-h-[55dvh] items-center overflow-hidden bg-paper-50 sm:min-h-[62dvh] lg:min-h-[68dvh]">
        <Image
          src="/products.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative z-10 py-28 sm:py-32 lg:py-36">
          <div className="max-w-3xl">
            <h1 className="text-balance font-display text-3xl font-medium leading-[1.15] text-ink-900 sm:text-4xl lg:text-[2.75rem]">
              Explore Our Products
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-700/85">
              Two digital products that connect customers to the Energy OS —
              bill-to-strategy intelligence for C&amp;I, and community solar
              for everyone else.
            </p>
          </div>
        </Container>
      </section>

      <ProductsListing />

      <CTASection
        title="Make Your Next Energy Decision Simpler."
        primaryLabel="Upload My Bill"
        primaryHref="/energy-optimizer"
        secondaryLabel="Visit WattPe →"
        secondaryHref={WATTPE_URL}
      />
    </>
  );
}
