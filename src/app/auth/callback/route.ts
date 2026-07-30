import { createClient } from "@/lib/supabase/server";
import { homePathForRole, isAdminEmail, type UserRole } from "@/lib/auth/roles";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextParam = searchParams.get("next");

  const supabase = await createClient();
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

  if (!authError) {
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

    return NextResponse.redirect(`${origin}${next}`);
  }

  const login = new URL("/login", origin);
  login.searchParams.set("error", authError);
  return NextResponse.redirect(login);
}
