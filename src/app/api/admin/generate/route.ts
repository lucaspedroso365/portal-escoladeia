import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateJSON, MODEL_TEXT } from "@/lib/gemini";
import { getSystemPrompt } from "@/lib/prompts";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import type { ContentType } from "@/types";

/**
 * Build the system prompt + dynamic context (lists of tools and categories
 * the model is allowed to pick from). Generating with this context lets us
 * resolve `toolName`/`categoryName` back to ids server-side after the call.
 */
async function buildPrompt(type: ContentType, instruction: string) {
  const [tools, categories] = await Promise.all([
    safeQuery(
      () => prisma.tool.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      []
    ),
    safeQuery(
      () =>
        prisma.category.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
      []
    ),
  ]);

  const sections = [getSystemPrompt(type)];
  if (tools.length) {
    sections.push(
      `Ferramentas disponíveis (use o nome EXATO):\n${tools.map((t) => `- ${t.name}`).join("\n")}`
    );
  }
  if (categories.length) {
    sections.push(
      `Categorias disponíveis (use o nome EXATO):\n${categories.map((c) => `- ${c.name}`).join("\n")}`
    );
  }
  sections.push(`Instrução do usuário:\n${instruction}`);

  return { prompt: sections.join("\n\n"), tools, categories };
}

type ResolvedData = Record<string, unknown> & {
  toolName?: unknown;
  categoryName?: unknown;
  tool1Name?: unknown;
  tool2Name?: unknown;
  targetTool?: unknown;
};

function pickByName<T extends { id: number; name: string }>(
  list: T[],
  value: unknown
): T | undefined {
  if (typeof value !== "string") return undefined;
  const norm = value.trim().toLowerCase();
  return (
    list.find((x) => x.name.toLowerCase() === norm) ||
    list.find((x) => x.name.toLowerCase().includes(norm))
  );
}

/**
 * After generation, map the model's string references (toolName, categoryName, ...)
 * to the ids the form selects expect. Original name fields are kept so other
 * form text fields (tool1Name, tool2Name, ...) still get populated.
 */
function resolveRefs(
  data: ResolvedData,
  tools: { id: number; name: string }[],
  categories: { id: number; name: string }[]
): Record<string, unknown> {
  const out = { ...data };

  const tool = pickByName(tools, out.toolName);
  if (tool) {
    out.toolId = tool.id;
    out.toolName = tool.name;
  }

  const cat = pickByName(categories, out.categoryName);
  if (cat) {
    out.categoryId = cat.id;
    out.categoryName = cat.name;
  }

  // Normalize tool1/tool2/targetTool to canonical names if found in the list
  for (const key of ["tool1Name", "tool2Name", "targetTool"] as const) {
    const match = pickByName(tools, out[key]);
    if (match) out[key] = match.name;
  }

  return out;
}

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

  const { prompt: fullPrompt, tools, categories } = await buildPrompt(contentType, instruction);

  try {
    const raw = await generateJSON<ResolvedData>(fullPrompt, Boolean(useGrounding));
    const resolved = resolveRefs(raw, tools, categories);
    const estimate = useGrounding ? 0.23 : 0.05;
    console.log(`[generate] type=${contentType} model=${MODEL_TEXT} ~R$${estimate}`);
    return NextResponse.json(resolved);
  } catch (e) {
    const err = e as { status?: number; message?: string };
    console.error("[generate]", err.message ?? e);
    if (err.status === 503 || err.status === 429) {
      return NextResponse.json(
        { error: "A IA está sobrecarregada agora. Tente novamente em alguns segundos." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Falha ao gerar conteúdo com a IA" },
      { status: 500 }
    );
  }
}
