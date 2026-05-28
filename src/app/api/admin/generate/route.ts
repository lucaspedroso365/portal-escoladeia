import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateJSON, MODEL_TEXT } from "@/lib/gemini";
import { getSystemPrompt } from "@/lib/prompts";
import type { ContentType } from "@/types";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  let body: { contentType?: ContentType; instruction?: string; useGrounding?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  const { contentType, instruction, useGrounding } = body;
  if (!contentType || !instruction) {
    return NextResponse.json(
      { error: "contentType e instruction são obrigatórios" },
      { status: 400 }
    );
  }

  const systemPrompt = getSystemPrompt(contentType);
  const fullPrompt = `${systemPrompt}\n\nInstrução do usuário:\n${instruction}`;

  try {
    const data = await generateJSON<Record<string, unknown>>(
      fullPrompt,
      Boolean(useGrounding)
    );
    // Rough cost log (text generation + optional grounding).
    const estimate = useGrounding ? 0.23 : 0.05;
    console.log(`[generate] type=${contentType} model=${MODEL_TEXT} ~R$${estimate}`);
    return NextResponse.json(data);
  } catch (e) {
    console.error("[generate]", e);
    return NextResponse.json(
      { error: "Falha ao gerar conteúdo com a IA" },
      { status: 500 }
    );
  }
}
