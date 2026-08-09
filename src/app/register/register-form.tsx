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
import type { Messages } from "@/lib/i18n/messages";
import Link from "next/link";
import { useState, type FormEvent } from "react";

type FormState = {
  ok?: boolean;
  error?: string;
  message?: string;
};

export function RegisterForm({
  auth,
  common,
  nav,
}: {
  auth: Messages["auth"];
  common: Messages["common"];
  nav: Messages["nav"];
}) {
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
      setState({ error: common.invalidEmail });
      setPending(false);
      return;
    }

    if (isAdminEmail(email)) {
      setState({ error: auth.adminEmailReserved });
      setPending(false);
      return;
    }

    if (!isRegistrableRole(personaValue)) {
      setState({ error: auth.choosePersona });
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
      message: magicLinkSentMessage(origin, auth, true),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-5">
      <TextField
        label={auth.displayName}
        name="display_name"
        autoComplete="name"
        placeholder={auth.displayNamePlaceholder}
      />
      <TextField
        label={common.email}
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder={common.emailPlaceholder}
        hint={auth.registerMagicHint}
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-semibold text-ink">{auth.personaLegend}</legend>
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
            <span className="block font-semibold text-ink">{auth.clientTitle}</span>
            <span className="text-sm text-ink-muted">{auth.clientDesc}</span>
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
            <span className="block font-semibold text-ink">{auth.supplierTitle}</span>
            <span className="text-sm text-ink-muted">{auth.supplierDesc}</span>
          </span>
        </label>
      </fieldset>

      <Button type="submit" disabled={pending || !persona}>
        {pending ? common.sending : auth.createAccountButton}
      </Button>
      {state.error ? (
        <p className="text-sm font-semibold text-coral" role="alert">
          {state.error}{" "}
          {state.error === auth.adminEmailReserved ? (
            <Link href="/login" className="underline">
              {nav.signIn}
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
        {auth.alreadyHaveAccount}{" "}
        <Link href="/login" className="font-semibold text-olive hover:underline">
          {nav.signIn}
        </Link>
      </p>
    </form>
  );
}
