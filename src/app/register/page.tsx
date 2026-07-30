import { AppShell } from "@/components/ui/app-shell";
import { RegisterForm } from "./register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <AppShell>
      <section className="flex flex-col gap-6 pt-4">
        <div>
          <h1 className="font-display text-4xl text-ink">Create account</h1>
          <p className="mt-2 max-w-md text-ink-muted">
            Choose Client or Supplier once. Admin access is separate and cannot
            be self-registered.
          </p>
        </div>
        <RegisterForm />
      </section>
    </AppShell>
  );
}
