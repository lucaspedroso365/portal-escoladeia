import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { siteUrl } from "@/lib/url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const staticPaths: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, freq: "daily" },
    { path: "/ferramentas", priority: 0.9, freq: "weekly" },
    { path: "/noticias", priority: 0.9, freq: "daily" },
    { path: "/tutoriais", priority: 0.8, freq: "weekly" },
    { path: "/comparativos", priority: 0.8, freq: "weekly" },
    { path: "/rankings", priority: 0.8, freq: "weekly" },
    { path: "/alternativas", priority: 0.7, freq: "weekly" },
    { path: "/precos", priority: 0.7, freq: "weekly" },
    { path: "/prompts", priority: 0.7, freq: "weekly" },
    { path: "/glossario", priority: 0.7, freq: "monthly" },
    { path: "/lancamentos", priority: 0.7, freq: "daily" },
    { path: "/sobre", priority: 0.4, freq: "yearly" },
    { path: "/contato", priority: 0.4, freq: "yearly" },
    { path: "/privacidade", priority: 0.3, freq: "yearly" },
    { path: "/termos", priority: 0.3, freq: "yearly" },
    { path: "/cookies", priority: 0.3, freq: "yearly" },
  ];

  const [categories, tools, news, tutorials, comparisons, rankings, alternatives, prices, glossary] =
    await Promise.all([
      safeQuery(() => prisma.category.findMany({ select: { slug: true } }), []),
      safeQuery(() => prisma.tool.findMany({ select: { slug: true, updatedAt: true } }), []),
      safeQuery(
        () =>
          prisma.news.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
          }),
        []
      ),
      safeQuery(
        () =>
          prisma.tutorial.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
          }),
        []
      ),
      safeQuery(
        () =>
          prisma.comparison.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
          }),
        []
      ),
      safeQuery(
        () =>
          prisma.ranking.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
          }),
        []
      ),
      safeQuery(
        () =>
          prisma.alternative.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
          }),
        []
      ),
      safeQuery(
        () =>
          prisma.price.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
          }),
        []
      ),
      safeQuery(
        () => prisma.glossaryTerm.findMany({ select: { slug: true, updatedAt: true } }),
        []
      ),
    ]);

  const entries: MetadataRoute.Sitemap = staticPaths.map((s) => ({
    url: `${base}${s.path}`,
    lastModified: now,
    changeFrequency: s.freq,
    priority: s.priority,
  }));

  for (const c of categories) {
    entries.push({ url: `${base}/ferramentas/${c.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 });
  }
  for (const t of tools) {
    entries.push({ url: `${base}/ferramentas/${t.slug}`, lastModified: t.updatedAt, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const n of news) {
    entries.push({ url: `${base}/noticias/${n.slug}`, lastModified: n.updatedAt, changeFrequency: "daily", priority: 0.9 });
  }
  for (const t of tutorials) {
    entries.push({ url: `${base}/tutoriais/${t.slug}`, lastModified: t.updatedAt, changeFrequency: "weekly", priority: 0.7 });
  }
  for (const c of comparisons) {
    entries.push({ url: `${base}/comparativos/${c.slug}`, lastModified: c.updatedAt, changeFrequency: "weekly", priority: 0.7 });
  }
  for (const r of rankings) {
    entries.push({ url: `${base}/rankings/${r.slug}`, lastModified: r.updatedAt, changeFrequency: "weekly", priority: 0.7 });
  }
  for (const a of alternatives) {
    entries.push({ url: `${base}/alternativas/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "weekly", priority: 0.6 });
  }
  for (const p of prices) {
    entries.push({ url: `${base}/precos/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly", priority: 0.6 });
  }
  for (const g of glossary) {
    entries.push({ url: `${base}/glossario/${g.slug}`, lastModified: g.updatedAt, changeFrequency: "monthly", priority: 0.5 });
  }

  return entries;
}
