import { PersonaShell } from "@/components/ui/persona-shell";
import { EmptyState, TaskRow } from "@/components/ui";
import type { TaskStatus } from "@/components/ui/status-chip";
import { requireProfile } from "@/lib/auth/session";
import { getI18n } from "@/lib/i18n/get-locale";
import { formatDueLabel } from "@/lib/i18n/messages";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.supplier.home.title };
}

export default async function SupplierHomePage() {
  const { user, profile, supabase } = await requireProfile(["supplier", "admin"]);
  const { locale, t } = await getI18n();
  const H = t.supplier.home;

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
      title={H.title}
    >
      <h1 className="font-display text-4xl text-ink">{H.title}</h1>
      <p className="mt-2 max-w-lg text-ink-muted">{H.subtitle}</p>

      {!tasks?.length ? (
        <div className="mt-6">
          <EmptyState title={H.emptyTitle} description={H.emptyDesc} />
        </div>
      ) : (
        <div className="mt-6 border-t border-line">
          {tasks.map((task) => {
            const property = Array.isArray(task.properties)
              ? task.properties[0]
              : task.properties;
            return (
              <TaskRow
                key={task.id}
                href={`/supplier/tasks/${task.id}`}
                title={`${task.title}${property?.name ? ` · ${property.name}` : ""}`}
                dueLabel={formatDueLabel(task.due_at, locale, t)}
                status={task.status as TaskStatus}
              />
            );
          })}
        </div>
      )}
    </PersonaShell>
  );
}
