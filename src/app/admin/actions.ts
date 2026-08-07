"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Helper to check admin
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== 'abhiramssk@gmail.com') {
    throw new Error("Unauthorized");
  }
  return supabase;
}

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

// -- Page Content --
export async function updatePageContent(slug: string, content: any) {
  const supabase = await requireAdmin();
  
  const { error } = await supabase
    .from("page_content")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("slug", slug);
    
  if (error) throw new Error(error.message);
  revalidatePath(`/${slug === 'home' ? '' : slug}`);
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
  // Also ideally revalidate the specific story page, but we don't have the slug here easily without fetching it.
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
  
  // If it's a new story (no id), insert it
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
    // Update existing
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
        // Only update published_at if it's transitioning to published for the first time? For simplicity we just use now() if newly published, or keep old.
      })
      .eq("id", story.id);
    if (error) throw new Error(error.message);
  }
  
  revalidatePath("/admin/stories");
  revalidatePath("/stories");
  revalidatePath(`/stories/${story.slug}`);
  revalidatePath("/");
}
