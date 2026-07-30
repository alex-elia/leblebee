import { PersonaShell } from "@/components/ui/persona-shell";
import { Button, EmptyState } from "@/components/ui";
import { requireProfile } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Client home",
};

export default async function ClientHomePage() {
  const { user, profile, supabase } = await requireProfile(["client", "admin"]);

  const clientFilter = profile.role === "client" ? user.id : null;

  const propQ = supabase
    .from("properties")
    .select("*", { count: "exact", head: true });
  const supQ = supabase
    .from("providers")
    .select("*", { count: "exact", head: true });
  const taskQ = supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .not("status", "in", '("closed","cancelled")');

  if (clientFilter) {
    propQ.eq("client_id", clientFilter);
    supQ.eq("client_id", clientFilter);
    taskQ.eq("client_id", clientFilter);
  }

  const [
    { count: propertyCount },
    { count: supplierCount },
    { count: taskCount },
  ] = await Promise.all([propQ, supQ, taskQ]);

  return (
    <PersonaShell
      role={profile.role}
      displayName={profile.display_name}
      email={user.email}
    >
      <h1 className="font-display text-4xl text-ink">
        Hello{profile.display_name ? `, ${profile.display_name}` : ""}
      </h1>
      <p className="mt-2 text-ink-muted">
        Manage properties and suppliers. Send clear bilingual tasks — AI helps
        with language and clarity.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Properties" value={propertyCount ?? 0} href="/client/properties" />
        <Stat label="Suppliers" value={supplierCount ?? 0} href="/client/suppliers" />
        <Stat label="Open tasks" value={taskCount ?? 0} href="/client/tasks" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/client/tasks/new">
          <Button>New task</Button>
        </Link>
        <Link href="/client/suppliers/new">
          <Button variant="secondary">Add supplier</Button>
        </Link>
      </div>

      {(propertyCount ?? 0) === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Add your first property"
            description="Then add a supplier and send your first bilingual task."
          />
          <Link href="/client/properties/new" className="mt-2 inline-block">
            <Button>New property</Button>
          </Link>
        </div>
      ) : null}
    </PersonaShell>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[var(--radius-md)] border border-line bg-foam px-4 py-3 transition-colors hover:bg-olive-soft/40"
    >
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="font-display text-3xl">{value}</p>
    </Link>
  );
}
