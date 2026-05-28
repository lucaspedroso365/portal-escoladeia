import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number.parseInt(id, 10);
  if (Number.isNaN(numId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }
  try {
    await prisma.news.update({
      where: { id: numId },
      data: { views: { increment: 1 } },
    });
  } catch {
    /* swallow — view counting is best-effort */
  }
  return NextResponse.json({ ok: true });
}
