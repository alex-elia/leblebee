export const LOCALES = ["en", "fr", "el"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_COOKIE = "leblebee_locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  el: "EL",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function normalizeLocale(value: string | undefined | null): Locale {
  if (isLocale(value)) return value;
  return "en";
}
