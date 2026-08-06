import { cookies, headers } from "next/headers";
import {
  LOCALE_COOKIE,
  LOCALES,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n/locales";
import { getMessages, type Messages } from "@/lib/i18n/messages";

function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const preferred = header
    .split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean);
  for (const tag of preferred) {
    const base = tag.slice(0, 2);
    if (LOCALES.includes(base as Locale)) return base as Locale;
  }
  return null;
}

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const fromCookie = jar.get(LOCALE_COOKIE)?.value;
  if (fromCookie) return normalizeLocale(fromCookie);

  const h = await headers();
  return localeFromAcceptLanguage(h.get("accept-language")) ?? "en";
}

export async function getI18n(): Promise<{ locale: Locale; t: Messages }> {
  const locale = await getLocale();
  return { locale, t: getMessages(locale) };
}
