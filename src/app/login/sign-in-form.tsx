"use client";

import { authCallbackUrl } from "@/lib/auth/app-origin";
import { magicLinkSentMessage } from "@/lib/auth/magic-link-messages";
import { createClient } from "@/lib/supabase/client";
import { Button, TextField } from "@/components/ui";
import Link from "next/link";
import { useState, type FormEvent } from "react";

type FormState = {
  ok?: boolean;
  error?: string;
  message?: string;
};

export function SignInForm({ nextPath }: { nextPath: string }) {
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
      setState({ error: "Enter a valid email address." });
      setPending(false);
      return;
    }

    const origin = window.location.origin;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: authCallbackUrl(origin, nextPath),
        shouldCreateUser: false,
      },
    });

    setPending(false);

    if (error) {
      const msg = error.message.toLowerCase();
      if (
        msg.includes("signups not allowed") ||
        msg.includes("user not found") ||
        msg.includes("unable to validate")
      ) {
        setState({
          error: "No account for this email. Create one first.",
        });
        return;
      }
      setState({ error: error.message });
      return;
    }

    setState({
      ok: true,
      message: magicLinkSentMessage(origin),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-5">
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        hint="We’ll email a one-time magic link. No password."
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Email me a magic link"}
      </Button>
      {state.error ? (
        <p className="text-sm font-semibold text-coral" role="alert">
          {state.error}{" "}
          {state.error.includes("Create one") ? (
            <Link href="/register" className="underline">
              Register
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
        New here?{" "}
        <Link href="/register" className="font-semibold text-olive hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
