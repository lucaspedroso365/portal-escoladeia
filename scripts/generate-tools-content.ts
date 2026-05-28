import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { generateJSON } from "@/lib/gemini";
import { getSystemPrompt } from "@/lib/prompts";

const prisma = new PrismaClient();

const CONCURRENCY = Number(process.env.CONCURRENCY ?? 3);
const DELAY_MS = Number(process.env.DELAY_MS ?? 1000);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function pool<T>(items: T[], worker: (item: T) => Promise<void>) {
  let index = 0;
  async function runner() {
    while (index < items.length) {
      const current = items[index++];
      await worker(current);
      await sleep(DELAY_MS);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, runner)
  );
}

async function main() {
  // Tools still missing generated content (no howToUse yet).
  const tools = await prisma.tool.findMany({
    where: { howToUse: null },
    include: { category: true },
  });
  console.log(`Gerando conteúdo para ${tools.length} ferramenta(s)...`);

  await pool(tools, async (tool) => {
    try {
      const prompt = `${getSystemPrompt("tool")}\n\nFerramenta: ${tool.name}\nCategoria: ${
        tool.category?.name ?? ""
      }\nSite oficial: ${tool.officialUrl ?? ""}`;
      const data = await generateJSON<{
        description?: string;
        howToUse?: string;
        pricing?: string;
        pros?: string[];
        cons?: string[];
        tagline?: string;
        metaTitle?: string;
        metaDescription?: string;
      }>(prompt, false);

      await prisma.tool.update({
        where: { id: tool.id },
        data: {
          description: data.description ?? tool.description,
          howToUse: data.howToUse ?? null,
          pricing: data.pricing ?? null,
          pros: data.pros ?? [],
          cons: data.cons ?? [],
          tagline: data.tagline ?? tool.tagline,
          metaTitle: data.metaTitle ?? tool.metaTitle,
          metaDescription: data.metaDescription ?? tool.metaDescription,
        },
      });
      console.log(`✓ ${tool.name}`);
    } catch (e) {
      console.error(`✗ ${tool.name}:`, (e as Error).message);
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
