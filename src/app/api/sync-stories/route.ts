import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAllStories } from "@/lib/data";

export async function GET() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY in .env.local" }, { status: 500 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const stories = getAllStories();

  const results = [];

  for (const story of stories) {
    // Read the MDX content directly using fs (we already have a utility for this)
    const { getStoryBySlug } = await import("@/lib/data");
    const storyData = getStoryBySlug(story.slug);

    if (!storyData) continue;

    const { error } = await supabase.from("stories").upsert(
      {
        slug: story.slug,
        catalog_no: parseInt(story.no),
        title: story.title,
        excerpt: story.excerpt,
        body_mdx: storyData.content,
        category: story.category,
        series: null,
        read_time_minutes: parseInt(story.readTime),
        published_at: new Date((story as any).publishDate || Date.now()).toISOString(),
      },
      { onConflict: "slug" }
    );

    if (error) {
      results.push({ slug: story.slug, error: error.message });
    } else {
      results.push({ slug: story.slug, status: "success" });
    }
  }

  return NextResponse.json({ results });
}
