import { createChatHandler } from "@elia/agent-next";
import { buildAssistantSystemPrompt } from "@/lib/ai-context";

export const runtime = "nodejs";

export const POST = createChatHandler({
  siteId: "leblebee",
  buildSystemPrompt: buildAssistantSystemPrompt,
  rateLimitedMessage:
    "Too many requests. Please try again later or email alex.gon@eliago.com.",
});
