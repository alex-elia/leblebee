import { PersonaShell } from "@/components/ui/persona-shell";
import { TaskCreateForm } from "../task-create-form";
import { groupPlaybookRows, type PropertyPlaybook } from "@/lib/properties/playbook";
import { requireProfile } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "New task",
};

export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ supplier?: string; property?: string }>;
}) {
  const params = await searchParams;
  const { user, profile, supabase } = await requireProfile(["client", "admin"]);

  let propQuery = supabase.from("properties").select("id, name").order("name");
  let supQuery = supabase
    .from("providers")
    .select("id, name, language")
    .order("name");

  if (profile.role === "client") {
    propQuery = propQuery.eq("client_id", user.id);
    supQuery = supQuery.eq("client_id", user.id);
  }

  const [{ data: properties }, { data: suppliers }] = await Promise.all([
    propQuery,
    supQuery,
  ]);

  const propertyIds = (properties ?? []).map((p) => p.id);
  const playbooks: Record<string, PropertyPlaybook> = {};
  if (propertyIds.length > 0) {
    const { data: memory } = await supabase
      .from("property_memory")
      .select("property_id, bullet, kind, sort_order")
      .in("property_id", propertyIds)
      .order("sort_order");

    for (const id of propertyIds) {
      playbooks[id] = groupPlaybookRows(
        (memory ?? []).filter((m) => m.property_id === id),
      );
    }
  }

  return (
    <PersonaShell
      role={profile.role}
      displayName={profile.display_name}
      email={user.email}
    >
      <p className="mb-4 text-sm font-semibold text-ink-muted">
        <Link href="/client/tasks" className="hover:text-olive">
          ← Tasks
        </Link>
      </p>
      <h1 className="font-display mb-2 text-4xl text-ink">New task</h1>
      <p className="mb-6 max-w-lg text-ink-muted">
        Apartment standard is included automatically. Add only what’s special
        for this visit — AI clarifies and translates for the supplier.
      </p>

      {!properties?.length || !suppliers?.length ? (
        <p className="text-ink-muted">
          Add at least one{" "}
          <Link
            href="/client/properties/new"
            className="font-semibold text-olive"
          >
            property
          </Link>{" "}
          and one{" "}
          <Link
            href="/client/suppliers/new"
            className="font-semibold text-olive"
          >
            supplier
          </Link>{" "}
          first.
        </p>
      ) : (
        <TaskCreateForm
          properties={properties.map((p) => ({ id: p.id, label: p.name }))}
          suppliers={suppliers.map((s) => ({
            id: s.id,
            label: s.name,
            language: s.language,
          }))}
          playbooks={playbooks}
          defaultSupplierId={params.supplier}
          defaultPropertyId={params.property}
          clientLang={profile.preferred_language ?? "en"}
        />
      )}
    </PersonaShell>
  );
}
