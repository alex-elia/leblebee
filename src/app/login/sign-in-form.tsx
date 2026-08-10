"use client";

import { authCallbackUrl, getClientAppOrigin } from "@/lib/auth/app-origin";
import { otpSentMessage } from "@/lib/auth/magic-link-messages";
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

type Step = "email" | "code";

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
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function sendCode(targetEmail: string) {
    const origin = getClientAppOrigin();
    const supabase = createClient();
    const isAdmin = isAdminEmail(targetEmail);
    return supabase.auth.signInWithOtp({
      email: targetEmail,
      options: {
        emailRedirectTo: authCallbackUrl(
          origin,
          isAdmin ? homePathForRole("admin") : nextPath,
        ),
        shouldCreateUser: isAdmin,
        ...(isAdmin ? { data: { role: "admin" } } : {}),
      },
    });
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setState({});

    const form = event.currentTarget;
    const nextEmail = String(new FormData(form).get("email") ?? "")
      .trim()
      .toLowerCase();

    if (!nextEmail || !nextEmail.includes("@")) {
      setState({ error: common.invalidEmail });
      setPending(false);
      return;
    }

    const isAdmin = isAdminEmail(nextEmail);
    const { error } = await sendCode(nextEmail);
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

    setEmail(nextEmail);
    setStep("code");
    setState({
      ok: true,
      message: otpSentMessage(getClientAppOrigin(), auth),
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

    const redirectTo =
      nextPath ||
      (isAdminEmail(email) ? homePathForRole("admin") : "/dashboard");
    window.location.href = redirectTo;
  }

  async function handleResend() {
    setPending(true);
    setState({});
    const { error } = await sendCode(email);
    setPending(false);
    if (error) {
      setState({ error: error.message });
      return;
    }
    setState({
      ok: true,
      message: otpSentMessage(getClientAppOrigin(), auth),
    });
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
            {pending ? common.sending : auth.otpVerifyButton}
          </Button>
        </form>
        <div className="flex flex-wrap gap-3 text-sm">
          <button
            type="button"
            className="font-semibold text-olive hover:underline"
            onClick={() => void handleResend()}
            disabled={pending}
          >
            {auth.otpResend}
          </button>
          <button
            type="button"
            className="text-ink-muted hover:text-ink"
            onClick={() => {
              setStep("email");
              setState({});
            }}
          >
            {auth.otpChangeEmail}
          </button>
        </div>
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
        label={common.email}
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder={common.emailPlaceholder}
        hint={auth.otpHint}
      />
      <Button type="submit" disabled={pending}>
        {pending ? common.sending : auth.otpSendButton}
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
      <p className="text-sm text-ink-muted">
        {auth.newHere}{" "}
        <Link href="/register" className="font-semibold text-olive hover:underline">
          {auth.createAccountLink}
        </Link>
      </p>
      <p className="text-sm text-ink-muted">
        <Link href="/auth/reset" className="font-semibold text-olive hover:underline">
          {auth.resetSessionLink}
        </Link>
      </p>
    </form>
  );
}
