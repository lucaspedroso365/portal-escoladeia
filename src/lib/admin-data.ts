import { ADMIN_FIELDS } from "./admin-fields";
import { slugify } from "./utils";
import type { ContentType } from "@/types";

/**
 * Coerce a raw form body into a Prisma-ready data object using the field
 * schema for the type. Unknown keys are dropped; types are normalized.
 */
export function coercePayload(
  type: ContentType,
  body: Record<string, unknown>
): Record<string, unknown> {
  const schema = ADMIN_FIELDS[type];
  const data: Record<string, unknown> = {};

  for (const f of schema.fields) {
    if (!(f.name in body)) continue;
    const v = body[f.name];
    switch (f.type) {
      case "number":
        data[f.name] = v === "" || v == null ? null : Number(v);
        break;
      case "toggle":
        data[f.name] = Boolean(v);
        break;
      case "tags":
        data[f.name] = Array.isArray(v)
          ? v.map(String)
          : typeof v === "string"
            ? v.split(",").map((s) => s.trim()).filter(Boolean)
            : [];
        break;
      case "select":
        if (f.numericId) data[f.name] = v === "" || v == null ? null : Number(v);
        else data[f.name] = v ?? null;
        break;
      case "image":
        data[f.name] = v || null;
        break;
      default:
        data[f.name] = v ?? null;
    }
  }

  // Auto-slug from the source field when slug is empty.
  const sourceVal = body[schema.slugFrom];
  if ((!data.slug || data.slug === "") && sourceVal) {
    data.slug = slugify(String(sourceVal));
  } else if (typeof data.slug === "string" && data.slug) {
    data.slug = slugify(data.slug);
  }

  return data;
}
