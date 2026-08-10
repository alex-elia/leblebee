import { getAppOrigin } from "@/lib/auth/app-origin";
import { clearSupabaseAuthCookiesOnResponse } from "@/lib/auth/clear-auth-cookies";
import { homePathForRole, isAdminEmail, type UserRole } from "@/lib/auth/roles";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

type PendingCookie = {
  name: string;
  value: string;
  options: Parameters<NextResponse["cookies"]["set"]>[2];
};

function redirectToLogin(origin: string, error: string, requestCookies: { name: string }[]) {
  const login = new URL("/login", origin);
  login.searchParams.set("error", error);
  const response = NextResponse.redirect(login);
  clearSupabaseAuthCookiesOnResponse(response, requestCookies);
  return response;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = getAppOrigin(request);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const nextParam = requestUrl.searchParams.get("next");
  const cookieStore = await cookies();
  const requestCookies = cookieStore.getAll();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return redirectToLogin(origin, "auth_not_configured", requestCookies);
  }

  try {
    const pendingCookies: PendingCookie[] = [];

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            pendingCookies.push({ name, value, options });
          });
        },
      },
    });

    let authError: string | null = null;

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) authError = error.message;
    } else if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash,
      });
      if (error) authError = error.message;
    } else {
      authError = "missing_code";
    }

    if (authError) {
      return redirectToLogin(origin, authError, requestCookies);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let role: UserRole = "client";
    if (user) {
      if (isAdminEmail(user.email)) {
        role = "admin";
        await supabase.from("profiles").upsert({
          id: user.id,
          role: "admin",
          display_name:
            (user.user_metadata?.display_name as string | undefined) ??
            user.email?.split("@")[0] ??
            "Admin",
        });
      } else {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        role = (profile?.role as UserRole | undefined) ?? "client";
      }
    }

    const fallback = homePathForRole(role);
    const next =
      nextParam &&
      nextParam.startsWith("/") &&
      !nextParam.startsWith("//") &&
      (role === "admin" ||
        (role === "client" && nextParam.startsWith("/client")) ||
        (role === "supplier" && nextParam.startsWith("/supplier")))
        ? nextParam
        : fallback;

    const response = NextResponse.redirect(new URL(next, origin));
    pendingCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  } catch {
    return redirectToLogin(origin, "auth_callback_failed", requestCookies);
  }
}
