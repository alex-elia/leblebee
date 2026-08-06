import Link from "next/link";
import { type ReactNode } from "react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { getI18n } from "@/lib/i18n/get-locale";

/** Public / unauthenticated chrome — no design-system link. */
export async function AppShell({ children }: { children: ReactNode }) {
  const { locale, t } = await getI18n();

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 pb-10 pt-6 sm:px-6">
      <header className="mb-8 flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-2xl tracking-tight text-ink">
          Leblebee
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <nav className="flex items-center gap-3 text-sm font-semibold text-ink-muted">
            <Link href="/login" className="hover:text-olive">
              {t.nav.signIn}
            </Link>
            <Link href="/register" className="hover:text-olive">
              {t.nav.register}
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
