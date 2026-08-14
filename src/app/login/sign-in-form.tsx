"use client";

import { authCallbackUrl, getClientAppOrigin } from "@/lib/auth/app-origin";
import { magicLinkSentMessage } from "@/lib/auth/magic-link-messages";
import {
  mapPasswordSignInError,
  resolvePostLoginPath,
} from "@/lib/auth/post-login";
import { homePathForRole, isAdminEmail } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/client";
import { Button, TextField } from "@/components/ui";
import type { Messages } from "@/lib/i18n/messages";
import Link from "next/link";
import { useState, type FormEvent } from "react";

type FormState = {
  error?: string;
  message?: string;
};

type SignInMode = "password" | "email_link";

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
  const [mode, setMode] = useState<SignInMode>("password");
  const [pending, setPending] = useState(false);

  async function handlePasswordSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setState({});

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !email.includes("@")) {
      setState({ error: common.invalidEmail });
      setPending(false);
      return;
    }

    if (!password) {
      setState({ error: auth.passwordRequired });
      setPending(false);
      return;
    }

    const supabase = createClient();
    const isAdmin = isAdminEmail(email);

    let { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error && isAdmin) {
      const msg = error.message.toLowerCase();
      if (
        msg.includes("invalid login credentials") ||
        msg.includes("user not found")
      ) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: "admin" },
          },
        });
        if (!signUpError) {
          ({ error } = await supabase.auth.signInWithPassword({
            email,
            password,
          }));
        } else {
          error = signUpError;
        }
      }
    }

    setPending(false);

    if (error) {
      setState({
        error: mapPasswordSignInError(error.message, auth.noAccount),
      });
      return;
    }

    const redirectTo = await resolvePostLoginPath(
      supabase,
      email,
      isAdmin ? homePathForRole("admin") : nextPath,
    );
    window.location.href = redirectTo;
  }

  async function handleMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setState({});

    const email = String(new FormData(event.currentTarget).get("email") ?? "")
      .trim()
      .toLowerCase();

    if (!email || !email.includes("@")) {
      setState({ error: common.invalidEmail });
      setPending(false);
      return;
    }

    const origin = getClientAppOrigin();
    const supabase = createClient();
    const isAdmin = isAdminEmail(email);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: authCallbackUrl(
          origin,
          isAdmin ? homePathForRole("admin") : nextPath || "/dashboard",
        ),
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
      message: magicLinkSentMessage(origin, auth),
    });
  }

  return (
    <div className="flex max-w-md flex-col gap-5">
      <div className="flex gap-2 rounded-[var(--radius-sm)] border border-line bg-sand-deep p-1">
        <button
          type="button"
          className={`flex-1 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold ${
            mode === "password"
              ? "bg-foam text-ink shadow-sm"
              : "text-ink-muted hover:text-ink"
          }`}
          onClick={() => {
            setMode("password");
            setState({});
          }}
        >
          {auth.passwordTab}
        </button>
        <button
          type="button"
          className={`flex-1 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold ${
            mode === "email_link"
              ? "bg-foam text-ink shadow-sm"
              : "text-ink-muted hover:text-ink"
          }`}
          onClick={() => {
            setMode("email_link");
            setState({});
          }}
        >
          {auth.emailLinkTab}
        </button>
      </div>

      {mode === "password" ? (
        <form onSubmit={handlePasswordSignIn} className="flex flex-col gap-5">
          <TextField
            label={common.email}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={common.emailPlaceholder}
          />
          <TextField
            label={auth.passwordLabel}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder={auth.passwordPlaceholder}
          />
          <Button type="submit" disabled={pending}>
            {pending ? common.sending : auth.passwordSignInButton}
          </Button>
          <p className="text-sm">
            <Link
              href="/login/forgot"
              className="font-semibold text-olive hover:underline"
            >
              {auth.forgotPasswordLink}
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={handleMagicLink} className="flex flex-col gap-5">
          <TextField
            label={common.email}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={common.emailPlaceholder}
            hint={auth.magicLinkSameBrowserHint}
          />
          <Button type="submit" disabled={pending}>
            {pending ? common.sending : auth.magicLinkButton}
          </Button>
        </form>
      )}

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
      <p className="text-sm text-ink-muted">
        <Link href="/auth/reset" className="font-semibold text-olive hover:underline">
          {auth.resetSessionLink}
        </Link>
      </p>
    </div>
  );
}
