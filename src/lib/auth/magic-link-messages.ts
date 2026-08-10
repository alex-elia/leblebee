import { isLocalDevOrigin } from "@/lib/auth/app-origin";
import type { Messages } from "@/lib/i18n/messages";

export function magicLinkSentMessage(
  origin: string,
  auth: Messages["auth"],
  forRegistration = false,
) {
  if (isLocalDevOrigin(origin)) {
    return forRegistration
      ? auth.registerMagicSentLocal
      : auth.magicLinkSentLocal;
  }
  return forRegistration ? auth.registerMagicSent : auth.magicLinkSent;
}

export function otpSentMessage(
  origin: string,
  auth: Messages["auth"],
  forRegistration = false,
) {
  if (isLocalDevOrigin(origin)) {
    return forRegistration ? auth.registerOtpSentLocal : auth.otpSentLocal;
  }
  return forRegistration ? auth.registerOtpSent : auth.otpSent;
}
