import { readFileSync } from "node:fs";
import { join } from "node:path";

const CONTENT_DIR = join(process.cwd(), "content", "assistant");

export type AssistantQaItem = {
  question: string;
  answer: string;
};

export type ExpertiseSection = {
  title: string;
  principles?: string[];
  practices?: string[];
  notes?: string[];
  items?: string[];
  taskFlow?: string[];
};

export type ExpertisePlaybook = {
  guestManagement: ExpertiseSection;
  rentalOperations: ExpertiseSection;
  realEstateStr: ExpertiseSection;
  coordination: ExpertiseSection;
  creteContext: ExpertiseSection;
  boundaries: ExpertiseSection;
};

function readJson<T>(filename: string): T {
  return JSON.parse(readFileSync(join(CONTENT_DIR, filename), "utf8")) as T;
}

function readText(filename: string): string {
  return readFileSync(join(CONTENT_DIR, filename), "utf8");
}

export function loadAssistantQa(): AssistantQaItem[] {
  const data = readJson<{ items: AssistantQaItem[] }>("assistant-qa.json");
  return data.items ?? [];
}

export function loadAdvisorBio(): string {
  const raw = readText("advisor-bio.md");
  const withoutFrontmatter = raw.replace(/^---[\s\S]*?---\s*/, "");
  return withoutFrontmatter.trim();
}

export function loadExpertisePlaybook(): ExpertisePlaybook {
  return readJson<ExpertisePlaybook>("expertise.json");
}

function formatSection(section: ExpertiseSection): string {
  const lines: string[] = [`### ${section.title}`];
  const append = (label: string, items?: string[]) => {
    if (!items?.length) return;
    lines.push(`${label}:`);
    for (const item of items) {
      lines.push(`- ${item}`);
    }
  };
  append("Principles", section.principles);
  append("Practices", section.practices);
  append("Notes", section.notes);
  append("Items", section.items);
  append("Task flow", section.taskFlow);
  return lines.join("\n");
}

export function formatExpertiseForPrompt(playbook: ExpertisePlaybook): string {
  return [
    formatSection(playbook.guestManagement),
    formatSection(playbook.rentalOperations),
    formatSection(playbook.realEstateStr),
    formatSection(playbook.coordination),
    formatSection(playbook.creteContext),
    formatSection(playbook.boundaries),
  ].join("\n\n");
}

/** Shorter block for task companion (clarify/translate) — ops-focused. */
export function formatCompanionExpertise(playbook: ExpertisePlaybook): string {
  return [
    "DOMAIN EXPERTISE (Onira / Crete STR operating style):",
    "- Brief suppliers in four blocks: Access & codes | Materials | Standard work | This visit only.",
    "- Preserve codes, names, addresses, times exactly; never invent stock or gifts.",
    "- Arrival photos = guest state; departure photos = cleaned state — context, not surveillance.",
    "- Property memory holds recurring standards; tasks hold date-specific extras only.",
    "",
    "Guest management:",
    ...(playbook.guestManagement.principles ?? []).slice(0, 4).map((p) => `- ${p}`),
    "",
    "Rental ops:",
    ...(playbook.rentalOperations.practices ?? []).slice(0, 4).map((p) => `- ${p}`),
  ].join("\n");
}

export function formatFaqForPrompt(items: AssistantQaItem[]): string {
  if (!items.length) return "";
  return items.map((item) => `Q: ${item.question}\nA: ${item.answer}`).join("\n\n");
}

export function loadCompanionExpertisePrompt(): string {
  return formatCompanionExpertise(loadExpertisePlaybook());
}
