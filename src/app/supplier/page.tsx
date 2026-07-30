import { PersonaShell } from "@/components/ui/persona-shell";
import { EmptyState, TaskRow } from "@/components/ui";
import type { TaskStatus } from "@/components/ui/status-chip";
import { requireProfile } from "@/lib/auth/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My tasks",
};

export default async function SupplierHomePage() {
  const { user, profile, supabase } = await requireProfile(["supplier", "admin"]);

  const { data: providerRows } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id);

  const providerIds = (providerRows ?? []).map((p) => p.id);

  const { data: tasks } =
    providerIds.length > 0
      ? await supabase
          .from("tasks")
          .select(
            "id, title, status, due_at, properties!property_id(name)",
          )
          .in("assigned_provider_id", providerIds)
          .order("created_at", { ascending: false })
      : { data: [] as never[] };

  return (
    <PersonaShell
      role={profile.role}
      displayName={profile.display_name}
      email={user.email}
    >
      <h1 className="font-display text-4xl text-ink">My tasks</h1>
      <p className="mt-2 max-w-lg text-ink-muted">
        Instructions appear in your language. Reply anytime — we translate for
        the owner.
      </p>

      {!tasks?.length ? (
        <div className="mt-6">
          <EmptyState
            title="No assigned tasks yet"
            description="When an owner sends you work, it shows up here."
          />
        </div>
      ) : (
        <div className="mt-6 border-t border-line">
          {tasks.map((t) => {
            const property = Array.isArray(t.properties)
              ? t.properties[0]
              : t.properties;
            return (
              <TaskRow
                key={t.id}
                href={`/supplier/tasks/${t.id}`}
                title={`${t.title}${property?.name ? ` · ${property.name}` : ""}`}
                dueLabel={
                  t.due_at
                    ? `Due ${new Date(t.due_at).toLocaleString()}`
                    : "No due date"
                }
                status={t.status as TaskStatus}
              />
            );
          })}
        </div>
      )}
    </PersonaShell>
  );
}
