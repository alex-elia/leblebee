"use client";

import { Button, TextAreaField } from "@/components/ui";
import {
  buildIntroMessage,
  mailtoHref,
  type IntroParty,
} from "@/lib/admin/intro-text";
import type { Messages } from "@/lib/i18n/messages";
import { useMemo, useState } from "react";

type Option = IntroParty & { id: string; label: string };

export function IntroForm({
  clients,
  suppliers,
  t,
}: {
  clients: Option[];
  suppliers: Option[];
  t: Messages;
}) {
  const A = t.admin.intros;
  const [clientId, setClientId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);

  const client = clients.find((c) => c.id === clientId);
  const supplier = suppliers.find((s) => s.id === supplierId);

  const message = useMemo(() => {
    if (!client || !supplier) return "";
    return buildIntroMessage(
      { displayName: client.displayName, email: client.email },
      { displayName: supplier.displayName, email: supplier.email },
      note,
    );
  }, [client, supplier, note]);

  const canSend = Boolean(client && supplier && message);

  const mailto = canSend
    ? mailtoHref(
        [client!.email, supplier!.email].filter(Boolean) as string[],
        A.emailSubject,
        message,
      )
    : "#";

  async function copyMessage() {
    if (!message) return;
    await navigator.clipboard.writeText(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex max-w-xl flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-ink">{A.clientLabel}</span>
        <select
          className="w-full rounded-[var(--radius-sm)] border border-line bg-foam px-3 py-2.5 text-ink shadow-[var(--shadow-soft)]"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        >
          <option value="">{A.selectClient}</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-ink">{A.supplierLabel}</span>
        <select
          className="w-full rounded-[var(--radius-sm)] border border-line bg-foam px-3 py-2.5 text-ink shadow-[var(--shadow-soft)]"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
        >
          <option value="">{A.selectSupplier}</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <TextAreaField
        label={A.noteLabel}
        hint={A.noteHint}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={A.notePlaceholder}
      />

      {message ? (
        <div className="rounded-[var(--radius-sm)] border border-line bg-foam px-3 py-3">
          <p className="mb-2 text-sm font-semibold text-ink">{A.previewLabel}</p>
          <pre className="whitespace-pre-wrap text-sm text-ink-muted">{message}</pre>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="button" disabled={!canSend} onClick={copyMessage}>
          {copied ? A.copied : A.copy}
        </Button>
        {canSend && (client?.email || supplier?.email) ? (
          <a href={mailto}>
            <Button type="button" variant="secondary">
              {A.emailBoth}
            </Button>
          </a>
        ) : null}
      </div>
    </div>
  );
}
