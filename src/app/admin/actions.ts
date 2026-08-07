"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Helper to check admin
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== 'abhiramssk@gmail.com') {
    throw new Error("Unauthorized");
  }
  return supabase;
}

const SocialLinksSchema = z.object({
  instagram: z.object({ url: z.string().url().optional().or(z.literal("")), handle: z.string().optional().or(z.literal("")) }).optional(),
  twitter: z.object({ url: z.string().url().optional().or(z.literal("")), handle: z.string().optional().or(z.literal("")) }).optional(),
  email: z.string().email().optional().or(z.literal("")),
});

// -- Site Settings --
export async function updateSiteSettings(isMaintenanceMode: boolean) {
  const supabase = await requireAdmin();
  
  const { error } = await supabase
    .from("site_settings")
    .update({ is_maintenance_mode: isMaintenanceMode, updated_at: new Date().toISOString() })
    .eq("id", 1);
    
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function updateSocialLinks(links: any) {
  const supabase = await requireAdmin();
  
  const parsed = SocialLinksSchema.parse(links);
  
  const { error } = await supabase
    .from("site_settings")
    .update({ social_links: parsed as any, updated_at: new Date().toISOString() })
    .eq("id", 1);
    
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

// -- Page Content --
const JourneyItemSchema = z.object({
  year: z.string(),
  title: z.string(),
  body: z.string(),
  sort_order: z.number(),
});

const AboutContentSchema = z.object({
  bio: z.string().optional(),
  journey: z.array(JourneyItemSchema).optional(),
});

const BookContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  synopsis: z.string(),
  buy_link: z.string(),
  sample_link: z.string(),
});

export async function updateAboutContent(content: any) {
  const supabase = await requireAdmin();
  const parsed = AboutContentSchema.parse(content);
  
  const { error } = await supabase
    .from("page_content")
    .update({ content: parsed as any, updated_at: new Date().toISOString() })
    .eq("slug", 'about');
    
  if (error) throw new Error(error.message);
  revalidatePath("/about");
}

export async function updateBookContent(content: any) {
  const supabase = await requireAdmin();
  const parsed = BookContentSchema.parse(content);
  
  const { error } = await supabase
    .from("page_content")
    .update({ content: parsed as any, updated_at: new Date().toISOString() })
    .eq("slug", 'book');
    
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/book");
}

// Keep the old updatePageContent for home (hero) for backward compatibility in this transition, or delete it and make a specific one.
export async function updateHomeContent(content: any) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("page_content")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("slug", 'home');
    
  if (error) throw new Error(error.message);
  revalidatePath("/");
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
