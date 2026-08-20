import type { MetadataRoute } from "next";
import { getAllStories } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://writerlokam.in";

  // Static routes
  const routes = ["", "/about", "/book", "/stories"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic story routes
  const allStories = await getAllStories();
  const stories = allStories.map((story) => ({
    url: `${baseUrl}/stories/${story.slug}`,
    lastModified: new Date((story as any).publishDate || Date.now()),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...routes, ...stories];
}
