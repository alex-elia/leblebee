function isBindAllHost(hostname: string) {
  return hostname === "0.0.0.0" || hostname === "::" || hostname === "[::]";
}

/** Canonical public app origin for auth redirects (never 0.0.0.0). */
export function getAppOrigin(request?: Request): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configured) {
    try {
      if (!isBindAllHost(new URL(configured).hostname)) {
        return configured;
      }
    } catch {
      // Fall through to request headers.
    }
  }

  if (request) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
      "https";
    if (forwardedHost) {
      const host = forwardedHost.split(",")[0]?.trim();
      if (host && !isBindAllHost(host.split(":")[0] ?? host)) {
        return `${forwardedProto}://${host}`;
      }
    }

    const hostHeader = request.headers.get("host");
    if (hostHeader && !isBindAllHost(hostHeader.split(":")[0] ?? hostHeader)) {
      const proto =
        request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
        (hostHeader.includes("localhost") ? "http" : "https");
      return `${proto}://${hostHeader}`;
    }

    const { origin, hostname } = new URL(request.url);
    if (!isBindAllHost(hostname)) {
      return origin;
    }
  }

  return "http://localhost:3010";
}

export function publicRedirect(path: string, request?: Request, search?: Record<string, string>) {
  const url = new URL(path, getAppOrigin(request));
  if (search) {
    for (const [key, value] of Object.entries(search)) {
      url.searchParams.set(key, value);
    }
  }
  return url;
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
  if (next && next !== "/") {
    url.searchParams.set("next", next);
  }
  return url.toString();
}
