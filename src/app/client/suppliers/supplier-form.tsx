"use client";

import { useActionState } from "react";
import {
  createSupplier,
  updateSupplier,
  type SupplierActionState,
} from "./actions";
import { Button, TextAreaField, TextField } from "@/components/ui";

const initial: SupplierActionState = {};

export function SupplierForm({
  mode,
  supplier,
}: {
  mode: "create" | "edit";
  supplier?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    language: string;
    specialties: string[];
    notes: string | null;
  };
}) {
  const action = mode === "create" ? createSupplier : updateSupplier;
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      {mode === "edit" && supplier ? (
        <input type="hidden" name="id" value={supplier.id} />
      ) : null}
      <TextField
        label="Name"
        name="name"
        required
        defaultValue={supplier?.name ?? ""}
        placeholder="Yorgos Vaxevanis"
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        defaultValue={supplier?.email ?? ""}
        hint="If they registered as Supplier, we link their account automatically."
        placeholder="y.vax@gmail.com"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Phone"
          name="phone"
          defaultValue={supplier?.phone ?? ""}
        />
        <TextField
          label="WhatsApp"
          name="whatsapp"
          defaultValue={supplier?.whatsapp ?? ""}
        />
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-ink">Language</span>
        <select
          name="language"
          defaultValue={supplier?.language ?? "el"}
          className="w-full rounded-[var(--radius-sm)] border border-line bg-foam px-3 py-2.5 text-ink"
        >
          <option value="el">Greek</option>
          <option value="en">English</option>
          <option value="fr">French</option>
        </select>
      </label>
      <TextField
        label="Specialties"
        name="specialties"
        defaultValue={supplier?.specialties?.join(", ") ?? ""}
        placeholder="cleaning, AC, plumbing"
        hint="Comma-separated."
      />
      <TextAreaField
        label="Notes"
        name="notes"
        rows={3}
        defaultValue={supplier?.notes ?? ""}
        placeholder="Reliable for turnovers, prefers morning jobs…"
      />
      <Button type="submit" disabled={pending}>
        {pending
          ? "Saving…"
          : mode === "create"
            ? "Add supplier"
            : "Save changes"}
      </Button>
      {state.error ? (
        <p className="text-sm font-semibold text-coral" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="text-sm font-semibold text-olive">Saved.</p>
      ) : null}
    </form>
  );
}
