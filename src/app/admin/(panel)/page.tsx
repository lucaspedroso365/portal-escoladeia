import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { Card } from "@/components/Card";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    news,
    tools,
    tutorials,
    comparisons,
    rankings,
    alternatives,
    prices,
    prompts,
    glossary,
    recent,
    last30,
  ] = await Promise.all([
    safeQuery(() => prisma.news.count(), 0),
    safeQuery(() => prisma.tool.count(), 0),
    safeQuery(() => prisma.tutorial.count(), 0),
    safeQuery(() => prisma.comparison.count(), 0),
    safeQuery(() => prisma.ranking.count(), 0),
    safeQuery(() => prisma.alternative.count(), 0),
    safeQuery(() => prisma.price.count(), 0),
    safeQuery(() => prisma.prompt.count(), 0),
    safeQuery(() => prisma.glossaryTerm.count(), 0),
    safeQuery(
      () =>
        prisma.news.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { tool: true },
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.news.findMany({
          where: {
            published: true,
            publishedAt: { gte: new Date(Date.now() - 30 * 86400000) },
          },
          select: { publishedAt: true },
        }),
      []
    ),
  ]);

  const metrics = [
    { label: "Notícias", value: news, route: "noticias", icon: "news" },
    { label: "Ferramentas", value: tools, route: "ferramentas", icon: "tool" },
    { label: "Tutoriais", value: tutorials, route: "tutoriais", icon: "tutorial" },
    { label: "Comparativos", value: comparisons, route: "comparativos", icon: "comparison" },
    { label: "Rankings", value: rankings, route: "rankings", icon: "ranking" },
    { label: "Alternativas", value: alternatives, route: "alternativas", icon: "alternative" },
    { label: "Preços", value: prices, route: "precos", icon: "price" },
    { label: "Prompts", value: prompts, route: "prompts", icon: "prompt" },
    { label: "Glossário", value: glossary, route: "glossario", icon: "glossary" },
  ];

  // 30-day publish buckets
  const buckets = new Array(30).fill(0);
  for (const n of last30) {
    if (!n.publishedAt) continue;
    const offset = Math.floor((Date.now() - new Date(n.publishedAt).getTime()) / 86400000);
    if (offset >= 0 && offset < 30) buckets[29 - offset]++;
  }
  const maxBucket = Math.max(1, ...buckets);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-[#86868B]">Visão geral do conteúdo do portal.</p>

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map((m) => (
          <Link key={m.route} href={`/admin/${m.route}`}>
            <Card className="flex flex-col gap-2 p-4 transition hover:-translate-y-0.5">
              <AdminIcon name={m.icon} size={20} className="text-[#CC785C]" />
              <div>
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-xs text-[#86868B]">{m.label}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Chart */}
      <Card className="mt-6 p-5">
        <h2 className="text-sm font-semibold">Notícias publicadas (últimos 30 dias)</h2>
        <div className="mt-4 flex h-32 items-end gap-1">
          {buckets.map((b, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-[#CC785C]/80"
              style={{ height: `${(b / maxBucket) * 100}%`, minHeight: b > 0 ? 4 : 1 }}
              title={`${b} publicação(ões)`}
            />
          ))}
        </div>
      </Card>

      {/* Recent */}
      <Card className="mt-6 p-5">
        <h2 className="text-sm font-semibold">Últimas notícias</h2>
        <div className="mt-3 divide-y divide-black/5">
          {recent.length === 0 && (
            <p className="py-4 text-sm text-[#86868B]">Nenhuma publicação ainda.</p>
          )}
          {recent.map((n) => (
            <div key={n.id} className="flex items-center justify-between gap-4 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{n.title}</p>
                <p className="text-xs text-[#86868B]">
                  {n.tool?.name ? `${n.tool.name} · ` : ""}
                  {formatDate(n.publishedAt ?? n.createdAt)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  n.published ? "bg-green-50 text-green-700" : "bg-[#F5F5F7] text-[#86868B]"
                }`}
              >
                {n.published ? "Publicado" : "Rascunho"}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
