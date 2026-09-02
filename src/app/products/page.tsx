import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTASection } from "@/components/CTASection";
import { ProductsNav } from "@/components/products/ProductsNav";
import { CopilotProductSection } from "@/components/products/CopilotProductSection";
import { WattPeSection } from "@/components/products/WattPeSection";
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
      <section className="relative flex min-h-[48dvh] items-center overflow-hidden bg-paper-50 sm:min-h-[54dvh] lg:min-h-[58dvh]">
        <Image
          src="/insights.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top lg:object-[50%_18%]"
          aria-hidden
        />
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative z-10 py-24 sm:py-28 lg:py-32">
          <SectionHeader
            title="Digital Products That Make Energy Decisions Simpler"
            description="AINERGY's Products layer contains proprietary digital experiences that connect customers to the Energy OS."
          />
        </Container>
      </section>

      <ProductsNav />
      <CopilotProductSection />
      <WattPeSection />

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
