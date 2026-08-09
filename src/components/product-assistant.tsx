import { CHAT_MAX_USER_TURNS } from "@elia/agent-core";
import { GuestAssistant } from "@elia/agent-next";
import { getI18n } from "@/lib/i18n/get-locale";

function contactWhatsAppHref(): string {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() ||
    "mailto:alex.gon@eliago.com?subject=Leblebee"
  );
}

export async function ProductAssistant() {
  const { locale, t } = await getI18n();
  const A = t.assistant;
  const max = CHAT_MAX_USER_TURNS;

  return (
    <GuestAssistant
      locale={locale}
      whatsappHref={contactWhatsAppHref()}
      bookHref="/register"
      phoneDisplay={A.phoneDisplay}
      hostName="Leblebee"
      panelTitle={A.panelTitle}
      panelSubtitle={A.panelSubtitle}
      whatsappLabel={A.whatsapp}
      bookLabel={A.startFree}
      bookHint={A.startHint}
      aiLabel={A.ai}
      backLabel={A.back}
      closeLabel={A.close}
      chatMaxTurns={max}
      bookIcon="mail"
      aiLabels={{
        placeholder: A.placeholder,
        send: A.send,
        thinking: A.thinking,
        error: A.error,
        offline: A.offline,
        greeting: A.greeting,
        limitsNotice: A.limitsNotice.replace("{max}", String(max)),
        rateLimited: A.rateLimited,
        turnLimit: A.turnLimit.replace("{max}", String(max)),
      }}
    />
  );
}
