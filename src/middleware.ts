import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Fast environment check for maintenance mode (prevents DB latency on Edge)
  if (process.env.MAINTENANCE_MODE === "true") {
    const pathname = req.nextUrl.pathname;
    if (!pathname.startsWith("/admin") && !pathname.startsWith("/sign-in") && !pathname.startsWith("/api") && pathname !== "/maintenance") {
      const url = req.nextUrl.clone();
      url.pathname = "/maintenance";
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|apple-icon.png|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)",
  ],
};

