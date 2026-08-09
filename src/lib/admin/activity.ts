import type { SupabaseClient } from "@supabase/supabase-js";

export type ActivityRow = {
  id: string;
  event_type: string;
  note: string | null;
  created_at: string;
  task: { id: string; title: string } | null;
  actor: { display_name: string | null; role: string } | null;
};

export async function listRecentActivity(
  supabase: SupabaseClient,
  limit = 80,
): Promise<ActivityRow[]> {
  const { data } = await supabase
    .from("task_events")
    .select(
      "id, event_type, note, created_at, tasks(id, title), profiles:actor_id(display_name, role)",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((row) => {
    const taskRaw = row.tasks;
    const task = Array.isArray(taskRaw) ? taskRaw[0] : taskRaw;
    const actorRaw = row.profiles;
    const actor = Array.isArray(actorRaw) ? actorRaw[0] : actorRaw;
    return {
      id: row.id,
      event_type: row.event_type,
      note: row.note,
      created_at: row.created_at,
      task: task ? { id: task.id, title: task.title } : null,
      actor: actor
        ? { display_name: actor.display_name, role: actor.role }
        : null,
    };
  });
}
