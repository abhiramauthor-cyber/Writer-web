/**
 * Local-first bookmark utilities for Writer Lokam.
 * 
 * Anonymous users: bookmarks stored in localStorage (instant, no network).
 * Logged-in users: bookmarks synced to Supabase (persists across devices).
 * On login: local bookmarks are merged into the account and cleared.
 */

const BOOKMARKS_KEY = "wl_bookmarks";

/** Get all locally bookmarked story slugs */
export function getLocalBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Check if a story is locally bookmarked */
export function isLocallyBookmarked(slug: string): boolean {
  return getLocalBookmarks().includes(slug);
}

/** Add a story slug to local bookmarks */
export function addLocalBookmark(slug: string): void {
  if (typeof window === "undefined") return;
  const bookmarks = getLocalBookmarks();
  if (!bookmarks.includes(slug)) {
    bookmarks.push(slug);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }
}

/** Remove a story slug from local bookmarks */
export function removeLocalBookmark(slug: string): void {
  if (typeof window === "undefined") return;
  const bookmarks = getLocalBookmarks().filter((s) => s !== slug);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

/** Toggle a local bookmark, returns the new state */
export function toggleLocalBookmark(slug: string): boolean {
  if (isLocallyBookmarked(slug)) {
    removeLocalBookmark(slug);
    return false;
  } else {
    addLocalBookmark(slug);
    return true;
  }
}

/** Clear all local bookmarks (called after login merge) */
export function clearLocalBookmarks(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(BOOKMARKS_KEY);
}
