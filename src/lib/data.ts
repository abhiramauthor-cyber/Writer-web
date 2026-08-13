import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "./supabase/admin";
import type { StoryData } from "@/components/StoryCard";

export async function getAllStories(includeDrafts = false): Promise<StoryData[]> {
  let query = supabaseAdmin
    .from("stories")
    .select("*, likes(count)")
    .order("catalog_no", { ascending: false });

  if (!includeDrafts) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data.map((story) => {
    const likeCountObj = Array.isArray(story.likes) ? story.likes[0] : story.likes;
    return {
      storyId: story.id,
      no: String(story.catalog_no).padStart(3, '0'),
      slug: story.slug,
      title: story.title,
      excerpt: story.excerpt || "",
      category: story.category,
      thread: "indigo",
      readTime: `${story.read_time_minutes || 5} min`,
      publishDate: story.published_at,
      initialLikeCount: (likeCountObj as any)?.count || 0,
    };
  });
}

export async function getStoryBySlug(slug: string, includeDrafts = false) {
  let query = supabaseAdmin
    .from("stories")
    .select("*")
    .eq("slug", slug)
    .single();

  const { data, error } = await query;

  if (error || !data) {
    return null;
  }

  // If we shouldn't include drafts and it's not published, return null
  if (!includeDrafts && !data.is_published) {
    return null;
  }

  return {
    frontmatter: {
      no: String(data.catalog_no).padStart(3, '0'),
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt || "",
      category: data.category,
      thread: "indigo",
      readTime: `${data.read_time_minutes || 5} min`,
      publishDate: data.published_at,
    } as StoryData,
    content: data.body_mdx,
  };
}

export async function getPageContent(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("page_content")
    .select("content")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }
  return data.content;
}

/* ─── Cached Getters for High-Speed Performance (ISR/revalidate) ─── */

export const getSiteSettingsCached = unstable_cache(
  async () => {
    const { data } = await supabaseAdmin.from("site_settings").select("*").eq("id", 1).single();
    return data;
  },
  ["site-settings"],
  { revalidate: 3600, tags: ["site-settings"] }
);

export const getPageHeroCached = unstable_cache(
  async (slug: string) => {
    const { data } = await supabaseAdmin.from("page_hero").select("*").eq("slug", slug).single();
    return data;
  },
  ["page-hero"],
  { revalidate: 3600, tags: ["page-hero"] }
);

export const getBookDetailsCached = unstable_cache(
  async () => {
    const { data } = await supabaseAdmin.from("book_details").select("*").eq("id", 1).single();
    return data;
  },
  ["book-details"],
  { revalidate: 3600, tags: ["book-details"] }
);

export const getAuthorProfileCached = unstable_cache(
  async () => {
    const { data } = await supabaseAdmin.from("author_profile").select("*").eq("id", 1).single();
    return data;
  },
  ["author-profile"],
  { revalidate: 3600, tags: ["author-profile"] }
);

export const getJourneyItemsCached = unstable_cache(
  async () => {
    const { data } = await supabaseAdmin.from("journey_items").select("*").order("sort_order", { ascending: true });
    return data || [];
  },
  ["journey-items"],
  { revalidate: 3600, tags: ["journey-items"] }
);

export const getAchievementsCached = unstable_cache(
  async () => {
    const { data } = await supabaseAdmin.from("achievements").select("*").order("sort_order", { ascending: true });
    return data || [];
  },
  ["achievements"],
  { revalidate: 3600, tags: ["achievements"] }
);

export const getReviewsCached = unstable_cache(
  async () => {
    const { data } = await supabaseAdmin.from("reviews").select("*").order("sort_order", { ascending: true });
    return data || [];
  },
  ["reviews"],
  { revalidate: 3600, tags: ["reviews"] }
);

export const getBuyLinksCached = unstable_cache(
  async () => {
    const { data } = await supabaseAdmin.from("buy_links").select("*").order("sort_order", { ascending: true });
    return data || [];
  },
  ["buy-links"],
  { revalidate: 3600, tags: ["buy-links"] }
);

export const getAllStoriesCached = unstable_cache(
  async () => {
    return getAllStories(false);
  },
  ["all-stories"],
  { revalidate: 3600, tags: ["stories"] }
);

export const getStoryBySlugCached = unstable_cache(
  async (slug: string) => {
    return getStoryBySlug(slug, false);
  },
  ["story-by-slug"],
  { revalidate: 3600, tags: ["stories"] }
);

