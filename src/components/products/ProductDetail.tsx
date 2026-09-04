import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/CTASection";
import { ProductRow } from "@/components/products/ProductRow";
import { ProductFaq } from "@/components/products/ProductFaq";
import { CopilotMockDashboard } from "@/components/products/CopilotMockDashboard";
import { PRODUCTS, type Product } from "@/lib/productsContent";

function Media({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <span className="font-mono-tag text-xs uppercase text-current-600">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-ink-900 sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {lead && (
        <p className="mt-4 text-base leading-relaxed text-ink-700/85 sm:text-lg">
          {lead}
        </p>
      )}
    </div>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const related = PRODUCTS.filter((item) => item.slug !== product.slug);

  return (
    <>
      <section className="relative bg-paper-50 pb-14 pt-32 sm:pb-16 sm:pt-36 lg:pt-40">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm text-ink-600 transition-colors hover:text-current-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Our Products
          </Link>

          <div className="mt-8 max-w-3xl">
            <h1 className="text-balance font-display text-4xl font-medium leading-[1.1] text-ink-900 sm:text-5xl lg:text-[3.4rem]">
              {product.name}
            </h1>
            <p className="mt-4 font-display text-xl font-medium leading-snug text-current-600 sm:text-2xl">
              {product.tagline}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-700/90 sm:text-lg">
              {product.description}
            </p>
            <div className="mt-8">
              <Button
                href={product.ctaHref}
                size="lg"
                icon
                external={product.ctaExternal}
              >
                {product.ctaLabel}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper-100/60 py-16 sm:py-20 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Challenges it solves"
              title={`Challenges ${product.name} solves`}
              lead={product.challengesLead}
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {product.challenges.map((challenge, i) => (
              <Reveal key={challenge.title} delay={(i % 3) * 0.06}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-900/10 bg-paper-50 shadow-sm transition-shadow duration-300 hover:shadow-premium">
                  <div className="relative aspect-[16/9] overflow-hidden bg-paper-200">
                    <Image
                      src={challenge.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <span className="font-mono-tag text-xs text-current-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-medium text-ink-900">
                      {challenge.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-700/85">
                      {challenge.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-paper-50 py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <SectionHeading title={product.howTitle} lead={product.howLead} />
              <ol className="mt-8 space-y-5">
                {product.how.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="font-mono-tag mt-0.5 shrink-0 text-xs text-current-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-medium text-ink-900">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-700/80">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={0.1}>
              {product.slug === "copilot" ? (
                <CopilotMockDashboard />
              ) : (
                <Media
                  src={product.heroImages[0]}
                  alt=""
                  className="aspect-[4/3] rounded-3xl border border-ink-900/8 shadow-premium"
                />
              )}
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-paper-50 py-16 sm:py-20 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="FAQ"
              title="Frequently asked questions"
            />
          </Reveal>
          <ProductFaq items={product.faq} />
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
        title={
          product.slug === "copilot"
            ? "Ready to turn a bill into an energy plan?"
            : "Ready to participate in solar without a roof?"
        }
        primaryLabel={product.ctaLabel}
        primaryHref={product.ctaHref}
        secondaryLabel="All products"
        secondaryHref="/products"
      />
    </>
  );
}
