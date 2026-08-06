"use server";

import { requireProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type HandoffActionState = {
  error?: string;
  ok?: boolean;
};

export async function completeTaskWithHandoff(
  _prev: HandoffActionState,
  formData: FormData,
): Promise<HandoffActionState> {
  const { user, profile, supabase } = await requireProfile([
    "supplier",
    "admin",
  ]);

  const taskId = String(formData.get("task_id") ?? "");
  const notes = String(formData.get("completion_notes") ?? "").trim();
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);

  if (!taskId) return { error: "Missing task." };
  if (files.length < 1) {
    return { error: "Add at least one handoff photo before marking done." };
  }

  const { data: task } = await supabase
    .from("tasks")
    .select("id, assigned_provider_id, providers!assigned_provider_id(user_id)")
    .eq("id", taskId)
    .maybeSingle();

  if (!task) return { error: "Task not found." };

  const provider = Array.isArray(task.providers)
    ? task.providers[0]
    : task.providers;

  if (profile.role === "supplier" && provider?.user_id !== user.id) {
    return { error: "Not allowed." };
  }

  for (const file of files.slice(0, 6)) {
    if (!file.type.startsWith("image/")) {
      return { error: "Only image files are allowed." };
    }
    if (file.size > 8 * 1024 * 1024) {
      return { error: "Each photo must be under 8MB." };
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${taskId}/${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("task-attachments")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { error: rowError } = await supabase.from("task_attachments").insert({
      task_id: taskId,
      created_by: user.id,
      storage_path: path,
      kind: "handoff",
      caption: notes || null,
    });

    if (rowError) {
      return { error: rowError.message };
    }
  }

  const { error: updateError } = await supabase
    .from("tasks")
    .update({
      status: "done",
      completion_notes: notes || null,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId);

  if (updateError) return { error: updateError.message };

  await supabase.from("task_events").insert({
    task_id: taskId,
    actor_id: user.id,
    event_type: "done",
    note: notes
      ? `Completed with ${files.length} photo(s): ${notes}`
      : `Completed with ${files.length} photo(s)`,
  });

  revalidatePath(`/supplier/tasks/${taskId}`);
  revalidatePath(`/client/tasks/${taskId}`);
  revalidatePath("/supplier");
  revalidatePath("/client/tasks");
  redirect(`/supplier/tasks/${taskId}`);
}

/** Best-effort magic-link ping so the supplier sees the new task (Mailpit locally). */
export async function notifySupplierOfTask(input: {
  supplierEmail: string | null | undefined;
  taskId: string;
  taskTitle: string;
}) {
  if (!input.supplierEmail) return;

  const origin = (
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3010"
  ).replace(/\/$/, "");

  try {
    const admin = createAdminClient();
    await admin.auth.signInWithOtp({
      email: input.supplierEmail.toLowerCase(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
          `/supplier/tasks/${input.taskId}`,
        )}`,
        data: {
          notify: "task_assigned",
          task_title: input.taskTitle,
        },
      },
    });
  } catch {
    // Non-blocking — assignment still succeeds without email
  }
}

export async function getHandoffPhotoUrls(taskId: string) {
  const { supabase } = await requireProfile([
    "client",
    "supplier",
    "admin",
  ]);

  const { data: rows } = await supabase
    .from("task_attachments")
    .select("id, storage_path, caption, created_at, kind")
    .eq("task_id", taskId)
    .eq("kind", "handoff")
    .order("created_at", { ascending: true });

  if (!rows?.length) return [];

  const paths = rows.map((r) => r.storage_path);
  const { data: signed } = await supabase.storage
    .from("task-attachments")
    .createSignedUrls(paths, 60 * 60);

  const urlByPath = new Map(
    (signed ?? []).map((s) => [s.path, s.signedUrl] as const),
  );

  return rows.map((r) => ({
    id: r.id,
    caption: r.caption,
    created_at: r.created_at,
    url: urlByPath.get(r.storage_path) ?? null,
  }));
}
