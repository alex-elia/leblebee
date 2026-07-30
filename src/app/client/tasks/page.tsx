import { PersonaShell } from "@/components/ui/persona-shell";
import { Button, EmptyState, TaskRow } from "@/components/ui";
import type { TaskStatus } from "@/components/ui/status-chip";
import { requireProfile } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tasks",
};

export default async function ClientTasksPage() {
  const { user, profile, supabase } = await requireProfile(["client", "admin"]);

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
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-ink">Tasks</h1>
          <p className="mt-1 text-ink-muted">
            Clear bilingual instructions — less back-and-forth.
          </p>
        </div>
        <Link href="/client/tasks/new">
          <Button>New task</Button>
        </Link>
      </div>

      {!tasks?.length ? (
        <EmptyState
          title="No tasks yet"
          description="Create a task for a supplier. AI helps clarify and translate."
          actionLabel="New task"
        />
      ) : (
        <div className="border-t border-line">
          {tasks.map((t) => {
            const provider = Array.isArray(t.providers)
              ? t.providers[0]
              : t.providers;
            const property = Array.isArray(t.properties)
              ? t.properties[0]
              : t.properties;
            return (
              <TaskRow
                key={t.id}
                href={`/client/tasks/${t.id}`}
                title={`${t.title}${property?.name ? ` · ${property.name}` : ""}`}
                dueLabel={
                  t.due_at
                    ? `Due ${new Date(t.due_at).toLocaleString()}`
                    : "No due date"
                }
                providerName={provider?.name}
                status={t.status as TaskStatus}
              />
            );
          })}
        </div>
      )}
    </PersonaShell>
  );
}
