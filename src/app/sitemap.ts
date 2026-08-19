import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";
import { ALL_SOLUTIONS, PROJECTS, INSIGHTS } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/solutions",
    "/energy-os",
    "/energy-optimizer",
    "/projects",
    "/for-business",
    "/insights",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const solutionRoutes = ALL_SOLUTIONS.map((s) => ({
    url: `${SITE_URL}/solutions/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const projectRoutes = PROJECTS.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const insightRoutes = INSIGHTS.map((i) => ({
    url: `${SITE_URL}/insights/${i.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...solutionRoutes, ...projectRoutes, ...insightRoutes];
}
