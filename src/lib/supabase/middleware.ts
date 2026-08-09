import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { clearSupabaseAuthCookiesOnResponse } from "@/lib/auth/clear-auth-cookies";
import { homePathForRole, type UserRole } from "@/lib/auth/roles";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    clearSupabaseAuthCookiesOnResponse(
      supabaseResponse,
      request.cookies.getAll(),
    );
  }

  const path = request.nextUrl.pathname;

  // Magic-link sometimes lands on site_url with ?code= — forward to callback
  if (
    request.nextUrl.searchParams.has("code") &&
    !path.startsWith("/auth/callback")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    return NextResponse.redirect(url);
  }

  const isPublic =
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/auth") ||
    path.startsWith("/api/health") ||
    path.startsWith("/_next") ||
    path === "/favicon.ico";

  let role: UserRole | null = null;
  if (user && !userError) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    role = (profile?.role as UserRole | undefined) ?? null;
  }

  // Design system: admin only
  if (path.startsWith("/design-system")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
    if (role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = role ? homePathForRole(role) : "/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  if (!isPublic && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user && role) {
    if (path === "/login" || path === "/register" || path === "/dashboard") {
      const url = request.nextUrl.clone();
      url.pathname = homePathForRole(role);
      return NextResponse.redirect(url);
    }

    if (path.startsWith("/admin") && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = homePathForRole(role);
      return NextResponse.redirect(url);
    }
    if (path.startsWith("/client") && role !== "client" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = homePathForRole(role);
      return NextResponse.redirect(url);
    }
    if (path.startsWith("/supplier") && role !== "supplier" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = homePathForRole(role);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
