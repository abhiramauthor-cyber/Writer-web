/**
 * Anonymous identity utilities for Writer Lokam.
 * 
 * On first visit, generates a random UUID and stores it in a long-lived cookie.
 * This ID is used as the `liker_id` for anonymous likes so guests can like
 * stories without logging in — their likes persist as long as the cookie lives.
 * 
 * If the user is logged in with Clerk, their Clerk user ID is used instead,
 * so likes persist across devices.
 */

const ANON_COOKIE_NAME = "wl_anon_id";
const ANON_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 365 days in seconds

/**
 * Get or create an anonymous ID from the browser cookie.
 * Client-side only.
 */
export function getOrCreateAnonId(): string {
  if (typeof document === "undefined") {
    throw new Error("getOrCreateAnonId() can only be called in the browser");
  }

  // Try to read existing cookie
  const existing = getCookie(ANON_COOKIE_NAME);
  if (existing) return existing;

  // Generate a new UUID
  const id = crypto.randomUUID();

  // Set cookie with long expiry, SameSite=Lax for CSRF protection
  document.cookie = `${ANON_COOKIE_NAME}=${id}; path=/; max-age=${ANON_COOKIE_MAX_AGE}; SameSite=Lax`;

  return id;
}

/**
 * Read the anon ID cookie (returns undefined if not set).
 * Client-side only.
 */
export function getAnonId(): string | undefined {
  if (typeof document === "undefined") return undefined;
  return getCookie(ANON_COOKIE_NAME);
}

/**
 * Read anon ID from a cookie header string (for server-side usage).
 */
export function getAnonIdFromCookieHeader(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ANON_COOKIE_NAME}=([^;]+)`));
  return match?.[1] || undefined;
}

/** Helper: read a single cookie value by name */
function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match?.[1] || undefined;
}
