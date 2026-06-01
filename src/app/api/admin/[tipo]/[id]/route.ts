import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { adminTypeByKey } from "@/lib/admin";
import { ADMIN_FIELDS } from "@/lib/admin-fields";
import { coercePayload } from "@/lib/admin-data";
import { revalidateForType } from "@/lib/revalidate";

/* eslint-disable @typescript-eslint/no-explicit-any */

async function resolve(params: Promise<{ tipo: string; id: string }>) {
  const { tipo, id } = await params;
  const type = adminTypeByKey(tipo);
  const numId = Number.parseInt(id, 10);
  return { type, numId };
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ tipo: string; id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { type, numId } = await resolve(params);
  if (!type) return NextResponse.json({ error: "Tipo inválido" }, { status: 404 });
  if (Number.isNaN(numId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const schema = ADMIN_FIELDS[type.key];
  const data = coercePayload(type.key, body);

  if (schema.hasPublished) {
    const existing = await (prisma as any)[type.model].findUnique({ where: { id: numId } });
    const nowPublished = Boolean(body.published);
    data.published = nowPublished;
    if (nowPublished && !existing?.published) data.publishedAt = new Date();
    else if (!nowPublished) data.publishedAt = null;
  }

  try {
    const updated = await (prisma as any)[type.model].update({
      where: { id: numId },
      data,
    });
    revalidateForType(type.key, (updated as { slug?: string }).slug);
    return NextResponse.json(updated);
  } catch (e) {
    console.error(`[admin:update]`, e);
    return NextResponse.json({ error: "Falha ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ tipo: string; id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { type, numId } = await resolve(params);
  if (!type) return NextResponse.json({ error: "Tipo inválido" }, { status: 404 });
  if (Number.isNaN(numId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  try {
    const before = await (prisma as any)[type.model].findUnique({
      where: { id: numId },
      select: { slug: true },
    });
    await (prisma as any)[type.model].delete({ where: { id: numId } });
    revalidateForType(type.key, before?.slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(`[admin:delete]`, e);
    return NextResponse.json({ error: "Falha ao excluir" }, { status: 500 });
  }
}
