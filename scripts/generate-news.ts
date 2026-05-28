import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { generateJSON } from "@/lib/gemini";
import { getSystemPrompt } from "@/lib/prompts";

const prisma = new PrismaClient();

const COUNT = Number(process.argv[2] ?? process.env.COUNT ?? 5);
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 3);
const DELAY_MS = Number(process.env.DELAY_MS ?? 1000);
const GROUNDING = process.env.GROUNDING === "true";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function pool<T>(items: T[], worker: (item: T) => Promise<void>) {
  let index = 0;
  async function runner() {
    while (index < items.length) {
      const current = items[index++];
      await worker(current);
      await sleep(DELAY_MS);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, runner));
}

async function main() {
  console.log(`Gerando ${COUNT} notícia(s)${GROUNDING ? " (com grounding)" : ""}...`);
  const slots = Array.from({ length: COUNT }, (_, i) => i + 1);

  await pool(slots, async (i) => {
    try {
      const prompt = `${getSystemPrompt("news")}\n\nInstrução: Escreva uma notícia recente, original e relevante sobre inteligência artificial (variação ${i}). Escolha um tema atual diferente a cada vez (lançamentos, atualizações, mercado ou análises).`;
      const data = await generateJSON<{
        title: string;
        excerpt?: string;
        content: string;
        metaTitle?: string;
        metaDescription?: string;
        category?: string;
      }>(prompt, GROUNDING);

      if (!data?.title || !data?.content) {
        console.error(`✗ slot ${i}: resposta incompleta`);
        return;
      }

      let slug = slugify(data.title);
      const exists = await prisma.news.findUnique({ where: { slug } });
      if (exists) slug = `${slug}-${Date.now().toString().slice(-5)}`;

      await prisma.news.create({
        data: {
          title: data.title,
          slug,
          excerpt: data.excerpt ?? null,
          content: data.content,
          category: data.category ?? "novidade",
          metaTitle: data.metaTitle ?? null,
          metaDescription: data.metaDescription ?? null,
          published: true,
          publishedAt: new Date(),
        },
      });
      console.log(`✓ ${data.title}`);
    } catch (e) {
      console.error(`✗ slot ${i}:`, (e as Error).message);
    }
  });

  await prisma.$disconnect();
  console.log("✅ Concluído.");
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
