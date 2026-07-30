import { PersonaShell } from "@/components/ui/persona-shell";
import { Button } from "@/components/ui";
import { SupplierForm } from "../supplier-form";
import { deleteSupplier } from "../actions";
import { requireProfile } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Supplier",
};

export default async function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile, supabase } = await requireProfile(["client", "admin"]);

  let query = supabase.from("providers").select("*").eq("id", id);
  if (profile.role === "client") {
    query = query.eq("client_id", user.id);
  }
  const { data: supplier } = await query.maybeSingle();
  if (!supplier) notFound();

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
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl text-ink">{supplier.name}</h1>
        <Link href={`/client/tasks/new?supplier=${supplier.id}`}>
          <Button>New task for them</Button>
        </Link>
      </div>
      <SupplierForm
        mode="edit"
        supplier={{
          id: supplier.id,
          name: supplier.name,
          email: supplier.email,
          phone: supplier.phone,
          whatsapp: supplier.whatsapp,
          language: supplier.language,
          specialties: supplier.specialties ?? [],
          notes: supplier.notes,
        }}
      />
      <form action={deleteSupplier} className="mt-10 border-t border-line pt-6">
        <input type="hidden" name="id" value={supplier.id} />
        <Button variant="ghost" type="submit" className="text-coral">
          Remove supplier
        </Button>
      </form>
    </PersonaShell>
  );
}
