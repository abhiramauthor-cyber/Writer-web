import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

let cachedMaintenanceMode = false;
let lastCheckTime = 0;
const CACHE_TTL_MS = 60_000; // 60 seconds

let supabaseClient: any = null;
function getSupabase() {
  if (!supabaseClient && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return supabaseClient;
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Maintenance mode check with in-memory caching
  const pathname = req.nextUrl.pathname;
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/sign-in") && !pathname.startsWith("/api")) {
    const now = Date.now();
    if (now - lastCheckTime > CACHE_TTL_MS) {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const { data: settings } = await supabase
            .from("site_settings")
            .select("is_maintenance_mode")
            .eq("id", 1)
            .single();

          cachedMaintenanceMode = !!settings?.is_maintenance_mode;
          lastCheckTime = now;
        }
      } catch {
        // Fallback to cached state on error
      }
    }

    if (cachedMaintenanceMode) {
      if (pathname !== "/maintenance") {
        const url = req.nextUrl.clone();
        url.pathname = "/maintenance";
        return NextResponse.redirect(url);
      }
    } else {
      if (pathname === "/maintenance") {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
