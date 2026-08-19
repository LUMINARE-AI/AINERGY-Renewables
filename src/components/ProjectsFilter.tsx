"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/shared/Reveal";
import type { Project } from "@/lib/data";

const FILTERS: Array<Project["category"] | "All" | "Development"> = [
  "All",
  "Solar",
  "Wind",
  "Hybrid",
  "Storage",
  "C&I",
  "Development",
];

export function ProjectsFilter({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered = projects.filter((p) => {
    if (filter === "All") return true;
    if (filter === "Development") return p.status === "In Development";
    return p.category === filter;
  });

  return (
    <>
      <div className="flex flex-wrap gap-2.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              filter === f
                ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-200"
                : "border-white/15 text-offwhite-300/70 hover:border-white/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-14">
        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.08}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 p-16 text-center">
            <p className="font-display text-lg text-offwhite-100">
              No projects in this category yet
            </p>
            <p className="mt-2 text-sm text-offwhite-300/55">
              AINERGY&apos;s portfolio is growing — check back as new projects
              reach development milestones.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
