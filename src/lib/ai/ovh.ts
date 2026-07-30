/**
 * OVH AI Endpoints client — env names aligned with Clin / Nemrut.
 * Never import from client components.
 */

const DEFAULT_BASE_URL =
  "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1";
const DEFAULT_MODEL = "Mistral-Small-3.2-24B-Instruct-2506";

export type OvhChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type OvhChatResult = {
  content: string;
  model: string;
};

function pick(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

/** Resolve OpenAI-compatible chat completions URL (Clin/Nemrut order). */
export function resolveOvhChatCompletionsUrl(): string {
  const chatUrl = pick("OVH_AI_CHAT_URL");
  if (chatUrl) {
    return chatUrl.endsWith("/chat/completions")
      ? chatUrl
      : `${chatUrl.replace(/\/$/, "")}/chat/completions`;
  }

  const modelUrl = (
    pick("OVH_AI_UNIFIED_MODEL_URL") ?? pick("OVH_AI_ENDPOINTS_MODEL_URL")
  )?.replace(/\/$/, "");

  if (modelUrl) {
    if (
      /openai_compat\/.+\/chat\/completions|\/v1\/chat\/completions$/i.test(
        modelUrl,
      )
    ) {
      return modelUrl;
    }
    if (/openai_compat|\/api\//i.test(modelUrl)) {
      return `${modelUrl}/chat/completions`;
    }
    const base = modelUrl.endsWith("/v1") ? modelUrl : `${modelUrl}/v1`;
    return `${base}/chat/completions`;
  }

  return `${DEFAULT_BASE_URL}/chat/completions`;
}

export function resolveOvhApiKey(): string {
  const key =
    pick("OVH_AI_ENDPOINTS_ACCESS_TOKEN") ??
    pick("OVH_AI_API_KEY") ??
    pick("LLM_API_KEY");
  if (!key) {
    throw new Error(
      "Missing OVH_AI_ENDPOINTS_ACCESS_TOKEN (copy from clin/web .env.local)",
    );
  }
  return key;
}

export function resolveOvhDefaultModel(): string {
  return (
    pick("OVH_AI_ORCHESTRATOR_MODEL") ??
    pick("OVH_AI_CHAT_MODEL") ??
    pick("LLM_MODEL") ??
    pick("OVH_AI_MODEL") ??
    DEFAULT_MODEL
  );
}

export async function ovhChat(
  messages: OvhChatMessage[],
  options?: { temperature?: number; model?: string },
): Promise<OvhChatResult> {
  const url = resolveOvhChatCompletionsUrl();
  const apiKey = resolveOvhApiKey();
  const model = options?.model ?? resolveOvhDefaultModel();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.2,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OVH AI error ${response.status}: ${body}`);
  }

  const json = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
    model?: string;
  };

  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OVH AI returned empty content");
  }

  return { content, model: json.model ?? model };
}
