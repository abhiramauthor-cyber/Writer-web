"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleLike(storyId: string, currentStatus: boolean, path: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to like a story.");
  }

  if (currentStatus) {
    await supabase.from("likes").delete().eq("user_id", user.id).eq("story_id", storyId);
  } else {
    await supabase.from("likes").insert({ user_id: user.id, story_id: storyId });
  }

  revalidatePath(path);
}

export async function toggleBookmark(storyId: string, currentStatus: boolean, path: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to save a story.");
  }

  if (currentStatus) {
    await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("story_id", storyId);
  } else {
    await supabase.from("bookmarks").insert({ user_id: user.id, story_id: storyId });
  }

  revalidatePath(path);
}

export async function postComment(storyId: string, body: string, path: string) {
  if (!body || typeof body !== 'string' || body.trim().length === 0) {
    throw new Error("Comment cannot be empty.");
  }
  if (body.length > 2000) {
    throw new Error("Comment is too long (maximum 2000 characters).");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to comment.");
  }

  const { error } = await supabase.from("comments").insert({
    story_id: storyId,
    user_id: user.id,
    body: body,
    status: "pending"
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(path);
}

export async function subscribeToNewsletter(email: string) {
  if (!email || typeof email !== 'string' || email.trim().length === 0 || !email.includes("@") || email.length > 255) {
    throw new Error("Please provide a valid email address.");
  }

  const supabase = await createClient();

  const { error } = await supabase.from("subscribers").insert({
    email: email.toLowerCase(),
    status: "active"
  });

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error("You are already subscribed!");
    }
    throw new Error(error.message);
  }
}
