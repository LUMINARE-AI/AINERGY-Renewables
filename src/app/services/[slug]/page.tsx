import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import * as Icons from "lucide-react";
import { Check, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/shared/Reveal";
import { CTASection } from "@/components/CTASection";
import { ServiceCard } from "@/components/ServiceCard";
import { Badge } from "@/components/ui/Badge";
import { SERVICES } from "@/lib/data";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.name} — Services`,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[
    service.icon
  ];
  const related = SERVICES.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-paper-50 pb-16 pt-36 lg:pt-44">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm text-ink-600 transition-colors hover:text-current-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All services
          </Link>

          <div className="mt-8 flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-current-400/10 text-current-600">
              {Icon && <Icon className="h-7 w-7" />}
            </div>
            <div>
              <Badge>Service</Badge>
              <h1 className="mt-4 text-balance font-display text-3xl font-medium leading-tight text-ink-900 sm:text-4xl lg:text-5xl">
                {service.name}
              </h1>
              <p className="text-balance mt-5 max-w-2xl text-lg leading-relaxed text-ink-700/90">
                {service.description}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper-100/50 py-20">
        <Container>
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {service.points.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-2xl border border-ink-900/10 bg-paper-50 p-6"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" />
                  <p className="text-sm leading-relaxed text-ink-700">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="surface-dark relative overflow-hidden bg-ink-950 py-24 lg:py-32">
        <div className="bg-radial-fade-dark pointer-events-none absolute inset-0" />
        <Container className="relative">
          <h2 className="font-display text-2xl font-medium text-offwhite-100">
            Related services
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {related.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.06}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title={`Ready to talk through ${service.name.toLowerCase()}?`}
        description="Share your requirements and AINERGY will scope how this fits your project."
      />
    </>
  );
}
