import { AppShell } from "@/components/ui/app-shell";
import { Button } from "@/components/ui/button";
import { getProfile, homePathForRole } from "@/lib/auth/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getProfile();
  if (session) {
    redirect(homePathForRole(session.profile.role));
  }

  return (
    <AppShell>
      <section className="flex flex-col gap-6 pt-6 sm:pt-12">
        <p className="font-display text-5xl leading-none text-ink sm:text-6xl">
          Leblebee
        </p>
        <p className="max-w-xl text-lg text-ink-muted">
          Clear tasks across languages — so property owners and local suppliers
          stay aligned, and guests get a better stay.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/login">
            <Button>Sign in</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Create account</Button>
          </Link>
        </div>
        <p className="text-sm text-ink-muted">
          Register as Client or Supplier. Admin signs in with the reserved email.
        </p>
      </section>
    </AppShell>
  );
}
