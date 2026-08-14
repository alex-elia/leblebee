import type { CookieOptions } from "@supabase/ssr";

/** Share cookies across apex and www so magic-link PKCE survives host switches. */
export function getSupabaseCookieOptions(): CookieOptions {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  let domain: string | undefined;

  if (configured) {
    try {
      const host = new URL(configured).hostname;
      if (host !== "localhost" && host !== "127.0.0.1" && host !== "0.0.0.0") {
        domain = host.startsWith("www.") ? host.slice(4) : host;
      }
    } catch {
      domain = undefined;
    }
  }

  return {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    ...(domain ? { domain } : {}),
  };
}
