"use server";

import { requireProfile } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type SupplierActionState = {
  error?: string;
  ok?: boolean;
};

async function linkSupplierUser(
  supabase: Awaited<ReturnType<typeof requireProfile>>["supabase"],
  email: string | null,
) {
  if (!email) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("role", "supplier");
  // profiles don't store email — look up via admin auth is heavy; store email only
  // and link when supplier profile email matches via a DB view later.
  // For now: match by checking auth through service if available.
  void data;
  return null;
}

export async function createSupplier(
  _prev: SupplierActionState,
  formData: FormData,
): Promise<SupplierActionState> {
  const { user, supabase } = await requireProfile(["client", "admin"]);

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const whatsapp = String(formData.get("whatsapp") ?? "").trim() || null;
  const language = String(formData.get("language") ?? "el").trim() || "el";
  const specialtiesRaw = String(formData.get("specialties") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!name) return { error: "Name is required." };

  const specialties = specialtiesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let userId: string | null = null;
  if (email) {
    // Link if a supplier auth user with this email exists (seed / registered)
    const { createAdminClient } = await import("@/lib/supabase/admin");
    try {
      const admin = createAdminClient();
      const { data: listed } = await admin.auth.admin.listUsers({ perPage: 200 });
      const match = listed.users.find(
        (u) => u.email?.toLowerCase() === email,
      );
      if (match) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", match.id)
          .maybeSingle();
        if (profile?.role === "supplier") {
          userId = profile.id;
        }
      }
    } catch {
      // Local without service role — skip link
      void linkSupplierUser;
    }
  }

  const { data, error } = await supabase
    .from("providers")
    .insert({
      client_id: user.id,
      user_id: userId,
      name,
      email,
      phone,
      whatsapp,
      language,
      specialties,
      notes,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create supplier." };
  }

  revalidatePath("/client/suppliers");
  redirect(`/client/suppliers/${data.id}`);
}

export async function updateSupplier(
  _prev: SupplierActionState,
  formData: FormData,
): Promise<SupplierActionState> {
  const { user, profile, supabase } = await requireProfile(["client", "admin"]);

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const whatsapp = String(formData.get("whatsapp") ?? "").trim() || null;
  const language = String(formData.get("language") ?? "el").trim() || "el";
  const specialtiesRaw = String(formData.get("specialties") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!id || !name) return { error: "Name is required." };

  const specialties = specialtiesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let query = supabase
    .from("providers")
    .update({
      name,
      email,
      phone,
      whatsapp,
      language,
      specialties,
      notes,
    })
    .eq("id", id);

  if (profile.role === "client") {
    query = query.eq("client_id", user.id);
  }

  const { error } = await query;
  if (error) return { error: error.message };

  // Re-link user if email matches a supplier account
  if (email) {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const admin = createAdminClient();
      const { data: listed } = await admin.auth.admin.listUsers({ perPage: 200 });
      const match = listed.users.find((u) => u.email?.toLowerCase() === email);
      if (match) {
        await supabase
          .from("providers")
          .update({ user_id: match.id })
          .eq("id", id);
      }
    } catch {
      /* ignore */
    }
  }

  revalidatePath("/client/suppliers");
  revalidatePath(`/client/suppliers/${id}`);
  return { ok: true };
}

export async function deleteSupplier(formData: FormData) {
  const { user, profile, supabase } = await requireProfile(["client", "admin"]);
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  let query = supabase.from("providers").delete().eq("id", id);
  if (profile.role === "client") {
    query = query.eq("client_id", user.id);
  }
  await query;

  revalidatePath("/client/suppliers");
  redirect("/client/suppliers");
}
