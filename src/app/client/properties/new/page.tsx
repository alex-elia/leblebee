import { PersonaShell } from "@/components/ui/persona-shell";
import { PropertyForm } from "../property-form";
import { requireProfile } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "New property",
};

export default async function NewPropertyPage() {
  const { user, profile } = await requireProfile(["client", "admin"]);

  return (
    <PersonaShell
      role={profile.role}
      displayName={profile.display_name}
      email={user.email}
      title="New property"
    >
      <p className="mb-4 text-sm font-semibold text-ink-muted">
        <Link href="/client/properties" className="hover:text-olive">
          ← Properties
        </Link>
      </p>
      <h1 className="font-display mb-6 text-4xl text-ink">New property</h1>
      <PropertyForm mode="create" />
    </PersonaShell>
  );
}
