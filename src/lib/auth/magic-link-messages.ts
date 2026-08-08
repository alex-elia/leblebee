import { isLocalDevOrigin } from "@/lib/auth/app-origin";

export function magicLinkSentMessage(origin: string, forRegistration = false) {
  if (isLocalDevOrigin(origin)) {
    return forRegistration
      ? "Account link sent. Open Mailpit (http://127.0.0.1:54324) to finish registration."
      : "Check Mailpit for the magic link (http://127.0.0.1:54324).";
  }
  return forRegistration
    ? "Account link sent. Check your email to finish registration."
    : "Check your email for the magic link.";
}
