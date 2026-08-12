"use server";

import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function toggleLike(storyId: string, currentStatus: boolean, path: string, anonId?: string) {
  const supabase = await createClient();
  const { userId } = await auth();

  // Use Clerk user ID if logged in, otherwise use the anonymous cookie ID
  const likerId = userId || anonId;

  if (!likerId) {
    throw new Error("Unable to identify user. Please refresh and try again.");
  }

  if (currentStatus) {
    await supabase.from("likes").delete().eq("liker_id", likerId).eq("story_id", storyId);
  } else {
    const { error } = await supabase.from("likes").insert({ liker_id: likerId, story_id: storyId });
    // Gracefully handle duplicate key (already liked)
    if (error && error.code === "23505") {
      // Already liked — not an error from the user's perspective
      return;
    }
    if (error) {
      throw new Error("Failed to like this story. Please try again.");
    }
  }

  revalidatePath(path);
}

export async function toggleBookmark(storyId: string, currentStatus: boolean, path: string) {
  const supabase = await createClient();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be logged in to save a story.");
  }

  if (currentStatus) {
    await supabase.from("bookmarks").delete().eq("user_id", userId).eq("story_id", storyId);
  } else {
    await supabase.from("bookmarks").insert({ user_id: userId, story_id: storyId });
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
  const { auth, currentUser } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  if (!userId) {
    throw new Error("You must be logged in to comment.");
  }

  // Ensure user profile exists to prevent foreign key errors (code 23503)
  const user = await currentUser();
  if (user) {
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress || 'Anonymous';
    await supabase.from('profiles').upsert({
      id: user.id,
      display_name: name
    });
  }

  const { error } = await supabase.from("comments").insert({
    story_id: storyId,
    user_id: userId,
    body: body,
    status: "pending"
  });

  if (error) {
    console.error("Error inserting comment:", error);
    throw new Error(error.message || "Failed to post comment");
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

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required").max(2000, "Message is too long"),
});

export async function submitContactMessage(formData: { name: string, email: string, message: string }) {
  const result = contactSchema.safeParse(formData);
  
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  const supabase = await createClient();

  const { error } = await supabase.from("contact_messages").insert({
    name: result.data.name,
    email: result.data.email,
    message: result.data.message,
    status: 'unread'
  });

  if (error) {
    throw new Error("Failed to send message. Please try again later.");
  }
}

