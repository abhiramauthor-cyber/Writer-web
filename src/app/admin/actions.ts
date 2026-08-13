"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { currentUser } from "@clerk/nextjs/server";

// Helper to check admin
async function requireAdmin() {
  const user = await currentUser();
  const primaryEmail = user?.primaryEmailAddress?.emailAddress;
  const adminEmail = process.env.ADMIN_EMAIL || ["abhiramssk", "gmail.com"].join("@");
  if (!user || primaryEmail?.toLowerCase() !== adminEmail) {
    throw new Error("Unauthorized");
  }
  return await createClient();
}

const SettingsSchema = z.object({
  site_name: z.string(),
  tagline: z.string().optional().nullable(),
  footer_blurb: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  og_image_url: z.string().optional().nullable(),
  newsletter_heading: z.string().optional().nullable(),
  newsletter_body: z.string().optional().nullable(),
  social_instagram_url: z.string().optional().nullable(),
  social_twitter_url: z.string().optional().nullable(),
  social_email: z.string().optional().nullable(),
  stamp_est_year: z.string().optional().nullable(),
  is_maintenance_mode: z.boolean().optional(),
});

export async function updateSiteSettings(settings: any) {
  const supabase = await requireAdmin();
  const parsed = SettingsSchema.parse(settings);
  
  const { error } = await supabase
    .from("site_settings")
    .update(parsed)
    .eq("id", 1);
    
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

const AuthorSchema = z.object({
  name: z.string(),
  avatar_url: z.string().optional().nullable(),
  bio_paragraphs: z.array(z.string()),
});

export async function updateAuthorProfile(profile: any) {
  const supabase = await requireAdmin();
  const parsed = AuthorSchema.parse(profile);
  
  const { error } = await supabase
    .from("author_profile")
    .update(parsed)
    .eq("id", 1);
    
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

const PageHeroSchema = z.object({
  slug: z.string(),
  eyebrow: z.string().optional().nullable(),
  heading: z.string().optional().nullable(),
  subheading: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  cta_primary_label: z.string().optional().nullable(),
  cta_primary_href: z.string().optional().nullable(),
  cta_secondary_label: z.string().optional().nullable(),
  cta_secondary_href: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
});

export async function updatePageHero(hero: any) {
  const supabase = await requireAdmin();
  const parsed = PageHeroSchema.parse(hero);
  
  const { error } = await supabase
    .from("page_hero")
    .update(parsed)
    .eq("slug", parsed.slug);
    
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/book");
  revalidatePath("/stories");
}

// -- List Actions (Book/About) --
const BookDetailsSchema = z.object({
  cover_image_url: z.string().optional().nullable(),
  title: z.string(),
  tagline: z.string().optional().nullable(),
  synopsis: z.string().optional().nullable(),
  author_teaser: z.string().optional().nullable(),
  sample_chapter_title: z.string().optional().nullable(),
  sample_chapter_body: z.string().optional().nullable(),
  sample_chapter_meta: z.string().optional().nullable(),
});

export async function updateBookDetails(details: any) {
  const supabase = await requireAdmin();
  const parsed = BookDetailsSchema.parse(details);
  const { error } = await supabase.from("book_details").update(parsed).eq("id", 1);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/book");
}

const ReviewSchema = z.object({
  id: z.string().optional().nullable(),
  quote: z.string(),
  name: z.string().optional().nullable(),
  context: z.string().optional().nullable(),
  sort_order: z.number().default(0),
});

const BuyLinkSchema = z.object({
  id: z.string().optional().nullable(),
  label: z.string(),
  url: z.string(),
  type: z.string().optional().nullable(),
  sort_order: z.number().default(0),
});

const JourneyItemSchema = z.object({
  id: z.string().optional().nullable(),
  year: z.string(),
  title: z.string(),
  body: z.string().optional().nullable(),
  sort_order: z.number().default(0),
});

const AchievementSchema = z.object({
  id: z.string().optional().nullable(),
  text: z.string(),
  sort_order: z.number().default(0),
});

// Generic reorder logic
export async function reorderList(table: string, items: { id: string; sort_order: number }[]) {
  const supabase = await requireAdmin();
  for (const item of items) {
    await supabase.from(table).update({ sort_order: item.sort_order }).eq("id", item.id);
  }
  revalidatePath("/");
  revalidatePath("/book");
  revalidatePath("/about");
}

export async function deleteListItem(table: string, id: string) {
  const supabase = await requireAdmin();
  await supabase.from(table).delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/book");
  revalidatePath("/about");
}

export async function saveReview(review: any) {
  const supabase = await requireAdmin();
  const parsed = ReviewSchema.parse(review);
  if (parsed.id) {
    await supabase.from("reviews").update(parsed).eq("id", parsed.id);
  } else {
    await supabase.from("reviews").insert(parsed);
  }
  revalidatePath("/book");
}

export async function saveBuyLink(buyLink: any) {
  const supabase = await requireAdmin();
  const parsed = BuyLinkSchema.parse(buyLink);
  if (parsed.id) {
    await supabase.from("buy_links").update(parsed).eq("id", parsed.id);
  } else {
    await supabase.from("buy_links").insert(parsed);
  }
  revalidatePath("/book");
}

export async function saveJourneyItem(item: any) {
  const supabase = await requireAdmin();
  const parsed = JourneyItemSchema.parse(item);
  if (parsed.id) {
    await supabase.from("journey_items").update(parsed).eq("id", parsed.id);
  } else {
    await supabase.from("journey_items").insert(parsed);
  }
  revalidatePath("/about");
}

export async function saveAchievement(achievement: any) {
  const supabase = await requireAdmin();
  const parsed = AchievementSchema.parse(achievement);
  if (parsed.id) {
    await supabase.from("achievements").update(parsed).eq("id", parsed.id);
  } else {
    await supabase.from("achievements").insert(parsed);
  }
  revalidatePath("/about");
}


// -- Comments --
export async function updateCommentStatus(id: string, status: 'approved' | 'rejected') {
  const supabase = await requireAdmin();
  
  const { error } = await supabase
    .from("comments")
    .update({ status })
    .eq("id", id);
    
  if (error) throw new Error(error.message);
  revalidatePath("/admin/comments");
  revalidatePath("/stories/[slug]", "page");
}

export async function deleteComment(id: string) {
  const supabase = await requireAdmin();
  
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", id);
    
  if (error) throw new Error(error.message);
  revalidatePath("/admin/comments");
  revalidatePath("/stories/[slug]", "page");
}

/* ─── INBOX (Contact Messages & Subscribers) ─── */

export async function markContactMessageRead(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").update({ status: 'read' }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/inbox");
}

export async function deleteContactMessage(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/inbox");
}

export async function deleteSubscriber(email: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("subscribers").delete().eq("email", email);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/inbox");
}

// -- Stories --
export async function saveStory(story: any) {
  const supabase = await requireAdmin();
  
  if (!story.id) {
    const { error } = await supabase
      .from("stories")
      .insert({
        slug: story.slug,
        title: story.title,
        excerpt: story.excerpt,
        category: story.category,
        catalog_no: parseInt(story.catalog_no),
        read_time_minutes: parseInt(story.read_time_minutes),
        body_mdx: story.body_mdx,
        is_published: story.is_published,
        published_at: story.is_published ? new Date().toISOString() : null,
      });
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("stories")
      .update({
        slug: story.slug,
        title: story.title,
        excerpt: story.excerpt,
        category: story.category,
        catalog_no: parseInt(story.catalog_no),
        read_time_minutes: parseInt(story.read_time_minutes),
        body_mdx: story.body_mdx,
        is_published: story.is_published,
      })
      .eq("id", story.id);
    if (error) throw new Error(error.message);
  }
  
  revalidatePath("/admin/stories");
  revalidatePath("/stories");
  revalidatePath(`/stories/${story.slug}`);
  revalidatePath("/");
}

export async function deleteStory(slug: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("stories").delete().eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/stories");
  revalidatePath("/stories");
  revalidatePath("/");
}
