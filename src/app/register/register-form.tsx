"use client";

import { authCallbackUrl } from "@/lib/auth/app-origin";
import { magicLinkSentMessage } from "@/lib/auth/magic-link-messages";
import {
  homePathForRole,
  isAdminEmail,
  isRegistrableRole,
  type UserRole,
} from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/client";
import { Button, TextField } from "@/components/ui";
import Link from "next/link";
import { useState, type FormEvent } from "react";

type FormState = {
  ok?: boolean;
  error?: string;
  message?: string;
};

export function RegisterForm() {
  const [state, setState] = useState<FormState>({});
  const [pending, setPending] = useState(false);
  const [persona, setPersona] = useState<"client" | "supplier" | "">("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setState({});

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const displayName = String(formData.get("display_name") ?? "").trim();
    const personaValue = String(formData.get("persona") ?? "")
      .trim()
      .toLowerCase();

    if (!email || !email.includes("@")) {
      setState({ error: "Enter a valid email address." });
      setPending(false);
      return;
    }

    if (isAdminEmail(email)) {
      setState({
        error: "This email is reserved for admin. Use Sign in instead.",
      });
      setPending(false);
      return;
    }

    if (!isRegistrableRole(personaValue)) {
      setState({
        error: "Choose whether you are a Client (property owner) or a Supplier.",
      });
      setPending(false);
      return;
    }

    const role: UserRole = personaValue;
    const origin = window.location.origin;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: authCallbackUrl(origin, homePathForRole(role)),
        data: {
          role,
          ...(displayName ? { display_name: displayName } : {}),
        },
        shouldCreateUser: true,
      },
    });

    setPending(false);

    if (error) {
      setState({ error: error.message });
      return;
    }

    setState({
      ok: true,
      message: magicLinkSentMessage(origin, true),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-5">
      <TextField
        label="Display name"
        name="display_name"
        autoComplete="name"
        placeholder="Maria"
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        hint="We’ll email a magic link to finish creating your account."
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-ink">I am a…</legend>
        <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-sm)] border border-line bg-foam px-3 py-3 has-[:checked]:border-olive has-[:checked]:bg-olive-soft/40">
          <input
            type="radio"
            name="persona"
            value="client"
            checked={persona === "client"}
            onChange={() => setPersona("client")}
            className="mt-1"
            required
          />
          <span>
            <span className="block font-semibold text-ink">Client</span>
            <span className="text-sm text-ink-muted">
              Property owner — manage properties and send tasks to suppliers.
            </span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-sm)] border border-line bg-foam px-3 py-3 has-[:checked]:border-olive has-[:checked]:bg-olive-soft/40">
          <input
            type="radio"
            name="persona"
            value="supplier"
            checked={persona === "supplier"}
            onChange={() => setPersona("supplier")}
            className="mt-1"
            required
          />
          <span>
            <span className="block font-semibold text-ink">Supplier</span>
            <span className="text-sm text-ink-muted">
              Local provider — receive tasks, leave handoff notes and photos.
            </span>
          </span>
        </label>
      </fieldset>

      <Button type="submit" disabled={pending || !persona}>
        {pending ? "Sending…" : "Create account"}
      </Button>
      {state.error ? (
        <p className="text-sm font-semibold text-coral" role="alert">
          {state.error}{" "}
          {state.error.includes("Sign in") ? (
            <Link href="/login" className="underline">
              Sign in
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
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-olive hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
