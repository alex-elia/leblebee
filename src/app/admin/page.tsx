import { PersonaShell } from "@/components/ui/persona-shell";
import { requireProfile } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminHomePage() {
  const { user, profile, supabase } = await requireProfile(["admin"]);

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
      title="Admin"
    >
      <h1 className="font-display text-4xl text-ink">Admin</h1>
      <p className="mt-2 text-ink-muted">
        Platform overview. Design system is available only here.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Clients" value={clients ?? 0} />
        <Stat label="Suppliers" value={suppliers ?? 0} />
        <Stat label="Properties" value={properties ?? 0} />
      </div>

      <ul className="mt-8 space-y-2 text-sm font-semibold">
        <li>
          <Link className="text-olive hover:underline" href="/design-system">
            Open design system →
          </Link>
        </li>
        <li>
          <Link className="text-olive hover:underline" href="/client/properties">
            Browse properties →
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
