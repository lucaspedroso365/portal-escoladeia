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

const TOPICS: ((tool: string) => string)[] = [
  (t) => `como usar ${t} do zero para iniciantes`,
  (t) => `dicas avançadas e truques para ${t}`,
  (t) => `como usar ${t} para trabalho e produtividade`,
  (t) => `integrando ${t} com outras ferramentas`,
  (t) => `erros comuns ao usar ${t} e como resolver`,
];

function prompt(toolName: string, topic: string): string {
  return `Você é especialista em ${toolName}. Crie um tutorial completo em português brasileiro sobre ${toolName} com tema "${topic}".
Use apenas informações reais que você conhece sobre a ferramenta. Não invente recursos ou números específicos.

Retorne JSON: {
  "title": string (até 70 chars, com o nome da ferramenta),
  "slug": string,
  "excerpt": string (até 160 chars),
  "content": string (markdown 800+ palavras com H2 e H3),
  "difficulty": "iniciante" | "intermediario" | "avancado",
  "readingTime": number (minutos),
  "metaTitle": string (até 60 chars),
  "metaDescription": string (até 160 chars)
}
RESPONDA APENAS COM JSON VÁLIDO. Sem markdown fences. Sem texto extra.`;
}

interface Payload {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  difficulty?: string;
  readingTime?: number;
  metaTitle?: string;
  metaDescription?: string;
}

async function main() {
  const allTools = await prisma.tool.findMany({
    select: { id: true, name: true, slug: true, _count: { select: { tutorials: true } } },
    orderBy: { id: "asc" },
  });
  const eligible = allTools.filter((t) => t._count.tutorials < TOPICS.length);
  const tools = LIMIT > 0 ? eligible.slice(0, LIMIT) : eligible;

  type Job = { tool: (typeof tools)[number]; topic: string; topicIdx: number };
  const jobs: Job[] = [];
  for (const tool of tools) {
    TOPICS.forEach((topicFn, idx) =>
      jobs.push({ tool, topic: topicFn(tool.name), topicIdx: idx })
    );
  }
  const total = jobs.length;

  console.log(
    `${eligible.length}/${allTools.length} ferramentas precisam de tutoriais.`
  );
  banner("generate-tutorials", total, MODEL_TEXT);
  if (total === 0) {
    await prisma.$disconnect();
    return;
  }

  let ok = 0;
  let fail = 0;

  await pool(jobs, async (job, idx) => {
    const tag = `[${idx + 1}/${total}] ${job.tool.name} — Tutorial ${job.topicIdx + 1}/5`;
    try {
      const data = await generateJSON<Payload>(prompt(job.tool.name, job.topic), false);
      if (!data?.title || !data?.content) throw new Error("payload incompleto");
      const difficulty = ["iniciante", "intermediario", "avancado"].includes(
        data.difficulty ?? ""
      )
        ? (data.difficulty as string)
        : "iniciante";

      const { slug } = await createWithUniqueSlug(
        data.slug || data.title,
        job.tool.slug,
        (slug) =>
          prisma.tutorial.create({
            data: {
              title: truncate(data.title!, 200),
              slug,
              excerpt: data.excerpt ? truncate(data.excerpt, 240) : null,
              content: data.content!,
              difficulty,
              readingTime: typeof data.readingTime === "number" ? data.readingTime : 7,
              published: true,
              publishedAt: new Date(),
              toolId: job.tool.id,
              metaTitle: data.metaTitle ? truncate(data.metaTitle, 70) : null,
              metaDescription: data.metaDescription
                ? truncate(data.metaDescription, 240)
                : null,
            },
          })
      );
      await revalidate("tutorial", slug);
      ok++;
      console.log(`${tag} — OK`);
    } catch (e) {
      fail++;
      console.log(`${tag} — ERRO: ${(e as Error).message}`);
    }
  });

  console.log(`\n✅ Concluído. OK: ${ok}  Erros: ${fail}`);
  await revalidate("tutorial"); // refresh list page once at the end
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
