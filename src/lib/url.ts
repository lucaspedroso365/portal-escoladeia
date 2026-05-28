import type { NextRequest } from "next/server";

/**
 * Some proxies (OpenLiteSpeed + Cloudflare) emit duplicated forwarded headers
 * such as "https, https" or "host-a, host-b". Always take the first value.
 */
function firstValue(value: string | null): string | null {
  if (!value) return null;
  const first = value.split(",")[0]?.trim();
  return first || null;
}

/**
 * Build the absolute public origin (scheme + host) of the current request,
 * honoring X-Forwarded-Proto / X-Forwarded-Host set by the reverse proxy.
 */
export function publicOrigin(req: Request | NextRequest): string {
  const headers = req.headers;
  const proto =
    firstValue(headers.get("x-forwarded-proto")) ||
    firstValue(headers.get("x-forwarded-protocol")) ||
    "https";
  const host =
    firstValue(headers.get("x-forwarded-host")) ||
    firstValue(headers.get("host")) ||
    fallbackHost();
  return `${proto}://${host}`;
}

function fallbackHost(): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) {
    try {
      return new URL(site).host;
    } catch {
      /* ignore */
    }
  }
  return "localhost:3000";
}

/** The configured canonical site URL, without a trailing slash. */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://escoladevideosia.com.br";
  return raw.replace(/\/+$/, "");
}
