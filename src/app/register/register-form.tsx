"use client";

import { useActionState, useState } from "react";
import {
  registerWithMagicLink,
  type AuthActionState,
} from "@/app/auth/actions";
import { Button, TextField } from "@/components/ui";
import Link from "next/link";

const initial: AuthActionState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerWithMagicLink,
    initial,
  );
  const [persona, setPersona] = useState<"client" | "supplier" | "">("");

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-5">
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
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-olive hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
