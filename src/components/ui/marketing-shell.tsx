import Link from "next/link";
import { type ReactNode } from "react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import type { Locale } from "@/lib/i18n/locales";
import type { Messages } from "@/lib/i18n/messages";

export function MarketingShell({
  children,
  locale,
  t,
  fullBleed = false,
}: {
  children: ReactNode;
  locale: Locale;
  t: Messages;
  fullBleed?: boolean;
}) {
  return (
    <div className="flex min-h-full w-full flex-col">
      <header
        className={`z-20 flex items-center justify-between gap-3 px-4 py-4 sm:px-6 ${
          fullBleed
            ? "absolute inset-x-0 top-0 text-foam"
            : "border-b border-line bg-foam/70 backdrop-blur-sm"
        }`}
      >
        <Link
          href="/"
          className={`font-display text-2xl tracking-tight ${
            fullBleed ? "text-foam drop-shadow-sm" : "text-ink"
          }`}
        >
          Leblebee
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher
            locale={locale}
            className={
              fullBleed
                ? "border-foam/30 bg-ink/25 text-foam [&_button:not([aria-pressed=true])]:text-foam/85 [&_button:not([aria-pressed=true])]:hover:bg-foam/15 [&_button:not([aria-pressed=true])]:hover:text-foam"
                : ""
            }
          />
          <nav
            className={`flex items-center gap-3 text-sm font-semibold ${
              fullBleed ? "text-foam/90" : "text-ink-muted"
            }`}
          >
            <Link
              href="/login"
              className={fullBleed ? "hover:text-foam" : "hover:text-olive"}
            >
              {t.nav.signIn}
            </Link>
            <Link
              href="/register"
              className={`hidden sm:inline ${
                fullBleed ? "hover:text-foam" : "hover:text-olive"
              }`}
            >
              {t.nav.register}
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
