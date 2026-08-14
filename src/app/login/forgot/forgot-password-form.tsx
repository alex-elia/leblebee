"use client";

import { getClientAppOrigin } from "@/lib/auth/app-origin";
import { createClient } from "@/lib/supabase/client";
import { Button, TextField } from "@/components/ui";
import type { Messages } from "@/lib/i18n/messages";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export function ForgotPasswordForm({
  auth,
  common,
}: {
  auth: Messages["auth"];
  common: Messages["common"];
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setMessage(null);

    const email = String(new FormData(event.currentTarget).get("email") ?? "")
      .trim()
      .toLowerCase();

    if (!email || !email.includes("@")) {
      setError(common.invalidEmail);
      setPending(false);
      return;
    }

    const origin = getClientAppOrigin();
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/login/reset-password")}`,
      },
    );

    setPending(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage(auth.forgotPasswordSent);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-5">
      <TextField
        label={common.email}
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder={common.emailPlaceholder}
        hint={auth.forgotPasswordHint}
      />
      <Button type="submit" disabled={pending}>
        {pending ? common.sending : auth.forgotPasswordButton}
      </Button>
      {error ? (
        <p className="text-sm font-semibold text-coral" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-[var(--radius-sm)] bg-olive-soft/60 px-3 py-2 text-sm text-olive">
          {message}
        </p>
      ) : null}
      <p className="text-sm text-ink-muted">
        <Link href="/login" className="font-semibold text-olive hover:underline">
          {auth.backToSignIn}
        </Link>
      </p>
    </form>
  );
}
