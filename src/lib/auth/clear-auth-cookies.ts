import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { getSupabaseCookieOptions } from "@/lib/supabase/cookie-options";

/**
 * Session JWT cookies only: `sb-<ref>-auth-token` and chunk suffixes `.0`.
 * Must not match PKCE verifier cookies (`...-auth-token-code-verifier`).
 */
export function isSupabaseSessionCookie(name: string) {
  return /^sb-.+-auth-token(?:\.\d+)?$/.test(name);
}

/** @deprecated Use isSupabaseSessionCookie. Kept so older imports stay correct. */
export function isSupabaseAuthCookie(name: string) {
  return isSupabaseSessionCookie(name);
}

function expireCookie(
  setCookie: (name: string, value: string, options: Record<string, unknown>) => void,
  name: string,
) {
  const options = getSupabaseCookieOptions();
  const base = {
    path: options.path ?? "/",
    maxAge: 0,
    sameSite: options.sameSite,
    secure: options.secure,
    httpOnly: false,
  };
  setCookie(name, "", base);
  if (options.domain) {
    setCookie(name, "", { ...base, domain: options.domain });
  }
}

export async function clearSupabaseAuthCookies() {
  const cookieStore = await cookies();
  for (const cookie of cookieStore.getAll()) {
    if (isSupabaseSessionCookie(cookie.name)) {
      expireCookie(
        (name, value, options) => cookieStore.set(name, value, options),
        cookie.name,
      );
    }
  }
}

export function clearSupabaseAuthCookiesOnResponse(
  response: NextResponse,
  requestCookies: { name: string }[],
) {
  for (const cookie of requestCookies) {
    if (isSupabaseSessionCookie(cookie.name)) {
      expireCookie(
        (name, value, options) => response.cookies.set(name, value, options),
        cookie.name,
      );
    }
  }
}
