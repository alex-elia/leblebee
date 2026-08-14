"use client";

import {
  ensureProfileForUser,
  resolveAuthCallbackRedirect,
} from "@/lib/auth/post-login";
import { createClient } from "@/lib/supabase/client";
import type { EmailOtpType } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

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

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          router.replace(
            `/login?error=${encodeURIComponent(exchangeError.message)}`,
          );
          return;
        }
      } else if (tokenHash && type) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          type,
          token_hash: tokenHash,
        });
        if (verifyError) {
          router.replace(
            `/login?error=${encodeURIComponent(verifyError.message)}`,
          );
          return;
        }
      } else {
        router.replace("/login?error=missing_code");
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login?error=auth_callback_failed");
        return;
      }

      const role = await ensureProfileForUser(supabase, user);
      const redirectTo = resolveAuthCallbackRedirect(role, nextParam);
      router.replace(redirectTo);
    }

    finish().catch(() => {
      setError("auth_callback_failed");
      router.replace("/login?error=auth_callback_failed");
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
