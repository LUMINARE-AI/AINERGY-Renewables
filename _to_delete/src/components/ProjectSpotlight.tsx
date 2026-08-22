import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";
import { PROJECTS } from "@/lib/data";

export function ProjectSpotlight() {
  return (
    <section className="bg-paper-100/50 py-24 lg:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Projects"
            title="Building our own generation base, first."
            description="AINERGY is developing its own renewable-energy projects as the foundation for the broader C&I platform."
          />
          <Button href="/projects" variant="secondary" icon className="shrink-0">
            View all projects
          </Button>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
          <Reveal delay={PROJECTS.length * 0.08}>
            <div className="flex h-full min-h-[280px] flex-col items-start justify-center rounded-3xl border border-dashed border-ink-900/15 p-7">
              <p className="font-display text-lg font-medium text-ink-900">
                More projects in development
              </p>
              <p className="mt-2 text-sm text-ink-500">
                Solar, wind, hybrid and storage projects will be added here as
                they reach development milestones.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
