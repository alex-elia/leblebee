export type IntroParty = {
  displayName: string;
  email: string | null;
};

export function buildIntroMessage(
  client: IntroParty,
  supplier: IntroParty,
  note: string,
): string {
  const clientName = client.displayName || "Client";
  const supplierName = supplier.displayName || "Supplier";
  const trimmedNote = note.trim();

  const lines = [
    `Hi ${clientName} and ${supplierName},`,
    "",
    "I'm connecting you on Leblebee for property work and clear bilingual tasks.",
    `Client: ${clientName}${client.email ? ` (${client.email})` : ""}`,
    `Supplier: ${supplierName}${supplier.email ? ` (${supplier.email})` : ""}`,
  ];

  if (trimmedNote) {
    lines.push("", "Context:", trimmedNote);
  }

  lines.push(
    "",
    "Please reply to confirm you can work together. Leblebee keeps instructions and handoffs in one place.",
  );

  return lines.join("\n");
}

export function mailtoHref(to: string[], subject: string, body: string): string {
  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${to.filter(Boolean).join(",")}?${params.toString()}`;
}
