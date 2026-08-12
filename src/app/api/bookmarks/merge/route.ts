import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/bookmarks/merge
 * 
 * Merges localStorage bookmarks into the user's Supabase account.
 * Called once on login by BookmarkSyncProvider.
 * 
 * Body: { slugs: string[] }
 */
export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slugs } = await request.json();

    if (!Array.isArray(slugs) || slugs.length === 0) {
      return NextResponse.json({ merged: 0 });
    }

    const supabase = await createClient();

    // Look up story IDs from slugs
    const { data: stories } = await supabase
      .from("stories")
      .select("id, slug")
      .in("slug", slugs);

    if (!stories || stories.length === 0) {
      return NextResponse.json({ merged: 0 });
    }

    // Ensure user profile exists
    await supabase.from("profiles").upsert({ id: userId }, { onConflict: "id" });

    // Upsert bookmarks (ignore duplicates)
    const bookmarkRows = stories.map((s) => ({
      user_id: userId,
      story_id: s.id,
    }));

    const { error } = await supabase
      .from("bookmarks")
      .upsert(bookmarkRows, { onConflict: "user_id,story_id", ignoreDuplicates: true });

    if (error) {
      console.error("Bookmark merge error:", error);
      return NextResponse.json({ error: "Failed to merge bookmarks" }, { status: 500 });
    }

    return NextResponse.json({ merged: stories.length });
  } catch (err) {
    console.error("Bookmark merge error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
