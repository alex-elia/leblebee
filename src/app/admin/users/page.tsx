import { PersonaShell } from "@/components/ui/persona-shell";
import { listPlatformUsers } from "@/lib/admin/users";
import { requireProfile } from "@/lib/auth/session";
import { getI18n } from "@/lib/i18n/get-locale";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.users.title };
}

export default async function AdminUsersPage() {
  const { user, profile, supabase } = await requireProfile(["admin"]);
  const { locale, t } = await getI18n();
  const U = t.admin.users;

  const users = await listPlatformUsers(supabase);

  return (
    <PersonaShell
      role="admin"
      displayName={profile.display_name}
      email={user.email}
      title={U.title}
    >
      <h1 className="font-display text-4xl text-ink">{U.title}</h1>
      <p className="mt-2 text-ink-muted">{U.subtitle}</p>

      {!users.length ? (
        <p className="mt-8 text-sm text-ink-muted">{U.empty}</p>
      ) : (
        <div className="mt-8 overflow-x-auto border-t border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-muted">
                <th className="py-3 pr-4 font-semibold">{U.colName}</th>
                <th className="py-3 pr-4 font-semibold">{U.colEmail}</th>
                <th className="py-3 pr-4 font-semibold">{U.colRole}</th>
                <th className="py-3 pr-4 font-semibold">{U.colLanguage}</th>
                <th className="py-3 font-semibold">{U.colJoined}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((row) => (
                <tr key={row.id}>
                  <td className="py-3 pr-4 font-semibold text-ink">
                    {row.display_name ?? U.unnamed}
                  </td>
                  <td className="py-3 pr-4 text-ink-muted">
                    {row.email ?? U.noEmail}
                  </td>
                  <td className="py-3 pr-4">{t.roles[row.role]}</td>
                  <td className="py-3 pr-4 uppercase">{row.preferred_language}</td>
                  <td className="py-3 text-ink-muted">
                    {new Date(row.created_at).toLocaleDateString(locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PersonaShell>
  );
}
