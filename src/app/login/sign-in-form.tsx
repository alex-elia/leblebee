"use client";

import { authCallbackUrl } from "@/lib/auth/app-origin";
import { magicLinkSentMessage } from "@/lib/auth/magic-link-messages";
import { homePathForRole, isAdminEmail } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/client";
import { Button, TextField } from "@/components/ui";
import type { Messages } from "@/lib/i18n/messages";
import Link from "next/link";
import { useState, type FormEvent } from "react";

type FormState = {
  ok?: boolean;
  error?: string;
  message?: string;
};

export function SignInForm({
  nextPath,
  auth,
  common,
  nav,
}: {
  nextPath: string;
  auth: Messages["auth"];
  common: Messages["common"];
  nav: Messages["nav"];
}) {
  const [state, setState] = useState<FormState>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setState({});

    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "")
      .trim()
      .toLowerCase();

    if (!email || !email.includes("@")) {
      setState({ error: common.invalidEmail });
      setPending(false);
      return;
    }

    const origin = window.location.origin;
    const supabase = createClient();
    const isAdmin = isAdminEmail(email);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: authCallbackUrl(
          origin,
          isAdmin ? homePathForRole("admin") : nextPath,
        ),
        // Admin cannot self-register on /register; first sign-in must create auth user.
        shouldCreateUser: isAdmin,
        ...(isAdmin ? { data: { role: "admin" } } : {}),
      },
    });

    setPending(false);

    if (error) {
      const msg = error.message.toLowerCase();
      if (
        !isAdmin &&
        (msg.includes("signups not allowed") ||
          msg.includes("user not found") ||
          msg.includes("unable to validate"))
      ) {
        setState({ error: auth.noAccount });
        return;
      }
      setState({ error: error.message });
      return;
    }

    setState({
      ok: true,
      message: magicLinkSentMessage(origin, auth),
    });
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
        hint={auth.magicLinkHint}
      />
      <Button type="submit" disabled={pending}>
        {pending ? common.sending : auth.magicLinkButton}
      </Button>
      {state.error ? (
        <p className="text-sm font-semibold text-coral" role="alert">
          {state.error}{" "}
          {state.error === auth.noAccount ? (
            <Link href="/register" className="underline">
              {nav.register}
            </Link>
          ) : null}
        </p>
      ) : null}
      {state.message ? (
        <p className="rounded-[var(--radius-sm)] bg-olive-soft/60 px-3 py-2 text-sm text-olive">
          {state.message}
        </p>
      ) : null}
      <p className="text-sm text-ink-muted">
        {auth.newHere}{" "}
        <Link href="/register" className="font-semibold text-olive hover:underline">
          {auth.createAccountLink}
        </Link>
      </p>
    </form>
  );
}
