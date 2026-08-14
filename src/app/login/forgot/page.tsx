import { AppShell } from "@/components/ui/app-shell";
import { ForgotPasswordForm } from "./forgot-password-form";
import { getI18n } from "@/lib/i18n/get-locale";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.auth.forgotPasswordTitle };
}

export default async function ForgotPasswordPage() {
  const { t } = await getI18n();

  return (
    <AppShell>
      <section className="flex flex-col gap-6 pt-4">
        <div>
          <h1 className="font-display text-4xl text-ink">
            {t.auth.forgotPasswordTitle}
          </h1>
          <p className="mt-2 max-w-md text-ink-muted">
            {t.auth.forgotPasswordSubtitle}
          </p>
        </div>
        <ForgotPasswordForm auth={t.auth} common={t.common} />
      </section>
    </AppShell>
  );
}
