import { IntroForm } from "@/app/admin/intros/intro-form";
import { PersonaShell } from "@/components/ui/persona-shell";
import { listPlatformUsers } from "@/lib/admin/users";
import { requireProfile } from "@/lib/auth/session";
import { getI18n } from "@/lib/i18n/get-locale";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.intros.title };
}

export default async function AdminIntrosPage() {
  const { user, profile, supabase } = await requireProfile(["admin"]);
  const { t } = await getI18n();
  const A = t.admin.intros;

  const users = await listPlatformUsers(supabase);

  const clients = users
    .filter((u) => u.role === "client")
    .map((u) => ({
      id: u.id,
      displayName: u.display_name ?? A.unnamedClient,
      email: u.email,
      label: `${u.display_name ?? A.unnamedClient}${u.email ? ` · ${u.email}` : ""}`,
    }));

  const suppliers = users
    .filter((u) => u.role === "supplier")
    .map((u) => ({
      id: u.id,
      displayName: u.display_name ?? A.unnamedSupplier,
      email: u.email,
      label: `${u.display_name ?? A.unnamedSupplier}${u.email ? ` · ${u.email}` : ""}`,
    }));

  return (
    <PersonaShell
      role="admin"
      displayName={profile.display_name}
      email={user.email}
      title={A.title}
    >
      <h1 className="font-display text-4xl text-ink">{A.title}</h1>
      <p className="mt-2 max-w-lg text-ink-muted">{A.subtitle}</p>

      {clients.length === 0 || suppliers.length === 0 ? (
        <p className="mt-6 text-sm font-semibold text-coral">{A.needBothRoles}</p>
      ) : (
        <div className="mt-8">
          <IntroForm clients={clients} suppliers={suppliers} t={t} />
        </div>
      )}
    </PersonaShell>
  );
}
