import { isLocalDevOrigin } from "@/lib/auth/app-origin";
import type { Messages } from "@/lib/i18n/messages";

export function magicLinkSentMessage(origin: string, auth: Messages["auth"]) {
  if (isLocalDevOrigin(origin)) {
    return auth.magicLinkSentLocal;
  }
  return auth.magicLinkSent;
}
