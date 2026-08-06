"use server";

import { prepareInstructions, translateMessage } from "@/lib/ai/companion";
import { requireProfile } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type TaskActionState = {
  error?: string;
  ok?: boolean;
  preview?: {
    clarifiedTitle: string;
    clarifiedBody: string;
    translatedTitle: string;
    translatedBody: string;
    checklist: string[];
    vagueFlags: string[];
    sourceLang: string;
    targetLang: string;
    model: string;
  };
};

export async function previewTaskInstructions(
  _prev: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const { supabase } = await requireProfile(["client", "admin"]);

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("description") ?? "").trim();
  const specificNotes = String(formData.get("specific_notes") ?? "").trim();
  const sourceLang = String(formData.get("source_language") ?? "en").trim();
  const targetLang = String(formData.get("target_language") ?? "el").trim();
  const category = String(formData.get("category") ?? "cleaning").trim();
  const propertyId = String(formData.get("property_id") ?? "");
  const includeStandards = formData.get("include_standards") !== "0";

  if (!title) return { error: "Title is required." };
  if (!propertyId) return { error: "Choose a property." };

  let playbook = {
    access: [] as string[],
    materials: [] as string[],
    standards: [] as string[],
    notes: [] as string[],
  };

  if (propertyId) {
    const { data } = await supabase
      .from("property_memory")
      .select("bullet, kind, sort_order")
      .eq("property_id", propertyId)
      .order("sort_order");
    const { groupPlaybookRows } = await import("@/lib/properties/playbook");
    playbook = groupPlaybookRows(data ?? []);
    if (!includeStandards) {
      playbook = { ...playbook, standards: [] };
    }
  }

  const hasPlaybookContent =
    playbook.standards.length > 0 ||
    playbook.access.length > 0 ||
    playbook.materials.length > 0;

  if (!specificNotes && !body && !hasPlaybookContent) {
    return {
      error:
        "Add apartment standards on the property, or “This visit only” notes for this task.",
    };
  }

  try {
    const result = await prepareInstructions({
      title,
      body,
      specificNotes,
      sourceLang,
      targetLang,
      category,
      playbook,
    });
    return {
      ok: true,
      preview: {
        ...result,
        sourceLang,
        targetLang,
      },
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "AI assist failed.",
    };
  }
}

export async function createAndAssignTask(
  _prev: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const { user, supabase } = await requireProfile(["client", "admin"]);

  const propertyId = String(formData.get("property_id") ?? "");
  const supplierId = String(formData.get("supplier_id") ?? "");
  const category = String(formData.get("category") ?? "cleaning").trim();
  const sourceLang = String(formData.get("source_language") ?? "en").trim();
  const targetLang = String(formData.get("target_language") ?? "el").trim();
  const dueAt = String(formData.get("due_at") ?? "").trim();
  const priority = String(formData.get("priority") ?? "normal").trim();

  const title = String(
    formData.get("clarified_title") || formData.get("title") || "",
  ).trim();
  const description = String(
    formData.get("clarified_body") || formData.get("description") || "",
  ).trim();
  const specificNotes = String(formData.get("specific_notes") ?? "").trim();
  const translatedTitle = String(formData.get("translated_title") ?? "").trim();
  const translatedBody = String(formData.get("translated_body") ?? "").trim();
  const checklistRaw = String(formData.get("checklist") ?? "").trim();
  const model = String(formData.get("ai_model") ?? "").trim() || null;

  if (!propertyId) return { error: "Choose a property." };
  if (!supplierId) return { error: "Choose a supplier." };
  if (!title || !description) return { error: "Instructions are required." };

  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      property_id: propertyId,
      client_id: user.id,
      assigned_provider_id: supplierId,
      category,
      title,
      description,
      specific_notes: specificNotes || null,
      source_language: sourceLang,
      status: "assigned",
      priority,
      due_at: dueAt ? new Date(dueAt).toISOString() : null,
    })
    .select("id")
    .single();

  if (error || !task) {
    return { error: error?.message ?? "Could not create task." };
  }

  const checklistBlock =
    checklistRaw.length > 0
      ? `\n\n— Don't forget —\n${checklistRaw
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => `• ${l.replace(/^[-*•]\s*/, "")}`)
          .join("\n")}`
      : "";

  await supabase.from("task_translations").upsert(
    {
      task_id: task.id,
      lang: targetLang,
      title: translatedTitle || title,
      body: (translatedBody || description) + checklistBlock,
      model,
    },
    { onConflict: "task_id,lang" },
  );

  await supabase.from("task_translations").upsert(
    {
      task_id: task.id,
      lang: sourceLang,
      title,
      body: description,
      model,
    },
    { onConflict: "task_id,lang" },
  );

  await supabase.from("task_events").insert({
    task_id: task.id,
    actor_id: user.id,
    event_type: "assigned",
    note: "Task created and assigned with AI-assisted instructions",
  });

  // Opening message = instructions in both languages
  await supabase.from("task_messages").insert({
    task_id: task.id,
    author_id: user.id,
    body: description,
    source_language: sourceLang,
    translated_body: (translatedBody || description) + checklistBlock,
    target_language: targetLang,
    model,
  });

  const { data: supplier } = await supabase
    .from("providers")
    .select("email, user_id")
    .eq("id", supplierId)
    .maybeSingle();

  if (supplier?.email) {
    const { notifySupplierOfTask } = await import(
      "@/app/supplier/tasks/handoff-actions"
    );
    await notifySupplierOfTask({
      supplierEmail: supplier.email,
      taskId: task.id,
      taskTitle: title,
    });
  }

  revalidatePath("/client/tasks");
  revalidatePath("/supplier");
  redirect(`/client/tasks/${task.id}`);
}

