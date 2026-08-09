import type { UserRole } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

export type PlatformUser = {
  id: string;
  role: UserRole;
  display_name: string | null;
  preferred_language: string;
  created_at: string;
  email: string | null;
};

async function emailByUserId(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const admin = createAdminClient();
    let page = 1;
    while (true) {
      const { data } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      for (const user of data.users) {
        if (user.email) map.set(user.id, user.email);
      }
      if (data.users.length < 200) break;
      page += 1;
    }
  } catch {
    // Local without service role: emails stay null
  }
  return map;
}

export async function listPlatformUsers(
  supabase: SupabaseClient,
): Promise<PlatformUser[]> {
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, role, display_name, preferred_language, created_at")
    .order("created_at", { ascending: false });

  const emails = await emailByUserId();

  return (profiles ?? []).map((profile) => ({
    ...profile,
    role: profile.role as UserRole,
    email: emails.get(profile.id) ?? null,
  }));
}
