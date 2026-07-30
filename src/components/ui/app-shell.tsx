import Link from "next/link";
import { type ReactNode } from "react";

/** Public / unauthenticated chrome — no design-system link. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 pb-10 pt-6 sm:px-6">
      <header className="mb-8 flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-2xl tracking-tight text-ink">
          Leblebee
        </Link>
        <nav className="flex items-center gap-3 text-sm font-semibold text-ink-muted">
          <Link href="/login" className="hover:text-olive">
            Sign in
          </Link>
          <Link href="/register" className="hover:text-olive">
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
