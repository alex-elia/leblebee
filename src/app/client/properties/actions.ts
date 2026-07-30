"use server";

import { requireProfile } from "@/lib/auth/session";
import {
  groupPlaybookRows,
  linesToList,
  playbookToInsertRows,
  type PropertyPlaybook,
} from "@/lib/properties/playbook";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type PropertyActionState = {
  error?: string;
  ok?: boolean;
};

function playbookFromForm(formData: FormData): PropertyPlaybook {
  return {
    access: linesToList(String(formData.get("access") ?? "")),
    materials: linesToList(String(formData.get("materials") ?? "")),
    standards: linesToList(String(formData.get("standards") ?? "")),
    notes: linesToList(String(formData.get("notes") ?? "")),
  };
}

async function replacePlaybook(
  supabase: Awaited<ReturnType<typeof requireProfile>>["supabase"],
  propertyId: string,
  playbook: PropertyPlaybook,
) {
  await supabase.from("property_memory").delete().eq("property_id", propertyId);
  const rows = playbookToInsertRows(propertyId, playbook);
  if (rows.length > 0) {
    await supabase.from("property_memory").insert(rows);
  }
}

export async function createProperty(
  _prev: PropertyActionState,
  formData: FormData,
): Promise<PropertyActionState> {
  const { user, supabase } = await requireProfile(["client", "admin"]);

  const name = String(formData.get("name") ?? "").trim();
  const addressNotes = String(formData.get("address_notes") ?? "").trim();
  const playbook = playbookFromForm(formData);

  if (!name) {
    return { error: "Property name is required." };
  }

  const { data: property, error } = await supabase
    .from("properties")
    .insert({
      client_id: user.id,
      name,
      address_notes: addressNotes || null,
    })
    .select("id")
    .single();

  if (error || !property) {
    return { error: error?.message ?? "Could not create property." };
  }

  await replacePlaybook(supabase, property.id, playbook);

  revalidatePath("/client");
  revalidatePath("/client/properties");
  redirect(`/client/properties/${property.id}`);
}

export async function updateProperty(
  _prev: PropertyActionState,
  formData: FormData,
): Promise<PropertyActionState> {
  const { supabase } = await requireProfile(["client", "admin"]);

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const addressNotes = String(formData.get("address_notes") ?? "").trim();
  const playbook = playbookFromForm(formData);

  if (!id || !name) {
    return { error: "Property name is required." };
  }

  const { error } = await supabase
    .from("properties")
    .update({
      name,
      address_notes: addressNotes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await replacePlaybook(supabase, id, playbook);

  revalidatePath("/client/properties");
  revalidatePath(`/client/properties/${id}`);
  return { ok: true };
}

export async function deleteProperty(formData: FormData) {
  const { supabase } = await requireProfile(["client", "admin"]);
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("properties").delete().eq("id", id);
  revalidatePath("/client/properties");
  revalidatePath("/client");
  redirect("/client/properties");
}

export async function loadPropertyPlaybook(propertyId: string) {
  const { supabase } = await requireProfile(["client", "admin", "supplier"]);
  const { data } = await supabase
    .from("property_memory")
    .select("bullet, kind, sort_order")
    .eq("property_id", propertyId)
    .order("sort_order");
  return groupPlaybookRows(data ?? []);
}
