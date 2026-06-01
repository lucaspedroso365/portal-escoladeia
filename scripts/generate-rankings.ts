/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { generateJSON, MODEL_TEXT } from "@/lib/gemini";
import { LIMIT, banner, pool, revalidate, truncate } from "./lib";

const prisma = new PrismaClient();

interface RankingSeed {
  slug: string;
  topic: string;
  title: string;
}

const RANKINGS: RankingSeed[] = [
  { slug: "melhores-ias-de-texto-2025", topic: "Texto", title: "As 10 melhores IAs de texto em 2025" },
  { slug: "melhores-ias-de-imagem-2025", topic: "Imagem", title: "As 10 melhores IAs de imagem em 2025" },
  { slug: "melhores-ias-de-video-2025", topic: "Vídeo", title: "As 10 melhores IAs de vídeo em 2025" },
  { slug: "melhores-ias-de-audio-2025", topic: "Áudio", title: "As 10 melhores IAs de áudio em 2025" },
  { slug: "melhores-ias-para-programar-2025", topic: "Programação", title: "As 10 melhores IAs para programar em 2025" },
  { slug: "melhores-ias-gratuitas-2025", topic: "Gratuitas", title: "As 10 melhores IAs gratuitas em 2025" },
  { slug: "melhores-ias-para-marketing-2025", topic: "Marketing", title: "As 10 melhores IAs para marketing em 2025" },
  { slug: "melhores-ias-para-criar-conteudo-2025", topic: "Conteúdo", title: "As 10 melhores IAs para criar conteúdo em 2025" },
  { slug: "melhores-apis-de-ia-2025", topic: "APIs", title: "As 10 melhores APIs de IA em 2025" },
  { slug: "melhores-ias-para-produtividade-2025", topic: "Produtividade", title: "As 10 melhores IAs para produtividade em 2025" },
];

function prompt(r: RankingSeed): string {
  return `Crie um ranking de "${r.title}" em português brasileiro.
Use apenas ferramentas que você conhece, com nomes corretos. Cada posição com 2-4 parágrafos de justificativa.

Retorne JSON: {
  "title": string (= "${r.title}" ou variação curta),
  "excerpt": string (até 160 chars),
  "content": string (markdown 1200+ palavras começando com lista NUMERADA "1.", "2.", ..., com H3 por posição contendo o nome da ferramenta),
  "topic": string (= "${r.topic}"),
  "metaTitle": string (até 60 chars),
  "metaDescription": string (até 160 chars)
}
RESPONDA APENAS COM JSON VÁLIDO. Sem markdown fences. Sem texto extra.`;
}

interface Payload {
  title?: string;
  excerpt?: string;
  content?: string;
  topic?: string;
  metaTitle?: string;
  metaDescription?: string;
}

async function main() {
  const existing = await prisma.ranking.findMany({
    where: { slug: { in: RANKINGS.map((r) => r.slug) } },
    select: { slug: true },
  });
  const done = new Set(existing.map((r) => r.slug));
  const eligible = RANKINGS.filter((r) => !done.has(r.slug));
  const items = LIMIT > 0 ? eligible.slice(0, LIMIT) : eligible;
  const total = items.length;

  console.log(`${eligible.length}/${RANKINGS.length} rankings a gerar.`);
  banner("generate-rankings", total, MODEL_TEXT);
  if (total === 0) {
    await prisma.$disconnect();
    return;
  }

  let ok = 0;
  let fail = 0;

  await pool(items, async (r, idx) => {
    const tag = `[${idx + 1}/${total}] ${r.title}`;
    try {
      const data = await generateJSON<Payload>(prompt(r), false);
      if (!data?.title || !data?.content) throw new Error("payload incompleto");
      await prisma.ranking.create({
        data: {
          title: truncate(data.title, 200),
          slug: r.slug,
          excerpt: data.excerpt ? truncate(data.excerpt, 240) : null,
          content: data.content,
          topic: data.topic || r.topic,
          published: true,
          publishedAt: new Date(),
          metaTitle: data.metaTitle ? truncate(data.metaTitle, 70) : null,
          metaDescription: data.metaDescription ? truncate(data.metaDescription, 240) : null,
        },
      });
      await revalidate("ranking", r.slug);
      ok++;
      console.log(`${tag} — OK`);
    } catch (e) {
      fail++;
      console.log(`${tag} — ERRO: ${(e as Error).message}`);
    }
  });

  console.log(`\n✅ Concluído. OK: ${ok}  Erros: ${fail}`);
  await revalidate("ranking");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
