/**
 * Stateless admin auth: an httpOnly cookie holding a payload signed with
 * HMAC-SHA256 (Web Crypto). No bcrypt, no JWT lib. Edge-safe — this module
 * never statically imports next/headers (getSession imports it lazily).
 */

export const COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days, in seconds

export interface SessionPayload {
  u: string;
  exp: number; // epoch ms
}

const encoder = new TextEncoder();

/** Encode a string to bytes typed as BufferSource (avoids TS ArrayBufferLike vs ArrayBuffer mismatch). */
function enc(s: string): BufferSource {
  return encoder.encode(s) as unknown as BufferSource;
}

function toB64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64Url(str: string): BufferSource {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes as unknown as BufferSource;
}

function decodeJson(src: BufferSource): string {
  return new TextDecoder().decode(src as ArrayBuffer);
}

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET missing");
  return crypto.subtle.importKey(
    "raw",
    enc(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/** Sign a payload into a `body.signature` token. */
export async function signSession(payload: SessionPayload): Promise<string> {
  const body = toB64Url(encoder.encode(JSON.stringify(payload)));
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, enc(body));
  return `${body}.${toB64Url(new Uint8Array(sig))}`;
}

/** Verify a token's signature and expiry. Returns the payload or null. */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) return null;
    const key = await getKey();
    const valid = await crypto.subtle.verify("HMAC", key, fromB64Url(sig), enc(body));
    if (!valid) return null;
    const payload = JSON.parse(decodeJson(fromB64Url(body))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Plain-text credential check against env vars. */
export function verifyCredentials(user: string, password: string): boolean {
  const u = process.env.ADMIN_USER;
  const p = process.env.ADMIN_PASSWORD;
  return !!u && !!p && user === u && password === p;
}

/** Read and verify the current admin session (server components / routes). */
export async function getSession(): Promise<SessionPayload | null> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}
