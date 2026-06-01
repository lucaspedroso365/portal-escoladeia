import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { generateJSON, MODEL_TEXT } from "@/lib/gemini";

const prisma = new PrismaClient();

const CONCURRENCY = Number(process.env.CONCURRENCY ?? 3);
const DELAY_MS = Number(process.env.DELAY_MS ?? 1000);
const LIMIT = Number(process.env.LIMIT ?? 0); // 0 = sem limite
const REVALIDATE_URL =
  process.env.REVALIDATE_URL ?? "http://127.0.0.1:3001/api/admin/revalidate";
const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN ?? "";

async function revalidate(slug: string): Promise<void> {
  if (!REVALIDATE_TOKEN) return; // silenciosamente skipa se não configurado
  try {
    await fetch(REVALIDATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${REVALIDATE_TOKEN}`,
      },
      body: JSON.stringify({ typeKey: "tool", slug }),
    });
  } catch {
    /* não falha o seed por causa de revalidação */
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function buildPrompt(name: string): string {
  return `Você é especialista em ferramentas de IA. Sobre ${name}, gere em português brasileiro:
- description: texto completo com 800+ palavras sobre a ferramenta, em markdown com cabeçalhos H2 (##) e H3 (###), tom informativo e neutro.
- howToUse: passo a passo de como usar (markdown com H2/H3, etapas numeradas e dicas práticas).
- pricing: detalhamento dos planos e preços atuais (markdown).
- pros: array com EXATAMENTE 5 pontos positivos curtos.
- cons: array com EXATAMENTE 5 pontos negativos curtos.
- metaTitle: título SEO até 60 caracteres.
- metaDescription: descrição SEO até 160 caracteres.

Retorne JSON {"description", "howToUse", "pricing", "pros", "cons", "metaTitle", "metaDescription"}.

RESPONDA APENAS COM JSON VÁLIDO. Sem markdown fences. Sem texto extra.`;
}

interface GeneratedTool {
  description?: string;
  howToUse?: string;
  pricing?: string;
  pros?: unknown;
  cons?: unknown;
  metaTitle?: string;
  metaDescription?: string;
}

async function pool<T>(items: T[], worker: (item: T, idx: number) => Promise<void>) {
  let i = 0;
  async function runner() {
    while (i < items.length) {
      const idx = i++;
      await worker(items[idx], idx);
      if (DELAY_MS) await sleep(DELAY_MS);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, runner)
  );
}

async function main() {
  // Idempotente: só pega Tools sem description útil. O campo é NOT NULL no
  // schema, então só pode estar vazio.
  const allPending = await prisma.tool.findMany({
    where: { description: "" },
    select: { id: true, name: true, slug: true },
    orderBy: { id: "asc" },
  });
  const pending = LIMIT > 0 ? allPending.slice(0, LIMIT) : allPending;

  const total = pending.length;
  console.log(`Gerando conteúdo para ${total} ferramenta(s) (${MODEL_TEXT}, concorrência ${CONCURRENCY}, delay ${DELAY_MS}ms)...`);
  if (total === 0) {
    console.log("Nada a fazer — todas as ferramentas já têm conteúdo.");
    await prisma.$disconnect();
    return;
  }

  let okCount = 0;
  let failCount = 0;

  await pool(pending, async (tool, idx) => {
    const tag = `[${idx + 1}/${total}]`;
    try {
      const data = await generateJSON<GeneratedTool>(buildPrompt(tool.name), false);
      if (!data?.description) throw new Error("resposta sem 'description'");
      await prisma.tool.update({
        where: { id: tool.id },
        data: {
          description: data.description,
          howToUse: data.howToUse ?? null,
          pricing: data.pricing ?? null,
          pros: Array.isArray(data.pros) ? data.pros : [],
          cons: Array.isArray(data.cons) ? data.cons : [],
          metaTitle: data.metaTitle ?? null,
          metaDescription: data.metaDescription ?? null,
        },
      });
      await revalidate(tool.slug);
      okCount++;
      console.log(`${tag} ${tool.name} — OK`);
    } catch (e) {
      failCount++;
      console.log(`${tag} ${tool.name} — ERRO: ${(e as Error).message}`);
    }
  });

  console.log("");
  console.log(`✅ Concluído. OK: ${okCount}  Erros: ${failCount}`);
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
