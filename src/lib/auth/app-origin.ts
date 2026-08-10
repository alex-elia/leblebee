/** Canonical public app origin for auth redirects (never 0.0.0.0). */
export function getAppOrigin(request?: Request): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configured) {
    return configured;
  }

  if (request) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
      "https";
    if (forwardedHost) {
      const host = forwardedHost.split(",")[0]?.trim();
      if (host) {
        return `${forwardedProto}://${host}`;
      }
    }

    const { origin, hostname } = new URL(request.url);
    if (hostname !== "0.0.0.0") {
      return origin;
    }
  }

  return "http://localhost:3010";
}

/** Prefer configured public URL so auth emails always use www, not apex. */
export function getClientAppOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:3010";
}

export function isLocalDevOrigin(origin: string) {
  try {
    const host = new URL(origin).hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

export function authCallbackUrl(origin: string, next?: string) {
  const url = new URL("/auth/callback", origin);
  // Anchor query string so email templates can append &token_hash=...
  url.searchParams.set("flow", "otp");
  if (next && next !== "/") {
    url.searchParams.set("next", next);
  }
  return url.toString();
}
