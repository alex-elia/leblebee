import { PersonaShell } from "@/components/ui/persona-shell";
import { Button, EmptyState } from "@/components/ui";
import { requireProfile } from "@/lib/auth/session";
import { getI18n } from "@/lib/i18n/get-locale";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.client.suppliers.title };
}

export default async function SuppliersPage() {
  const { user, profile, supabase } = await requireProfile(["client", "admin"]);
  const { t } = await getI18n();
  const S = t.client.suppliers;

  let query = supabase
    .from("providers")
    .select("id, name, email, language, specialties, user_id")
    .order("name", { ascending: true });

  if (profile.role === "client") {
    query = query.eq("client_id", user.id);
  }

  const { data: suppliers } = await query;

  return (
    <PersonaShell
      role={profile.role}
      displayName={profile.display_name}
      email={user.email}
      title={S.title}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-ink">{S.title}</h1>
          <p className="mt-1 text-ink-muted">{S.subtitle}</p>
        </div>
        <Link href="/client/suppliers/new">
          <Button>{S.addSupplier}</Button>
        </Link>
      </div>

      {!suppliers?.length ? (
        <EmptyState
          title={S.emptyTitle}
          description={S.emptyDesc}
          actionLabel={S.addSupplier}
        />
      ) : (
        <ul className="divide-y divide-line border-t border-line">
          {suppliers.map((s) => (
            <li key={s.id}>
              <Link
                href={`/client/suppliers/${s.id}`}
                className="block py-4 transition-colors hover:bg-foam/70"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{s.name}</p>
                    <p className="mt-0.5 text-sm text-ink-muted">
                      {(s.language ?? "el").toUpperCase()}
                      {s.email ? ` · ${s.email}` : ""}
                      {s.specialties?.length
                        ? ` · ${s.specialties.join(", ")}`
                        : ""}
                    </p>
                  </div>
                  {s.user_id ? (
                    <span className="rounded-full bg-olive-soft px-2 py-0.5 text-xs font-semibold text-olive">
                      {t.common.linked}
                    </span>
                  ) : (
                    <span className="rounded-full bg-sand-deep px-2 py-0.5 text-xs font-semibold text-ink-muted">
                      {t.common.contactOnly}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PersonaShell>
  );
}
