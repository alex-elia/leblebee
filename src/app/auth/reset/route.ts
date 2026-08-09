import { clearSupabaseAuthCookiesOnResponse } from "@/lib/auth/clear-auth-cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/** Clear broken Supabase session cookies (e.g. after a failed magic link). */
export async function GET(request: Request) {
  const requestCookies = (await cookies()).getAll();
  const url = new URL("/login", request.url);
  url.searchParams.set("error", "session_reset");
  const response = NextResponse.redirect(url);
  clearSupabaseAuthCookiesOnResponse(response, requestCookies);
  return response;
}
