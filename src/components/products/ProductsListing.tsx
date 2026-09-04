import Image from "next/image";
import { PRODUCTS } from "@/lib/productsContent";
import { ProductRow } from "@/components/products/ProductRow";
import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";

export function ProductsListing() {
  return (
    <section className="relative overflow-hidden bg-paper-50 pt-16 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
      <Image
        src="/HomeBG.avif"
        alt=""
        fill
        sizes="100vw"
        className="scale-125 object-cover object-center blur-2xl"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-paper-50/70" />
      <div className="bg-radial-fade pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-current-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl"
      />

      <Container className="relative z-10">
        <Reveal>
          <h2 className="max-w-3xl font-display text-3xl font-medium leading-tight text-ink-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            Digital Products{" "}
            <span className="mt-1 block font-accent text-[1.08em] font-normal not-italic text-current-600">
              for Energy Decisions
            </span>
          </h2>
        </Reveal>

        <div className="mt-10 space-y-3 sm:mt-14 sm:space-y-4 lg:mt-16 lg:space-y-5">
          {PRODUCTS.map((product, i) => (
            <Reveal key={product.slug} delay={i * 0.08}>
              <ProductRow product={product} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
