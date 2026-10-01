import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/login",
        "/signup",
        "/dashboard",
        "/facilities",
        "/analysis",
        "/scenarios",
        "/recommendation",
        "/settings",
        "/reports/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