export type MessageActionState = {
  error?: string;
  ok?: boolean;
};

export async function sendTaskMessage(
  _prev: MessageActionState,
  formData: FormData,
): Promise<MessageActionState> {
  const { user, profile, supabase } = await requireProfile([
    "client",
    "supplier",
    "admin",
  ]);

  const taskId = String(formData.get("task_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!taskId || !body) return { error: "Message cannot be empty." };

  const { data: task } = await supabase
    .from("tasks")
    .select(
      "id, client_id, source_language, assigned_provider_id, providers!assigned_provider_id(language, user_id)",
    )
    .eq("id", taskId)
    .maybeSingle();

  if (!task) return { error: "Task not found." };

  const providerRaw = task.providers as
    | { language?: string; user_id?: string | null }
    | { language?: string; user_id?: string | null }[]
    | null;
  const provider = Array.isArray(providerRaw) ? providerRaw[0] : providerRaw;
  const supplierLang = (provider?.language as string | undefined) ?? "el";
  const clientLang = task.source_language ?? "en";

  const isClient =
    profile.role === "client" ||
    profile.role === "admin" ||
    task.client_id === user.id;
  const isSupplier = provider?.user_id === user.id;

  if (!isClient && !isSupplier && profile.role !== "admin") {
    return { error: "Not allowed." };
  }

  const sourceLang = isSupplier ? supplierLang : clientLang;
  const targetLang = isSupplier ? clientLang : supplierLang;

  let translated = body;
  let model: string | null = "none";
  try {
    const result = await translateMessage({ body, sourceLang, targetLang });
    translated = result.translated;
    model = result.model;
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Translation failed.",
    };
  }

  const { error } = await supabase.from("task_messages").insert({
    task_id: taskId,
    author_id: user.id,
    body,
    source_language: sourceLang,
    translated_body: translated,
    target_language: targetLang,
    model,
  });

  if (error) return { error: error.message };

  revalidatePath(`/client/tasks/${taskId}`);
  revalidatePath(`/supplier/tasks/${taskId}`);
  return { ok: true };
}

export async function updateTaskStatus(formData: FormData) {
  const { user, profile, supabase } = await requireProfile([
    "client",
    "supplier",
    "admin",
  ]);
  const taskId = String(formData.get("task_id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!taskId || !status) return;

  // Suppliers must use the handoff form (photos) to mark done
  if (status === "done" && profile.role === "supplier") {
    return;
  }

  await supabase
    .from("tasks")
    .update({
      status,
      updated_at: new Date().toISOString(),
      ...(status === "done"
        ? { completed_at: new Date().toISOString() }
        : {}),
    })
    .eq("id", taskId);
  await supabase.from("task_events").insert({
    task_id: taskId,
    actor_id: user.id,
    event_type: status,
    note: `${profile.role} set status to ${status}`,
  });

  revalidatePath(`/client/tasks/${taskId}`);
  revalidatePath(`/supplier/tasks/${taskId}`);
  revalidatePath("/supplier");
  revalidatePath("/client/tasks");
}
