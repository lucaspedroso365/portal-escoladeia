import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { adminTypeByKey } from "@/lib/admin";
import { ADMIN_FIELDS } from "@/lib/admin-fields";
import { coercePayload } from "@/lib/admin-data";
import { revalidateForType } from "@/lib/revalidate";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tipo: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { tipo } = await params;
  const type = adminTypeByKey(tipo);
  if (!type) return NextResponse.json({ error: "Tipo inválido" }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const schema = ADMIN_FIELDS[type.key];
  const guard = z.object({ [schema.slugFrom]: z.string().min(1, "Campo obrigatório") }).passthrough();
  const parsed = guard.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const data = coercePayload(type.key, body);
  if (schema.hasPublished) {
    data.published = Boolean(body.published);
    data.publishedAt = data.published ? new Date() : null;
  }

  try {
    const created = await (prisma as any)[type.model].create({ data });
    revalidateForType(type.key, (created as { slug?: string }).slug);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error(`[admin:${tipo}:create]`, e);
    return NextResponse.json({ error: "Falha ao salvar" }, { status: 500 });
  }
}
