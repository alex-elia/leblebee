"use client";

import { authCallbackUrl, getClientAppOrigin } from "@/lib/auth/app-origin";
import { otpSentMessage } from "@/lib/auth/magic-link-messages";
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

type Step = "details" | "code";

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
  const [step, setStep] = useState<Step>("details");
  const [pending, setPending] = useState(false);
  const [persona, setPersona] = useState<"client" | "supplier" | "">("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("client");

  async function sendCode(input: {
    email: string;
    role: UserRole;
    displayName: string;
  }) {
    const origin = getClientAppOrigin();
    const supabase = createClient();
    return supabase.auth.signInWithOtp({
      email: input.email,
      options: {
        emailRedirectTo: authCallbackUrl(origin, homePathForRole(input.role)),
        data: {
          role: input.role,
          ...(input.displayName ? { display_name: input.displayName } : {}),
        },
        shouldCreateUser: true,
      },
    });
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setState({});

    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextEmail = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const displayName = String(formData.get("display_name") ?? "").trim();
    const personaValue = String(formData.get("persona") ?? "")
      .trim()
      .toLowerCase();

    if (!nextEmail || !nextEmail.includes("@")) {
      setState({ error: common.invalidEmail });
      setPending(false);
      return;
    }

    if (isAdminEmail(nextEmail)) {
      setState({ error: auth.adminEmailReserved });
      setPending(false);
      return;
    }

    if (!isRegistrableRole(personaValue)) {
      setState({ error: auth.choosePersona });
      setPending(false);
      return;
    }

    const nextRole: UserRole = personaValue;
    const { error } = await sendCode({
      email: nextEmail,
      role: nextRole,
      displayName,
    });
    setPending(false);

    if (error) {
      setState({ error: error.message });
      return;
    }

    setEmail(nextEmail);
    setRole(nextRole);
    setStep("code");
    setState({
      ok: true,
      message: otpSentMessage(getClientAppOrigin(), auth, true),
    });
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setState({});

    const token = String(new FormData(event.currentTarget).get("otp") ?? "")
      .trim()
      .replace(/\s/g, "");

    if (!token) {
      setState({ error: auth.otpCodeRequired });
      setPending(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      setPending(false);
      setState({ error: error.message });
      return;
    }

    window.location.href = homePathForRole(role);
  }

  if (step === "code") {
    return (
      <div className="flex max-w-md flex-col gap-5">
        {state.message ? (
          <p className="rounded-[var(--radius-sm)] bg-olive-soft/60 px-3 py-2 text-sm text-olive">
            {state.message}
          </p>
        ) : null}
        <p className="text-sm text-ink-muted">
          {auth.otpSentTo}{" "}
          <span className="font-semibold text-ink">{email}</span>
        </p>
        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          <TextField
            label={auth.otpCodeLabel}
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            placeholder={auth.otpCodePlaceholder}
            hint={auth.otpCodeHint}
          />
          <Button type="submit" disabled={pending}>
            {pending ? common.sending : auth.registerOtpVerifyButton}
          </Button>
        </form>
        <button
          type="button"
          className="text-left text-sm font-semibold text-olive hover:underline"
          onClick={() => {
            setStep("details");
            setState({});
          }}
        >
          {auth.otpChangeEmail}
        </button>
        {state.error ? (
          <p className="text-sm font-semibold text-coral" role="alert">
            {state.error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="flex max-w-md flex-col gap-5">
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
        hint={auth.registerOtpHint}
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
        {pending ? common.sending : auth.registerOtpSendButton}
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
      <p className="text-sm text-ink-muted">
        {auth.alreadyHaveAccount}{" "}
        <Link href="/login" className="font-semibold text-olive hover:underline">
          {nav.signIn}
        </Link>
      </p>
    </form>
  );
}
