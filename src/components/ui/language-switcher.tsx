"use client";

import { setLocale } from "@/app/actions/locale";
import {
  LOCALES,
  LOCALE_LABELS,
  type Locale,
} from "@/lib/i18n/locales";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LanguageSwitcher({
  locale,
  className = "",
}: {
  locale: Locale;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-[var(--radius-sm)] border border-line bg-foam/80 p-0.5 text-xs font-semibold ${className}`}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            disabled={pending || active}
            onClick={() => {
              startTransition(async () => {
                await setLocale(code);
                router.refresh();
              });
            }}
            className={`tap-target min-h-8 min-w-8 rounded-[6px] px-2 transition-colors ${
              active
                ? "bg-olive text-foam"
                : "text-ink-muted hover:bg-sand-deep hover:text-ink"
            } disabled:opacity-100`}
            aria-pressed={active}
          >
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
