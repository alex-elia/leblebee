import { publicRedirect } from "@/lib/auth/app-origin";
import { clearSupabaseAuthCookiesOnResponse } from "@/lib/auth/clear-auth-cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/** Clear broken Supabase session cookies (e.g. after a failed magic link). */
export async function GET(request: Request) {
  const requestCookies = (await cookies()).getAll();
  const response = NextResponse.redirect(
    publicRedirect("/login", request, { error: "session_reset" }),
  );
  clearSupabaseAuthCookiesOnResponse(response, requestCookies);
  return response;
}
