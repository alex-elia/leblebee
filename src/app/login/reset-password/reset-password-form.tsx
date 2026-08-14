"use client";

import { resolvePostLoginPath } from "@/lib/auth/post-login";
import { createClient } from "@/lib/supabase/client";
import { Button, TextField } from "@/components/ui";
import type { Messages } from "@/lib/i18n/messages";
import { useState, type FormEvent } from "react";

export function ResetPasswordForm({
  auth,
  common,
}: {
  auth: Messages["auth"];
  common: Messages["common"];
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const password = String(new FormData(event.currentTarget).get("password") ?? "");

    if (password.length < 6) {
      setError(auth.passwordTooShort);
      setPending(false);
      return;
    }

    const supabase = createClient();
    const { data, error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setPending(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    const email = data.user?.email ?? "";
    const redirectTo = await resolvePostLoginPath(supabase, email);
    window.location.href = redirectTo;
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-5">
      <TextField
        label={auth.newPasswordLabel}
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={6}
        placeholder={auth.passwordPlaceholder}
      />
      <Button type="submit" disabled={pending}>
        {pending ? common.sending : auth.resetPasswordButton}
      </Button>
      {error ? (
        <p className="text-sm font-semibold text-coral" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
