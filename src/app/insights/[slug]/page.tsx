import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { InsightCard } from "@/components/InsightCard";
import { CTASection } from "@/components/CTASection";
import { INSIGHTS } from "@/lib/data";

export function generateStaticParams() {
  return INSIGHTS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = INSIGHTS.find((i) => i.slug === slug);
  if (!insight) return {};
  return {
    title: insight.title,
    description: insight.excerpt,
    alternates: { canonical: `/insights/${insight.slug}` },
  };
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = INSIGHTS.find((i) => i.slug === slug);
  if (!insight) notFound();

  const related = INSIGHTS.filter((i) => i.slug !== slug).slice(0, 3);

  return (
    <>
      <article>
        <section className="relative overflow-hidden bg-paper-50 pb-16 pt-36 lg:pt-44">
          <div className="bg-radial-fade pointer-events-none absolute inset-0" />
          <Container className="relative max-w-3xl">
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 text-sm text-ink-600 transition-colors hover:text-current-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All insights
            </Link>
            <div className="mt-8 flex items-center gap-3">
              <Badge>{insight.category}</Badge>
              <span className="text-xs text-ink-500">
                {insight.readTime}
              </span>
            </div>
            <h1 className="text-balance mt-5 font-display text-3xl font-medium leading-tight text-ink-900 sm:text-4xl">
              {insight.title}
            </h1>
          </Container>
        </section>

        <section className="bg-paper-50 pb-24">
          <Container className="max-w-3xl">
            <div className="space-y-6 border-t border-ink-900/10 pt-10">
              {insight.body.map((para, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed text-ink-700"
                >
                  {para}
                </p>
              ))}
            </div>
          </Container>
        </section>
      </article>

      <section className="surface-dark relative overflow-hidden bg-ink-950 py-24 lg:py-32">
        <div className="bg-radial-fade-dark pointer-events-none absolute inset-0" />
        <Container className="relative">
          <h2 className="font-display text-2xl font-medium text-offwhite-100">
            Related reading
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {related.map((i) => (
              <InsightCard key={i.slug} insight={i} />
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Ready to move from reading to planning?"
      />
    </>
  );
}
