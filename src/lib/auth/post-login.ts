import { homePathForRole, isAdminEmail, type UserRole } from "@/lib/auth/roles";
import type { SupabaseClient } from "@supabase/supabase-js";

export function resolveAuthCallbackRedirect(
  role: UserRole,
  nextParam: string | null,
): string {
  const fallback = homePathForRole(role);
  const isSafeNext =
    Boolean(nextParam) &&
    nextParam!.startsWith("/") &&
    !nextParam!.startsWith("//");
  const isRoleScopedNext =
    isSafeNext &&
    (role === "admin" ||
      (role === "client" && nextParam!.startsWith("/client")) ||
      (role === "supplier" && nextParam!.startsWith("/supplier")));
  const isAuthFlowNext =
    isSafeNext &&
    (nextParam === "/login/reset-password" || nextParam === "/auth/reset");
  return isSafeNext && (isRoleScopedNext || isAuthFlowNext) ? nextParam! : fallback;
}

export async function ensureProfileForUser(
  supabase: SupabaseClient,
  user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> },
): Promise<UserRole> {
  if (isAdminEmail(user.email)) {
    await supabase.from("profiles").upsert({
      id: user.id,
      role: "admin",
      display_name:
        (user.user_metadata?.display_name as string | undefined) ??
        user.email?.split("@")[0] ??
        "Admin",
    });
    return "admin";
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  return (profile?.role as UserRole | undefined) ?? "client";
}

export async function resolvePostLoginPath(
  supabase: SupabaseClient,
  email: string,
  nextPath?: string,
): Promise<string> {
  if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
    return nextPath;
  }

  if (isAdminEmail(email)) {
    return homePathForRole("admin");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    const role = (profile?.role as UserRole | undefined) ?? "client";
    return homePathForRole(role);
  }

  return "/dashboard";
}

export function mapPasswordSignInError(
  message: string,
  noAccountLabel: string,
): string {
  const msg = message.toLowerCase();
  if (
    msg.includes("invalid login credentials") ||
    msg.includes("user not found")
  ) {
    return noAccountLabel;
  }
  return message;
}
