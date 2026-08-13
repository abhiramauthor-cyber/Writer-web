"use client";

import { useEffect, useRef } from "react";
import { getLocalBookmarks, clearLocalBookmarks } from "@/lib/bookmarks";

/**
 * BookmarkSyncProvider — renders on every page.
 * On login, merges any localStorage bookmarks into the user's Supabase account
 * (one-time migration), then clears localStorage.
 */
export function BookmarkSyncProvider({ children }: { children: React.ReactNode }) {
  const hasMerged = useRef(false);

  useEffect(() => {
    if (hasMerged.current) return;

    const localBookmarks = getLocalBookmarks();
    if (localBookmarks.length === 0) {
      hasMerged.current = true;
      return;
    }

    // Merge local bookmarks into server if local bookmarks exist
    fetch("/api/bookmarks/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slugs: localBookmarks }),
    })
      .then((res) => {
        if (res.ok) {
          clearLocalBookmarks();
        }
      })
      .catch(() => {
        // Silently fail — bookmarks stay in localStorage for next attempt
      })
      .finally(() => {
        hasMerged.current = true;
      });
  }, []);

  return <>{children}</>;
}
