import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Zap, Calendar, Layers } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { CTASection } from "@/components/CTASection";
import { PROJECTS } from "@/lib/data";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — ${project.capacity}`,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const specs = [
    { label: "Capacity", value: project.capacity, icon: Zap },
    { label: "Location", value: project.location, icon: MapPin },
    { label: "Technology", value: project.technology, icon: Layers },
    {
      label: "Expected generation",
      value: project.expectedGeneration,
      icon: Zap,
    },
    { label: "Commercial operation date", value: project.cod, icon: Calendar },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-paper-50 pb-16 pt-36 lg:pt-44">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-ink-600 transition-colors hover:text-current-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Badge>{project.category}</Badge>
            <Badge>{project.status}</Badge>
          </div>
          <h1 className="text-balance mt-5 font-display text-3xl font-medium leading-tight text-ink-900 sm:text-4xl lg:text-5xl">
            {project.name}
          </h1>
          <p className="text-balance mt-5 max-w-2xl text-lg leading-relaxed text-ink-700/90">
            {project.description}
          </p>
          {project.isPlaceholder && (
            <p className="mt-4 text-xs uppercase tracking-wide text-current-600">
              Project figures shown below are placeholders pending official
              confirmation.
            </p>
          )}
        </Container>
      </section>

      <section className="bg-paper-50 pb-6">
        <Container>
          <div className="relative h-72 overflow-hidden rounded-3xl border border-ink-900/10 shadow-premium-lg sm:h-96">
            <svg
              viewBox="0 0 800 320"
              className="h-full w-full"
              preserveAspectRatio="xMidYMid slice"
            >
              <rect width="800" height="320" fill="#04140e" />
              {Array.from({ length: 14 }).map((_, row) =>
                Array.from({ length: 8 }).map((__, col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={20 + col * 96 - row * 6}
                    y={200 - row * 8}
                    width="70"
                    height="24"
                    rx="2"
                    fill="#0a2e22"
                    stroke="#2c9468"
                    strokeOpacity="0.55"
                    strokeWidth="1"
                    transform="skewX(-16)"
                  />
                ))
              )}
            </svg>
          </div>
        </Container>
      </section>

      <section className="bg-paper-50 py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="rounded-2xl border border-ink-900/10 bg-paper-100/50 p-6"
              >
                <spec.icon className="h-4 w-4 text-current-600" />
                <p className="mt-4 text-xs text-ink-500">
                  {spec.label}
                </p>
                <p className="mt-1.5 font-display text-base font-medium text-ink-900">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Want to co-develop or partner on a project?"
        description="AINERGY works with landowners, EPC partners and financiers to expand its renewable-energy portfolio."
        primaryLabel="Get In Touch"
      />
    </>
  );
}
