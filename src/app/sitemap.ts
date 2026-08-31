import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";
import { ALL_SOLUTIONS, SERVICES } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/solutions",
    "/services",
    "/energy-optimizer",
    "/products",
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

  const solutionRoutes = [...ALL_SOLUTIONS, ...SERVICES].map((s) => ({
    url: `${SITE_URL}/solutions/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...solutionRoutes];
}
