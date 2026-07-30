import { PersonaShell } from "@/components/ui/persona-shell";
import { Button } from "@/components/ui";
import { PropertyForm } from "../property-form";
import { deleteProperty } from "../actions";
import { groupPlaybookRows } from "@/lib/properties/playbook";
import { requireProfile } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Property",
};

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile, supabase } = await requireProfile(["client", "admin"]);

  let query = supabase
    .from("properties")
    .select("id, name, address_notes, client_id")
    .eq("id", id);

  if (profile.role === "client") {
    query = query.eq("client_id", user.id);
  }

  const { data: property } = await query.maybeSingle();
  if (!property) notFound();

  const { data: memory } = await supabase
    .from("property_memory")
    .select("bullet, kind, sort_order")
    .eq("property_id", id)
    .order("sort_order", { ascending: true });

  const playbook = groupPlaybookRows(memory ?? []);

  return (
    <PersonaShell
      role={profile.role}
      displayName={profile.display_name}
      email={user.email}
    >
      <p className="mb-4 text-sm font-semibold text-ink-muted">
        <Link href="/client/properties" className="hover:text-olive">
          ← Properties
        </Link>
      </p>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-ink">{property.name}</h1>
          <p className="mt-1 text-ink-muted">
            Apartment standard — applied to every task unless you change it.
          </p>
        </div>
        <Link href={`/client/tasks/new?property=${property.id}`}>
          <Button>New task here</Button>
        </Link>
      </div>
      <PropertyForm
        mode="edit"
        property={{
          id: property.id,
          name: property.name,
          address_notes: property.address_notes,
          playbook,
        }}
      />
      <form action={deleteProperty} className="mt-10 border-t border-line pt-6">
        <input type="hidden" name="id" value={property.id} />
        <Button variant="ghost" type="submit" className="text-coral">
          Delete property
        </Button>
      </form>
    </PersonaShell>
  );
}
