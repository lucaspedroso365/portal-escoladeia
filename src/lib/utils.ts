import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and dedupe conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** URL-safe slug from any string (accent-insensitive). */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Long-form localized date, e.g. "27 de maio de 2026". */
export function formatDate(date: Date | string | null, locale = "pt-BR"): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Relative date, e.g. "há 2 dias", falling back to a full date past a week. */
export function formatRelativeDate(date: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins} min`;
  if (hours < 24) return `há ${hours} h`;
  if (days < 7) return `há ${days} ${days === 1 ? "dia" : "dias"}`;
  return formatDate(d);
}

/** Reading time in minutes (defaults to 200 words per minute). */
export function estimateReadingTime(text: string, wpm = 200): number {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wpm));
}

const LOGO_PALETTE = [
  "#CC785C",
  "#1A1A1A",
  "#2563EB",
  "#7C3AED",
  "#059669",
  "#DC2626",
  "#D97706",
  "#0891B2",
  "#DB2777",
  "#4F46E5",
];

/** Deterministic brand color for a tool initial avatar. */
export function colorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return LOGO_PALETTE[Math.abs(hash) % LOGO_PALETTE.length];
}

/** Coerce a Prisma Json field (which may be a JSON string or array) to string[]. */
export function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return [value];
    }
  }
  return [];
}

/** Extract the `## H2` headings from markdown content (for tutorial indexes). */
export function extractHeadings(markdown: string): { text: string; id: string }[] {
  const headings: { text: string; id: string }[] = [];
  const lines = (markdown || "").split("\n");
  for (const line of lines) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match) {
      const text = match[1].replace(/[#*`]/g, "").trim();
      headings.push({ text, id: slugify(text) });
    }
  }
  return headings;
}

/** Truncate to a max length with an ellipsis (whole words). */
export function truncate(text: string, max: number): string {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

/**
 * Split markdown for an in-article ad: returns the content up to the second
 * H2 (so the ad lands after the first section), and the remainder.
 */
export function splitMarkdownForAd(md: string): { before: string; after: string } {
  const matches = [...(md || "").matchAll(/\n##\s/g)];
  if (matches.length >= 2 && matches[1].index != null) {
    const idx = matches[1].index;
    return { before: md.slice(0, idx), after: md.slice(idx) };
  }
  return { before: md, after: "" };
}
