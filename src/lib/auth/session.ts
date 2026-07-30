import { createClient } from "@/lib/supabase/server";
import {
  ADMIN_EMAIL,
  homePathForRole,
  isAdminEmail,
  type Profile,
  type UserRole,
} from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function getProfile(): Promise<{
  user: NonNullable<Awaited<ReturnType<typeof getSessionUser>>["user"]>;
  profile: Profile;
  supabase: Awaited<ReturnType<typeof createClient>>;
} | null> {
  const { supabase, user } = await getSessionUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, display_name, preferred_language")
    .eq("id", user.id)
    .maybeSingle();

  if (profile) {
    // Keep admin email authoritative even if profile was created wrong
    if (isAdminEmail(user.email) && profile.role !== "admin") {
      await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.id);
      return {
        user,
        profile: { ...profile, role: "admin" },
        supabase,
      };
    }
    return { user, profile: profile as Profile, supabase };
  }

  const role: UserRole = isAdminEmail(user.email)
    ? "admin"
    : ((user.user_metadata?.role as UserRole | undefined) ?? "client");

  const safeRole: UserRole =
    role === "admin" && !isAdminEmail(user.email) ? "client" : role;

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      role: safeRole,
      display_name:
        (user.user_metadata?.display_name as string | undefined) ??
        user.email?.split("@")[0] ??
        "User",
      preferred_language:
        (user.user_metadata?.preferred_language as string | undefined) ?? "en",
    })
    .select("id, role, display_name, preferred_language")
    .single();

  if (error || !created) {
    throw new Error(error?.message ?? "Could not create profile");
  }

  return { user, profile: created as Profile, supabase };
}

export async function requireProfile(roles?: UserRole[]) {
  const session = await getProfile();
  if (!session) {
    redirect("/login");
  }
  if (roles && !roles.includes(session.profile.role)) {
    redirect(homePathForRole(session.profile.role));
  }
  return session;
}

export { ADMIN_EMAIL, homePathForRole };
