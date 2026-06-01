import { revalidatePath } from "next/cache";
import { adminTypeByKey, type AdminType } from "./admin";
import type { ContentType } from "@/types";

/**
 * Invalidate Next's static cache for every page that may have rendered an
 * item of the given type. Called from the admin CRUD APIs (right after a
 * create/update/delete) and from the bulk-generation script (via the
 * revalidate endpoint).
 */
export function revalidateForType(typeKey: ContentType, slug?: string): void {
  const t = adminTypeByKey(typeKey) as AdminType | undefined;
  if (!t) return;

  // Always invalidate the home — it surfaces featured tools and recent items.
  revalidatePath("/");

  // List page.
  revalidatePath(`/${t.route}`);

  // Detail page.
  if (slug) revalidatePath(`/${t.route}/${slug}`);

  // News and tool changes also affect /lancamentos and /ferramentas/[categoria].
  if (typeKey === "news") revalidatePath("/lancamentos");
  if (typeKey === "tool" && slug) {
    // Category listing pages share the [slug] route, regenerate them too.
    revalidatePath("/ferramentas/[slug]", "page");
  }

  // Sitemap reflects new published items.
  revalidatePath("/sitemap.xml");
}
