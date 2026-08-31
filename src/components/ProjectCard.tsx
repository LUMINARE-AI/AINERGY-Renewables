import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Project } from "@/lib/data";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block overflow-hidden rounded-3xl border border-ink-900/10 bg-paper-50 transition-all duration-300 hover:-translate-y-1 hover:border-current-500/30 hover:shadow-premium"
    >
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-forest-800 via-forest-900 to-graphite-950">
        <svg
          viewBox="0 0 400 224"
          className="h-full w-full opacity-90 transition-transform duration-700 group-hover:scale-105"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id={`pc-${project.slug}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#155a40" />
              <stop offset="100%" stopColor="#04140e" />
            </linearGradient>
          </defs>
          <rect width="400" height="224" fill={`url(#pc-${project.slug})`} />
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 6 }).map((__, col) => (
              <rect
                key={`${row}-${col}`}
                x={20 + col * 62}
                y={130 - row * 4 + (col % 2) * 6}
                width="46"
                height="16"
                rx="1.5"
                fill="#0a2e22"
                stroke="#2c9468"
                strokeOpacity="0.5"
                strokeWidth="0.75"
                transform={`skewX(-14) translate(${row * 8}, 0)`}
              />
            ))
          )}
        </svg>
        <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-graphite-950/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-offwhite-100 backdrop-blur">
          {project.status}
        </div>
        <ArrowUpRight className="absolute bottom-4 right-4 h-5 w-5 text-offwhite-100/80 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
      </div>

      <div className="p-7">
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <MapPin className="h-3.5 w-3.5" />
          {project.location}
        </div>
        <h3 className="mt-2 font-display text-xl font-medium text-ink-900">
          {project.name}
        </h3>
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-ink-900/10 pt-5 text-sm">
          <div>
            <p className="text-ink-500">Capacity</p>
            <p className="mt-1 font-medium text-ink-900">{project.capacity}</p>
          </div>
          <div>
            <p className="text-ink-500">Category</p>
            <p className="mt-1 font-medium text-ink-900">{project.category}</p>
          </div>
        </div>
        {project.isPlaceholder && (
          <p className="mt-4 text-[11px] uppercase tracking-wide text-current-600/80">
            Figures shown are placeholders pending confirmation
          </p>
        )}
      </div>
    </Link>
  );
}
