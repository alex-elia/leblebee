"use server";

import { createClient } from "@/lib/supabase/server";
import {
  homePathForRole,
  isAdminEmail,
  isRegistrableRole,
  type UserRole,
} from "@/lib/auth/roles";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type AuthActionState = {
  ok?: boolean;
  error?: string;
  message?: string;
};

async function appOrigin() {
  const headerStore = await headers();
  // Prefer the browser origin so PKCE cookies match the redirect host
  // (localhost vs 127.0.0.1 are different sites).
  const fromRequest = headerStore.get("origin");
  if (fromRequest) return fromRequest.replace(/\/$/, "");
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3010").replace(
    /\/$/,
    "",
  );
}

function callbackUrl(origin: string, next: string) {
  const url = new URL("/auth/callback", origin);
  if (next && next !== "/") {
    url.searchParams.set("next", next);
  }
  return url.toString();
}

/** Sign in — existing accounts only. No persona choice. */
export async function signInWithMagicLink(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const nextRaw = String(formData.get("next") ?? "");

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  const origin = await appOrigin();
  const next = nextRaw.startsWith("/") ? nextRaw : "/";
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl(origin, next),
      shouldCreateUser: false,
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (
      msg.includes("signups not allowed") ||
      msg.includes("user not found") ||
      msg.includes("unable to validate")
    ) {
      return {
        error: "No account for this email. Create one first.",
      };
    }
    return { error: error.message };
  }

  return {
    ok: true,
    message: "Check your email for the magic link. On local, open Mailpit.",
  };
}

/** Register — new Client or Supplier. Admin cannot register here. */
export async function registerWithMagicLink(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const persona = String(formData.get("persona") ?? "").trim().toLowerCase();
  const displayName = String(formData.get("display_name") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email address." };
  }

  if (isAdminEmail(email)) {
    return {
      error: "This email is reserved for admin. Use Sign in instead.",
    };
  }

  if (!isRegistrableRole(persona)) {
    return {
      error: "Choose whether you are a Client (property owner) or a Supplier.",
    };
  }

  const role: UserRole = persona;
  const origin = await appOrigin();
  const next = homePathForRole(role);
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl(origin, next),
      data: {
        role,
        ...(displayName ? { display_name: displayName } : {}),
      },
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    ok: true,
    message: `Account link sent for ${role}. Open Mailpit to finish registration.`,
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
