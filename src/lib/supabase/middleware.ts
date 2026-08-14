import { publicRedirect } from "@/lib/auth/app-origin";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { clearSupabaseAuthCookiesOnResponse } from "@/lib/auth/clear-auth-cookies";
import { homePathForRole, type UserRole } from "@/lib/auth/roles";

function redirectPublic(
  request: NextRequest,
  pathname: string,
  search?: Record<string, string>,
) {
  const url = publicRedirect(pathname, request, search);
  if (pathname === "/auth/callback") {
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }
  return NextResponse.redirect(url);
}

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
    return redirectPublic(request, "/auth/callback");
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
      return redirectPublic(request, "/login", { next: path });
    }
    if (role !== "admin") {
      return redirectPublic(request, role ? homePathForRole(role) : "/login");
    }
    return supabaseResponse;
  }

  if (!isPublic && !user) {
    return redirectPublic(request, "/login", { next: path });
  }

  if (user && role) {
    if (path === "/login" || path === "/register" || path === "/dashboard") {
      return redirectPublic(request, homePathForRole(role));
    }

    if (path.startsWith("/admin") && role !== "admin") {
      return redirectPublic(request, homePathForRole(role));
    }
    if (path.startsWith("/client") && role !== "client" && role !== "admin") {
      return redirectPublic(request, homePathForRole(role));
    }
    if (path.startsWith("/supplier") && role !== "supplier" && role !== "admin") {
      return redirectPublic(request, homePathForRole(role));
    }
  }

  return supabaseResponse;
}
