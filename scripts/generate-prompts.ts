/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { generateJSON, MODEL_TEXT } from "@/lib/gemini";
import {
  LIMIT,
  banner,
  createWithUniqueSlug,
  pool,
  revalidate,
  truncate,
} from "./lib";

const prisma = new PrismaClient();

const PROMPTS_PER_TOOL = 5;

function prompt(toolName: string): string {
  return `Você é especialista em prompts para ${toolName}. Crie ${PROMPTS_PER_TOOL} prompts prontos para usar em português brasileiro.

Retorne um JSON ARRAY com EXATAMENTE ${PROMPTS_PER_TOOL} objetos, cada um no formato:
{
  "title": string (nome do prompt, até 60 chars),
  "slug": string,
  "promptText": string (o prompt completo, pronto para colar — pode usar placeholders [ASSIM]),
  "description": string (1-2 frases sobre quando e como usar),
  "category": string (ex.: "escrita", "código", "marketing", "produtividade", "imagem", "educação"),
  "tags": string[] (3-5 tags curtas),
  "metaTitle": string (até 60 chars),
  "metaDescription": string (até 160 chars)
}

RESPONDA APENAS COM JSON VÁLIDO (array com ${PROMPTS_PER_TOOL} itens). Sem markdown fences. Sem texto extra.`;
}

interface PromptItem {
  title?: string;
  slug?: string;
  promptText?: string;
  description?: string;
  category?: string;
  tags?: unknown;
  metaTitle?: string;
  metaDescription?: string;
}

async function main() {
  const allTools = await prisma.tool.findMany({
    select: { id: true, name: true, slug: true, _count: { select: { prompts: true } } },
    orderBy: { id: "asc" },
  });
  const eligible = allTools.filter((t) => t._count.prompts < PROMPTS_PER_TOOL);
  const tools = LIMIT > 0 ? eligible.slice(0, LIMIT) : eligible;
  const total = tools.length;

  console.log(`${eligible.length}/${allTools.length} ferramentas precisam de prompts.`);
  banner("generate-prompts", total, MODEL_TEXT);
  if (total === 0) {
    await prisma.$disconnect();
    return;
  }

  let ok = 0;
  let fail = 0;

  await pool(tools, async (tool, idx) => {
    const tag = `[${idx + 1}/${total}] ${tool.name}`;
    try {
      const data = await generateJSON<PromptItem[]>(prompt(tool.name), false);
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("resposta não é um array");
      }
      let createdCount = 0;
      for (const p of data.slice(0, PROMPTS_PER_TOOL)) {
        if (!p?.title || !p?.promptText) continue;
        try {
          const tagsArray = Array.isArray(p.tags)
            ? (p.tags as unknown[]).map(String).filter(Boolean)
            : [];
          if (!tagsArray.includes(tool.slug)) tagsArray.push(tool.slug);

          await createWithUniqueSlug(
            p.slug || p.title,
            tool.slug,
            (slug) =>
              prisma.prompt.create({
                data: {
                  title: truncate(p.title!, 200),
                  slug,
                  promptText: p.promptText!,
                  description: p.description ? truncate(p.description, 240) : null,
                  category: p.category || "geral",
                  tags: tagsArray,
                  metaTitle: p.metaTitle ? truncate(p.metaTitle, 70) : null,
                  metaDescription: p.metaDescription
                    ? truncate(p.metaDescription, 240)
                    : null,
                  published: true,
                  toolId: tool.id,
                },
              })
          );
          createdCount++;
        } catch {
          /* segue para o próximo prompt do array */
        }
      }
      if (createdCount === 0) throw new Error("nenhum prompt válido no array");
      ok++;
      console.log(`${tag} — ${createdCount} prompt(s) — OK`);
    } catch (e) {
      fail++;
      console.log(`${tag} — ERRO: ${(e as Error).message}`);
    }
  });

  console.log(`\n✅ Concluído. Ferramentas OK: ${ok}  Erros: ${fail}`);
  await revalidate("prompt");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
