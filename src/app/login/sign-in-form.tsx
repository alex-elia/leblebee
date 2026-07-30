"use client";

import { useActionState } from "react";
import {
  signInWithMagicLink,
  type AuthActionState,
} from "@/app/auth/actions";
import { Button, TextField } from "@/components/ui";
import Link from "next/link";

const initial: AuthActionState = {};

export function SignInForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, pending] = useActionState(
    signInWithMagicLink,
    initial,
  );

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-5">
      <input type="hidden" name="next" value={nextPath} />
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
          {state.message}{" "}
          <a
            className="font-semibold underline"
            href="http://127.0.0.1:54324"
            target="_blank"
            rel="noreferrer"
          >
            Open Mailpit
          </a>
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
