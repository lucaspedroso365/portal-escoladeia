/* eslint-disable @typescript-eslint/no-explicit-any */
import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" });

export const CONCURRENCY = Number(process.env.CONCURRENCY ?? 3);
export const DELAY_MS = Number(process.env.DELAY_MS ?? 1000);
export const LIMIT = Number(process.env.LIMIT ?? 0); // 0 = sem limite
export const REVALIDATE_URL =
  process.env.REVALIDATE_URL ?? "http://127.0.0.1:3001/api/admin/revalidate";
export const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN ?? "";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Runs `worker` over `items` with a fixed concurrency and inter-call delay. */
export async function pool<T>(
  items: T[],
  worker: (item: T, idx: number) => Promise<void>
): Promise<void> {
  let i = 0;
  async function runner() {
    while (i < items.length) {
      const idx = i++;
      await worker(items[idx], idx);
      if (DELAY_MS) await sleep(DELAY_MS);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, runner)
  );
}

/** URL-safe slug (accent-insensitive). Mirrors src/lib/utils.ts. */
export function slugify(str: string): string {
  return (str ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Trim to a max length without breaking words. */
export function truncate(str: string, max: number): string {
  if (!str || str.length <= max) return str;
  return str.slice(0, max).replace(/\s+\S*$/, "").trimEnd();
}

/**
 * Call the deployed `/api/admin/revalidate` endpoint so freshly-created pages
 * appear immediately on the public site. Silently no-ops if the token is
 * not configured (e.g. running locally against mock data).
 */
export async function revalidate(typeKey: string, slug?: string): Promise<void> {
  if (!REVALIDATE_TOKEN) return;
  try {
    await fetch(REVALIDATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${REVALIDATE_TOKEN}`,
      },
      body: JSON.stringify({ typeKey, slug }),
    });
  } catch {
    /* não falha o job por causa de revalidação */
  }
}

/**
 * Attempts to run `attempt(slug)` with the base slug; if Prisma raises a
 * P2002 (unique constraint), tries again with prefixed and numbered variants.
 */
export async function createWithUniqueSlug<T>(
  baseSlug: string,
  prefix: string,
  attempt: (slug: string) => Promise<T>
): Promise<{ result: T; slug: string }> {
  const base = slugify(baseSlug) || prefix;
  const candidates = [
    base,
    `${prefix}-${base}`,
    ...Array.from({ length: 30 }, (_, i) => `${base}-${i + 2}`),
  ];
  let lastErr: unknown;
  for (const slug of candidates) {
    if (!slug) continue;
    try {
      const result = await attempt(slug);
      return { result, slug };
    } catch (e) {
      lastErr = e;
      const code = (e as { code?: string })?.code;
      if (code !== "P2002") throw e;
    }
  }
  throw lastErr ?? new Error(`Slug único não encontrado a partir de "${baseSlug}"`);
}

/** Pretty-print the start banner for any bulk script. */
export function banner(name: string, total: number, modelText: string): void {
  console.log(
    `${name}: ${total} item(ns) (${modelText}, concorrência ${CONCURRENCY}, delay ${DELAY_MS}ms${LIMIT ? `, LIMIT ${LIMIT}` : ""})`
  );
}
