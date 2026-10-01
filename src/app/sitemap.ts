import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";
import { ALL_SOLUTIONS, SERVICES } from "@/lib/data";
import { PRODUCTS } from "@/lib/productsContent";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

function entry(
  path: string,
  priority: number,
  changeFrequency: ChangeFrequency
): MetadataRoute.Sitemap[number] {
  return {
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

/** Public, canonical pages only. Auth, app, reports, and redirects stay out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    entry("/", 1, "weekly"),
    entry("/solutions", 0.9, "weekly"),
    entry("/services", 0.9, "weekly"),
    entry("/products", 0.9, "weekly"),
    entry("/energy-optimizer", 0.8, "weekly"),
    entry("/about", 0.6, "monthly"),
    entry("/contact", 0.6, "monthly"),
    entry("/privacy", 0.3, "yearly"),
    entry("/terms", 0.3, "yearly"),
    entry("/disclaimer", 0.3, "yearly"),
  ];

  for (const item of [...ALL_SOLUTIONS, ...SERVICES]) {
    pages.push(entry(`/solutions/${item.slug}`, 0.7, "monthly"));
  }

  for (const product of PRODUCTS) {
    if (product.ctaExternal) continue;
    pages.push(entry(`/products/${product.slug}`, 0.75, "monthly"));
  }

  return pages;
}
