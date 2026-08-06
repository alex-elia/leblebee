"use server";

import { LOCALE_COOKIE, isLocale, type Locale } from "@/lib/i18n/locales";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return;

  const jar = await cookies();
  jar.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ preferred_language: locale })
        .eq("id", user.id);
    }
  } catch {
    // Cookie still applies for anonymous visitors
  }

  revalidatePath("/", "layout");
}
