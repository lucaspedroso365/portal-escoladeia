/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { generateJSON, MODEL_TEXT } from "@/lib/gemini";
import { LIMIT, banner, pool, revalidate, truncate } from "./lib";

const prisma = new PrismaClient();

/** 40 comparativos prioritários (slugs no formato "<a>-vs-<b>"). */
const COMPARISONS: string[] = [
  "chatgpt-vs-claude",
  "chatgpt-vs-gemini",
  "claude-vs-gemini",
  "chatgpt-vs-grok",
  "gemini-vs-grok",
  "perplexity-vs-chatgpt",
  "midjourney-vs-dall-e",
  "midjourney-vs-stable-diffusion",
  "midjourney-vs-flux",
  "dall-e-vs-stable-diffusion",
  "dall-e-vs-firefly",
  "flux-vs-stable-diffusion",
  "sora-vs-runway",
  "runway-vs-pika",
  "pika-vs-kling",
  "elevenlabs-vs-play-ht",
  "elevenlabs-vs-murf-ai",
  "suno-vs-udio",
  "github-copilot-vs-cursor",
  "cursor-vs-windsurf",
  "cursor-vs-codeium",
  "github-copilot-vs-codeium",
  "v0-vs-bolt",
  "replit-vs-cursor",
  "chatgpt-vs-perplexity",
  "claude-vs-perplexity",
  "gemini-vs-copilot",
  "notion-ai-vs-chatgpt",
  "jasper-vs-copy-ai",
  "writesonic-vs-jasper",
  "heygen-vs-synthesia",
  "heygen-vs-d-id",
  "opus-clip-vs-descript",
  "openai-api-vs-anthropic-api",
  "openai-api-vs-google-ai-studio",
  "groq-api-vs-openai-api",
  "replicate-vs-hugging-face-api",
  "midjourney-vs-ideogram",
  "leonardo-ai-vs-midjourney",
  "stable-diffusion-vs-firefly",
];

function splitVs(slug: string): [string, string] {
  const i = slug.indexOf("-vs-");
  if (i === -1) throw new Error(`slug sem "-vs-": ${slug}`);
  return [slug.slice(0, i), slug.slice(i + 4)];
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
    .join(" ");
}

function prompt(tool1: string, tool2: string): string {
  return `Comparativo imparcial entre ${tool1} e ${tool2} em português brasileiro.
Use apenas informações reais. Compare em critérios como recursos, qualidade, preço, facilidade de uso, casos de uso, comunidade.

Retorne JSON: {
  "title": string (até 70 chars, ex.: "${tool1} vs ${tool2}: ..."),
  "excerpt": string (até 160 chars),
  "content": string (markdown 1000+ palavras com H2 por critério),
  "verdict": string (conclusão final, 150-220 palavras),
  "tool1Name": string (= "${tool1}"),
  "tool2Name": string (= "${tool2}"),
  "metaTitle": string (até 60 chars),
  "metaDescription": string (até 160 chars)
}
RESPONDA APENAS COM JSON VÁLIDO. Sem markdown fences. Sem texto extra.`;
}

interface Payload {
  title?: string;
  excerpt?: string;
  content?: string;
  verdict?: string;
  tool1Name?: string;
  tool2Name?: string;
  metaTitle?: string;
  metaDescription?: string;
}

async function main() {
  // Carrega tools para mapear slug -> nome real.
  const tools = await prisma.tool.findMany({ select: { slug: true, name: true } });
  const nameBySlug = new Map(tools.map((t) => [t.slug, t.name]));

  // Filtra os que ainda não foram gerados (idempotente).
  const existing = await prisma.comparison.findMany({
    where: { slug: { in: COMPARISONS } },
    select: { slug: true },
  });
  const done = new Set(existing.map((c) => c.slug));
  const eligible = COMPARISONS.filter((s) => !done.has(s));
  const slugs = LIMIT > 0 ? eligible.slice(0, LIMIT) : eligible;
  const total = slugs.length;

  console.log(`${eligible.length}/${COMPARISONS.length} comparativos a gerar.`);
  banner("generate-comparisons", total, MODEL_TEXT);
  if (total === 0) {
    await prisma.$disconnect();
    return;
  }

  let ok = 0;
  let fail = 0;

  await pool(slugs, async (slug, idx) => {
    const [s1, s2] = splitVs(slug);
    const tool1 = nameBySlug.get(s1) ?? titleCase(s1);
    const tool2 = nameBySlug.get(s2) ?? titleCase(s2);
    const tag = `[${idx + 1}/${total}] ${tool1} vs ${tool2}`;
    try {
      const data = await generateJSON<Payload>(prompt(tool1, tool2), false);
      if (!data?.title || !data?.content) throw new Error("payload incompleto");
      await prisma.comparison.create({
        data: {
          title: truncate(data.title, 200),
          slug, // mantém o slug pré-definido pela lista
          excerpt: data.excerpt ? truncate(data.excerpt, 240) : null,
          content: data.content,
          verdict: data.verdict ? truncate(data.verdict, 800) : null,
          tool1Name: data.tool1Name || tool1,
          tool2Name: data.tool2Name || tool2,
          published: true,
          publishedAt: new Date(),
          metaTitle: data.metaTitle ? truncate(data.metaTitle, 70) : null,
          metaDescription: data.metaDescription ? truncate(data.metaDescription, 240) : null,
        },
      });
      await revalidate("comparison", slug);
      ok++;
      console.log(`${tag} — OK`);
    } catch (e) {
      fail++;
      console.log(`${tag} — ERRO: ${(e as Error).message}`);
    }
  });

  console.log(`\n✅ Concluído. OK: ${ok}  Erros: ${fail}`);
  await revalidate("comparison");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
