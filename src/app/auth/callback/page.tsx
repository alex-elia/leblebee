"use client";

import {
  ensureProfileForUser,
  resolveAuthCallbackRedirect,
} from "@/lib/auth/post-login";
import { createClient } from "@/lib/supabase/client";
import type { EmailOtpType } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

function fail(router: ReturnType<typeof useRouter>, error: string) {
  const code =
    error.toLowerCase().includes("pkce") ||
    error.toLowerCase().includes("code verifier")
      ? "pkce"
      : error;
  router.replace(`/login?error=${encodeURIComponent(code)}`);
}

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function finish() {
      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type") as EmailOtpType | null;
      const nextParam = searchParams.get("next");
      const supabase = createClient();

      // createBrowserClient detects ?code= during init. Reuse that session
      // instead of exchanging the one-time code twice.
      let {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session && code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          fail(router, exchangeError.message);
          return;
        }
        ({
          data: { session },
        } = await supabase.auth.getSession());
      } else if (!session && tokenHash && type) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          type,
          token_hash: tokenHash,
        });
        if (verifyError) {
          fail(router, verifyError.message);
          return;
        }
        ({
          data: { session },
        } = await supabase.auth.getSession());
      }

      if (!session) {
        fail(router, code ? "pkce" : "missing_code");
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        fail(router, userError?.message ?? "auth_callback_failed");
        return;
      }

      const role = await ensureProfileForUser(supabase, user);
      const redirectTo = resolveAuthCallbackRedirect(role, nextParam);
      router.replace(redirectTo);
    }

    finish().catch((caught: unknown) => {
      const message =
        caught instanceof Error ? caught.message : "auth_callback_failed";
      setError(message);
      fail(router, message);
    });
  }, [router, searchParams]);

  if (error) {
    return null;
  }

  return (
    <p className="pt-8 text-sm text-ink-muted" aria-live="polite">
      Signing you in…
    </p>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <p className="pt-8 text-sm text-ink-muted" aria-live="polite">
          Signing you in…
        </p>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
