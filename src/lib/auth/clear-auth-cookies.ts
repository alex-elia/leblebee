import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

/** Supabase SSR stores session chunks as sb-<project-ref>-auth-token(.N)? */
export function isSupabaseAuthCookie(name: string) {
  return name.startsWith("sb-") && name.includes("auth-token");
}

export async function clearSupabaseAuthCookies() {
  const cookieStore = await cookies();
  for (const cookie of cookieStore.getAll()) {
    if (isSupabaseAuthCookie(cookie.name)) {
      cookieStore.delete(cookie.name);
    }
  }
}

export function clearSupabaseAuthCookiesOnResponse(
  response: NextResponse,
  requestCookies: { name: string }[],
) {
  for (const cookie of requestCookies) {
    if (isSupabaseAuthCookie(cookie.name)) {
      response.cookies.delete(cookie.name);
    }
  }
}
