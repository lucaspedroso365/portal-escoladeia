import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { revalidateForType } from "@/lib/revalidate";
import { adminTypeByKey } from "@/lib/admin";
import type { ContentType } from "@/types";

/**
 * Invalidate static pages for a content type / slug. Accepts either an admin
 * session cookie (so the admin UI can call it) or a Bearer token matching
 * REVALIDATE_TOKEN (so bulk scripts can call it without a session).
 */
export async function POST(req: Request) {
  const token = process.env.REVALIDATE_TOKEN;
  const auth = req.headers.get("authorization") ?? "";
  const bearer = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : null;

  const validBearer = !!token && !!bearer && bearer === token;
  const session = validBearer ? null : await getSession();

  if (!validBearer && !session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let body: { typeKey?: string; slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.typeKey || !adminTypeByKey(body.typeKey)) {
    return NextResponse.json({ error: "typeKey inválido" }, { status: 400 });
  }

  revalidateForType(body.typeKey as ContentType, body.slug);
  return NextResponse.json({ ok: true });
}
