import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  const { data: { user } } = await supabase.auth.getUser();

  // Protect /admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user || user.email !== 'abhiramssk@gmail.com') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Check Maintenance Mode (using public anon key)
  if (!request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/auth')) {
    const { data: settings } = await supabase.from('site_settings').select('is_maintenance_mode').eq('id', 1).single();
    if (settings?.is_maintenance_mode && user?.email !== 'abhiramssk@gmail.com') {
      if (request.nextUrl.pathname !== '/maintenance') {
        const url = request.nextUrl.clone();
        url.pathname = '/maintenance';
        return NextResponse.redirect(url);
      }
    } else {
       if (request.nextUrl.pathname === '/maintenance') {
          const url = request.nextUrl.clone();
          url.pathname = '/';
          return NextResponse.redirect(url);
       }
    }
  }

  return supabaseResponse;
}
