import { PersonaShell } from "@/components/ui/persona-shell";
import { Button, EmptyState } from "@/components/ui";
import { requireProfile } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Properties",
};

export default async function PropertiesPage() {
  const { user, profile, supabase } = await requireProfile(["client", "admin"]);

  let query = supabase
    .from("properties")
    .select("id, name, address_notes, created_at, client_id")
    .order("created_at", { ascending: false });

  if (profile.role === "client") {
    query = query.eq("client_id", user.id);
  }

  const { data: properties } = await query;

  return (
    <PersonaShell
      role={profile.role}
      displayName={profile.display_name}
      email={user.email}
      title="Properties"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl text-ink">Properties</h1>
          <p className="mt-1 text-ink-muted">
            Apartments you operate remotely — with notes suppliers need.
          </p>
        </div>
        <Link href="/client/properties/new">
          <Button>New property</Button>
        </Link>
      </div>

      {!properties?.length ? (
        <EmptyState
          title="No properties yet"
          description="Add the first apartment so you can create tasks against it."
          actionLabel="New property"
        />
      ) : (
        <ul className="divide-y divide-line border-t border-line">
          {properties.map((property) => (
            <li key={property.id}>
              <Link
                href={`/client/properties/${property.id}`}
                className="block py-4 transition-colors hover:bg-foam/70"
              >
                <p className="font-semibold text-ink">{property.name}</p>
                {property.address_notes ? (
                  <p className="mt-0.5 line-clamp-2 text-sm text-ink-muted">
                    {property.address_notes}
                  </p>
                ) : (
                  <p className="mt-0.5 text-sm text-ink-muted">No access notes</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PersonaShell>
  );
}
