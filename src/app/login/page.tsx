import { AppShell } from "@/components/ui/app-shell";
import { clearSupabaseAuthCookies } from "@/lib/auth/clear-auth-cookies";
import { SignInForm } from "./sign-in-form";
import { getI18n } from "@/lib/i18n/get-locale";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.auth.signInTitle };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { t } = await getI18n();
  const params = await searchParams;
  const nextPath =
    params.next && params.next.startsWith("/") ? params.next : "";

  if (params.error) {
    await clearSupabaseAuthCookies();
  }

  return (
    <AppShell>
      <section className="flex flex-col gap-6 pt-4">
        <div>
          <h1 className="font-display text-4xl text-ink">{t.auth.signInTitle}</h1>
          <p className="mt-2 max-w-md text-ink-muted">{t.auth.signInSubtitle}</p>
        </div>
        {params.error ? (
          <p className="text-sm font-semibold text-coral">
            {params.error === "session_reset"
              ? t.auth.sessionResetDone
              : t.auth.signInError}
            {params.error !== "auth" && params.error !== "session_reset"
              ? ` (${params.error})`
              : ""}
            .
          </p>
        ) : null}
        <SignInForm nextPath={nextPath} auth={t.auth} common={t.common} nav={t.nav} />
      </section>
    </AppShell>
  );
}
