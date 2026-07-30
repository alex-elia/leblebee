import { PersonaShell } from "@/components/ui/persona-shell";
import { SupplierForm } from "../supplier-form";
import { requireProfile } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Add supplier",
};

export default async function NewSupplierPage() {
  const { user, profile } = await requireProfile(["client", "admin"]);

  return (
    <PersonaShell
      role={profile.role}
      displayName={profile.display_name}
      email={user.email}
    >
      <p className="mb-4 text-sm font-semibold text-ink-muted">
        <Link href="/client/suppliers" className="hover:text-olive">
          ← Suppliers
        </Link>
      </p>
      <h1 className="font-display mb-6 text-4xl text-ink">Add supplier</h1>
      <SupplierForm mode="create" />
    </PersonaShell>
  );
}
