import { PersonaShell } from "@/components/ui/persona-shell";
import { Button, EmptyState, TaskRow } from "@/components/ui";
import type { TaskStatus } from "@/components/ui/status-chip";
import { requireProfile } from "@/lib/auth/session";
import { getI18n } from "@/lib/i18n/get-locale";
import { formatDueLabel } from "@/lib/i18n/messages";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.client.tasks.title };
}

export default async function ClientTasksPage() {
  const { user, profile, supabase } = await requireProfile(["client", "admin"]);
  const { locale, t } = await getI18n();
  const T = t.client.tasks;

  let query = supabase
    .from("tasks")
    .select(
      "id, title, status, due_at, providers!assigned_provider_id(name), properties!property_id(name)",
    )
    .order("created_at", { ascending: false });

  if (profile.role === "client") {
    query = query.eq("client_id", user.id);
  }

  const { data: tasks } = await query;

  return (
    <PersonaShell
      role={profile.role}
      displayName={profile.display_name}
      email={user.email}
      title={T.title}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-ink">{T.title}</h1>
          <p className="mt-1 text-ink-muted">{T.subtitle}</p>
        </div>
        <Link href="/client/tasks/new">
          <Button>{T.newTask}</Button>
        </Link>
      </div>

      {!tasks?.length ? (
        <EmptyState
          title={T.emptyTitle}
          description={T.emptyDesc}
          actionLabel={T.newTask}
        />
      ) : (
        <div className="border-t border-line">
          {tasks.map((task) => {
            const provider = Array.isArray(task.providers)
              ? task.providers[0]
              : task.providers;
            const property = Array.isArray(task.properties)
              ? task.properties[0]
              : task.properties;
            return (
              <TaskRow
                key={task.id}
                href={`/client/tasks/${task.id}`}
                title={`${task.title}${property?.name ? ` · ${property.name}` : ""}`}
                dueLabel={formatDueLabel(task.due_at, locale, t)}
                providerName={provider?.name}
                status={task.status as TaskStatus}
              />
            );
          })}
        </div>
      )}
    </PersonaShell>
  );
}
