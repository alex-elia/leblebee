"use server";

import { requireProfile } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type TaskPhotoKind = "arrival" | "handoff";

export type HandoffActionState = {
  error?: string;
  ok?: boolean;
};

export type TaskPhoto = {
  id: string;
  caption: string | null;
  created_at: string;
  url: string | null;
};

const MAX_PHOTOS = 6;
const MAX_BYTES = 8 * 1024 * 1024;

function revalidateTaskPaths(taskId: string) {
  revalidatePath(`/supplier/tasks/${taskId}`);
  revalidatePath(`/client/tasks/${taskId}`);
  revalidatePath("/supplier");
  revalidatePath("/client/tasks");
}

async function assertSupplierTaskAccess(
  taskId: string,
  profileRole: string,
  userId: string,
  supabase: Awaited<ReturnType<typeof requireProfile>>["supabase"],
) {
  const { data: task } = await supabase
    .from("tasks")
    .select("id, status, assigned_provider_id, providers!assigned_provider_id(user_id)")
    .eq("id", taskId)
    .maybeSingle();

  if (!task) return { error: "Task not found." as const, task: null };

  const provider = Array.isArray(task.providers)
    ? task.providers[0]
    : task.providers;

  if (profileRole === "supplier" && provider?.user_id !== userId) {
    return { error: "Not allowed." as const, task: null };
  }

  return { error: null, task };
}

async function uploadTaskPhotos(input: {
  taskId: string;
  files: File[];
  kind: TaskPhotoKind;
  notes: string;
  userId: string;
  supabase: Awaited<ReturnType<typeof requireProfile>>["supabase"];
}): Promise<{ error?: string }> {
  const files = input.files.slice(0, MAX_PHOTOS);

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return { error: "Only image files are allowed." };
    }
    if (file.size > MAX_BYTES) {
      return { error: "Each photo must be under 8MB." };
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${input.taskId}/${input.userId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await input.supabase.storage
      .from("task-attachments")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { error: rowError } = await input.supabase
      .from("task_attachments")
      .insert({
        task_id: input.taskId,
        created_by: input.userId,
        storage_path: path,
        kind: input.kind,
        caption: input.notes || null,
      });

    if (rowError) {
      return { error: rowError.message };
    }
  }

  return {};
}

export async function recordArrivalPhotos(
  _prev: HandoffActionState,
  formData: FormData,
): Promise<HandoffActionState> {
  const { user, profile, supabase } = await requireProfile([
    "supplier",
    "admin",
  ]);

  const taskId = String(formData.get("task_id") ?? "");
  const notes = String(formData.get("arrival_notes") ?? "").trim();
  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (!taskId) return { error: "Missing task." };
  if (files.length < 1) {
    return { error: "Add at least one arrival photo before continuing." };
  }

  const access = await assertSupplierTaskAccess(
    taskId,
    profile.role,
    user.id,
    supabase,
  );
  if (access.error || !access.task) return { error: access.error ?? "Task not found." };

  if (access.task.status !== "accepted") {
    return { error: "Confirm the task first, then add arrival photos." };
  }

  const { data: existing } = await supabase
    .from("task_attachments")
    .select("id")
    .eq("task_id", taskId)
    .eq("kind", "arrival")
    .limit(1);

  if (existing?.length) {
    return { error: "Arrival photos were already saved for this task." };
  }

  const upload = await uploadTaskPhotos({
    taskId,
    files,
    kind: "arrival",
    notes,
    userId: user.id,
    supabase,
  });
  if (upload.error) return { error: upload.error };

  await supabase.from("task_events").insert({
    task_id: taskId,
    actor_id: user.id,
    event_type: "arrival_photos",
    note: notes
      ? `Arrival with ${files.length} photo(s): ${notes}`
      : `Arrival with ${files.length} photo(s)`,
  });

  revalidateTaskPaths(taskId);
  redirect(`/supplier/tasks/${taskId}`);
}

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
  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (!taskId) return { error: "Missing task." };
  if (files.length < 1) {
    return { error: "Add at least one departure photo before marking done." };
  }

  const access = await assertSupplierTaskAccess(
    taskId,
    profile.role,
    user.id,
    supabase,
  );
  if (access.error || !access.task) return { error: access.error ?? "Task not found." };

  if (access.task.status !== "accepted") {
    return { error: "Task must be accepted before completion." };
  }

  const { data: arrivalPhotos } = await supabase
    .from("task_attachments")
    .select("id")
    .eq("task_id", taskId)
    .eq("kind", "arrival")
    .limit(1);

  if (!arrivalPhotos?.length) {
    return { error: "Add arrival photos first, then departure photos." };
  }

  const upload = await uploadTaskPhotos({
    taskId,
    files,
    kind: "handoff",
    notes,
    userId: user.id,
    supabase,
  });
  if (upload.error) return { error: upload.error };

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

  revalidateTaskPaths(taskId);
  redirect(`/supplier/tasks/${taskId}`);
}

/** Best-effort task notification. Skips auth email (PKCE magic links fail for server-sent mail on default Supabase templates). Suppliers sign in with password at /login. */
export async function notifySupplierOfTask(input: {
  supplierEmail: string | null | undefined;
  taskId: string;
  taskTitle: string;
}) {
  void input;
  // Intentionally no-op: server-triggered signInWithOtp emails use PKCE links that
  // cannot work in the supplier's browser. Use in-app task list after password login.
}

export async function getTaskPhotoUrls(
  taskId: string,
  kind: TaskPhotoKind,
): Promise<TaskPhoto[]> {
  const { supabase } = await requireProfile([
    "client",
    "supplier",
    "admin",
  ]);

  const { data: rows } = await supabase
    .from("task_attachments")
    .select("id, storage_path, caption, created_at, kind")
    .eq("task_id", taskId)
    .eq("kind", kind)
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

export async function getHandoffPhotoUrls(taskId: string) {
  return getTaskPhotoUrls(taskId, "handoff");
}

export async function getArrivalPhotoUrls(taskId: string) {
  return getTaskPhotoUrls(taskId, "arrival");
}
