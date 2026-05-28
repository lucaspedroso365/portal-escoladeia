import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();

  try {
    const existing = await prisma.newsletter.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 409 });
    }
    await prisma.newsletter.create({ data: { email } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[newsletter]", e);
    return NextResponse.json({ error: "Falha ao cadastrar" }, { status: 500 });
  }
}
