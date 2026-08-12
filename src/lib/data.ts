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
