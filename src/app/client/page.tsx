import { PersonaShell } from "@/components/ui/persona-shell";
import { Button, EmptyState } from "@/components/ui";
import { requireProfile } from "@/lib/auth/session";
import { getI18n } from "@/lib/i18n/get-locale";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.nav.home };
}

export default async function ClientHomePage() {
  const { user, profile, supabase } = await requireProfile(["client", "admin"]);
  const { t } = await getI18n();
  const H = t.client.home;

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
        {H.titleHello}
        {profile.display_name ? `, ${profile.display_name}` : ""}
      </h1>
      <p className="mt-2 text-ink-muted">{H.subtitle}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label={H.statProperties} value={propertyCount ?? 0} href="/client/properties" />
        <Stat label={H.statSuppliers} value={supplierCount ?? 0} href="/client/suppliers" />
        <Stat label={H.statOpenTasks} value={taskCount ?? 0} href="/client/tasks" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/client/tasks/new">
          <Button>{H.newTask}</Button>
        </Link>
        <Link href="/client/suppliers/new">
          <Button variant="secondary">{H.addSupplier}</Button>
        </Link>
      </div>

      {(propertyCount ?? 0) === 0 ? (
        <div className="mt-8">
          <EmptyState title={H.emptyTitle} description={H.emptyDesc} />
          <Link href="/client/properties/new" className="mt-2 inline-block">
            <Button>{H.newProperty}</Button>
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
