import {
  formatExpertiseForPrompt,
  formatFaqForPrompt,
  loadAdvisorBio,
  loadAssistantQa,
  loadExpertisePlaybook,
} from "@/lib/assistant-playbook/load-playbook";
import { getMessages, type Messages } from "@/lib/i18n/messages";
import { normalizeLocale, type Locale } from "@/lib/i18n/locales";

export type AssistantContextMeta = {
  locale: string;
  charCount: number;
  sections: string[];
};

export async function buildAssistantSystemPrompt(locale: string): Promise<string> {
  const { prompt } = await buildAssistantContext(locale);
  return prompt;
}

export async function buildAssistantContext(
  locale: string,
): Promise<{ prompt: string; meta: AssistantContextMeta }> {
  const safeLocale = normalizeLocale(locale);
  const t = getMessages(safeLocale);
  const sectionNames: string[] = [];

  const qa = loadAssistantQa();
  const bio = loadAdvisorBio();
  const expertise = loadExpertisePlaybook();
  const expertiseText = formatExpertiseForPrompt(expertise);

  const sections: string[] = [
    buildIdentityBlock(safeLocale, t),
    "",
    buildToneBlock(),
    "",
    buildRulesBlock(safeLocale, t),
    "",
    "## advisor_bio",
    bio.slice(0, 2200),
    "",
    "## domain_expertise",
    expertiseText,
  ];
  sectionNames.push("identity", "tone", "rules", "advisor_bio", "domain_expertise");

  const productBlock = buildProductBlock(t);
  if (productBlock) {
    sections.push("", "## leblebee_product", productBlock);
    sectionNames.push("leblebee_product");
  }

  const faq = formatFaqForPrompt(qa);
  if (faq) {
    sections.push("", "## faq", faq);
    sectionNames.push("faq");
  }

  const prompt = sections.filter(Boolean).join("\n");
  return {
    prompt,
    meta: {
      locale: safeLocale,
      charCount: prompt.length,
      sections: sectionNames,
    },
  };
}

function buildIdentityBlock(locale: Locale, t: Messages): string {
  const L = t.landing;
  return [
    "You are the Leblebee assistant — expert in short-term rental operations, guest management, and owner–supplier coordination on Crete.",
    "Built by Alex (Onira Experience): operator of Konaki Analipsi and Hygge Suites, 10+ property renovations in France and Greece.",
    "Leblebee (www.leblebee.com) is the bilingual ops channel: property memory, translated task briefs, arrival and departure photos.",
    "You advise on how to run rentals well; you also explain what Leblebee the product does and does not do.",
    "",
    `Site headline: ${L.headline}`,
    L.support,
    `- Site locale hint: ${locale}.`,
  ].join("\n");
}

function buildToneBlock(): string {
  return [
    "TONE:",
    "- Advisory peer with warm host practicality (Onira/Konaki style): factual, concise, no upselling.",
    "- Expert in STR ops — speak like someone who has done turnovers, not a generic SaaS bot.",
    "- Suggest email alex.gon@eliago.com or Register when the question needs account-specific help.",
    "- Reply in the visitor's language when possible.",
  ].join("\n");
}

function buildRulesBlock(locale: Locale, t: Messages): string {
  const A = t.assistant;
  return [
    "RULES:",
    "- Ground answers in the playbook sections below. If unsure, say so — do not invent codes, prices, or features.",
    "- Owners are Clients in the app; local providers are Suppliers.",
    "- Leblebee is not a PMS, guest inbox, or payment platform.",
    "- Investment purchase / tax / notary questions: brief public context only; personal advice → Onira Experience or a qualified professional.",
    "- Never guarantee returns, legal outcomes, or booking availability.",
    `- Preferred reply language from site locale: ${locale}.`,
    `- Contact beyond chat: ${A.contactHint}`,
  ].join("\n");
}

function buildProductBlock(t: Messages): string {
  const L = t.landing;
  const bringItems = L.bringItems
    .map((item) => `- ${item.title}: ${item.body}`)
    .join("\n");

  return [
    "HOW TO START:",
    "- Register at /register as Client (property owner) or Supplier (local provider).",
    "- Sign in at /login with a magic link (no password).",
    "- Free while dogfooding with a small Greece circle.",
    "",
    "APP CAPABILITIES:",
    bringItems,
    "",
    "TASK FLOW:",
    "assigned → accepted (confirm) → arrival photos → departure photos → done → closed or follow-up",
    "",
    "PRICING:",
    L.offerTitle,
    L.offerOwners,
    L.offerSuppliers,
  ].join("\n");
}