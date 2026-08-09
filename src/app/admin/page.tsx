import { PersonaShell } from "@/components/ui/persona-shell";
import { requireProfile } from "@/lib/auth/session";
import { getI18n } from "@/lib/i18n/get-locale";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.title };
}

export default async function AdminHomePage() {
  const { user, profile, supabase } = await requireProfile(["admin"]);
  const { t } = await getI18n();
  const A = t.admin;

  const [{ count: clients }, { count: suppliers }, { count: properties }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "client"),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "supplier"),
      supabase.from("properties").select("*", { count: "exact", head: true }),
    ]);

  return (
    <PersonaShell
      role="admin"
      displayName={profile.display_name}
      email={user.email}
      title={A.title}
    >
      <h1 className="font-display text-4xl text-ink">{A.title}</h1>
      <p className="mt-2 text-ink-muted">{A.subtitle}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label={A.statClients} value={clients ?? 0} />
        <Stat label={A.statSuppliers} value={suppliers ?? 0} />
        <Stat label={A.statProperties} value={properties ?? 0} />
      </div>

      <ul className="mt-8 space-y-2 text-sm font-semibold">
        <li>
          <Link className="text-olive hover:underline" href="/design-system">
            {A.openDesignSystem}
          </Link>
        </li>
        <li>
          <Link className="text-olive hover:underline" href="/client/properties">
            {A.browseProperties}
          </Link>
        </li>
        <li>
          <Link className="text-olive hover:underline" href="/admin/agent">
            {t.assistant.agentReports}
          </Link>
        </li>
      </ul>
    </PersonaShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-line bg-foam px-4 py-3">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="font-display text-3xl">{value}</p>
    </div>
  );
}
