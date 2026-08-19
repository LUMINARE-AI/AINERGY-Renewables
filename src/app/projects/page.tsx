import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectsFilter } from "@/components/ProjectsFilter";
import { PROJECTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects — Renewable Energy Portfolio",
  description:
    "AINERGY's renewable-energy project portfolio, starting with a 5 MW ground-mounted solar project and expanding across solar, wind, hybrid, storage and C&I projects.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-graphite-950 pb-16 pt-36 lg:pt-44">
        <div className="bg-radial-fade pointer-events-none absolute inset-0" />
        <Container className="relative">
          <SectionHeader
            eyebrow="Projects"
            title="AINERGY's renewable-energy project portfolio."
            description="Starting with our own generation base and expanding across solar, wind, hybrid, storage and C&I projects."
          />
        </Container>
      </section>

      <section className="bg-graphite-950 pb-24 lg:pb-32">
        <Container>
          <ProjectsFilter projects={PROJECTS} />
        </Container>
      </section>
    </>
  );
}
