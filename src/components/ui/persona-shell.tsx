import Link from "next/link";
import { type ReactNode } from "react";
import { signOut } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import type { UserRole } from "@/lib/auth/roles";
import { homePathForRole } from "@/lib/auth/roles";
import { getI18n } from "@/lib/i18n/get-locale";
import type { Messages } from "@/lib/i18n/messages";

type NavItem = { href: string; label: string };

function navForRole(role: UserRole, t: Messages): NavItem[] {
  switch (role) {
    case "admin":
      return [
        { href: "/admin", label: t.nav.overview },
        { href: "/client/properties", label: t.nav.properties },
        { href: "/client/suppliers", label: t.nav.suppliers },
        { href: "/client/tasks", label: t.nav.tasks },
        { href: "/design-system", label: t.nav.designSystem },
      ];
    case "client":
      return [
        { href: "/client", label: t.nav.home },
        { href: "/client/properties", label: t.nav.properties },
        { href: "/client/suppliers", label: t.nav.suppliers },
        { href: "/client/tasks", label: t.nav.tasks },
      ];
    case "supplier":
      return [{ href: "/supplier", label: t.nav.myTasks }];
  }
}

export async function PersonaShell({
  children,
  role,
  displayName,
  email,
  title,
}: {
  children: ReactNode;
  role: UserRole;
  displayName?: string | null;
  email?: string | null;
  title?: string;
}) {
  const { locale, t } = await getI18n();
  const nav = navForRole(role, t);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 pb-10 pt-6 sm:px-6">
      <header className="mb-8 flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={homePathForRole(role)}
            className="font-display text-2xl tracking-tight text-ink"
          >
            Leblebee
          </Link>
          <p className="mt-0.5 text-sm text-ink-muted">
            {t.roles[role]}
            {displayName ? ` · ${displayName}` : ""}
            {email ? ` · ${email}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-ink-muted">
            {title ? (
              <span className="hidden text-ink sm:inline">{title}</span>
            ) : null}
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-olive">
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={signOut}>
            <Button
              variant="ghost"
              type="submit"
              className="!min-h-0 px-2 py-1 text-sm"
            >
              {t.nav.signOut}
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
