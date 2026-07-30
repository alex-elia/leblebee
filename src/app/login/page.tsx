import { AppShell } from "@/components/ui/app-shell";
import { SignInForm } from "./sign-in-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const nextPath =
    params.next && params.next.startsWith("/") ? params.next : "";

  return (
    <AppShell>
      <section className="flex flex-col gap-6 pt-4">
        <div>
          <h1 className="font-display text-4xl text-ink">Sign in</h1>
          <p className="mt-2 max-w-md text-ink-muted">
            Existing accounts only. New clients and suppliers should register
            first.
          </p>
        </div>
        {params.error ? (
          <p className="text-sm font-semibold text-coral">
            Sign-in link expired or invalid. Request a new one
            {params.error !== "auth" ? ` (${params.error})` : ""}.
          </p>
        ) : null}
        <SignInForm nextPath={nextPath} />
      </section>
    </AppShell>
  );
}
