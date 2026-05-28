import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { PageHero } from "@/components/PageHero";
import { AdSense } from "@/components/AdSense";
import { formatDate } from "@/lib/utils";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Lançamentos de IA",
  description:
    "Linha do tempo dos lançamentos de ferramentas e modelos de inteligência artificial.",
  alternates: { canonical: "/lancamentos" },
};

const PERIODS = [
  { key: "tudo", label: "Tudo" },
  { key: "semana", label: "Última semana" },
  { key: "mes", label: "Último mês" },
  { key: "ano", label: "Último ano" },
];

function sinceFor(period: string): Date | null {
  const day = 86400000;
  if (period === "semana") return new Date(Date.now() - 7 * day);
  if (period === "mes") return new Date(Date.now() - 30 * day);
  if (period === "ano") return new Date(Date.now() - 365 * day);
  return null;
}

export default async function LaunchesPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const sp = await searchParams;
  const period = sp.period ?? "tudo";
  const since = sinceFor(period);

  const items = await safeQuery(
    () =>
      prisma.news.findMany({
        where: {
          published: true,
          category: "lancamento",
          ...(since ? { publishedAt: { gte: since } } : {}),
        },
        orderBy: { publishedAt: "desc" },
        include: { tool: true },
      }),
    []
  );

  // Group by "month year"
  const groups: { label: string; items: typeof items }[] = [];
  for (const n of items) {
    const d = new Date(n.publishedAt ?? n.createdAt);
    const label = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    let g = groups.find((x) => x.label === label);
    if (!g) {
      g = { label, items: [] };
      groups.push(g);
    }
    g.items.push(n);
  }

  return (
    <>
      <PageHero
        title="Lançamentos de IA"
        description="A linha do tempo dos principais lançamentos do mundo da inteligência artificial."
      />

      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-8 flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <Link
              key={p.key}
              href={p.key === "tudo" ? "/lancamentos" : `/lancamentos?period=${p.key}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                period === p.key
                  ? "bg-[#1A1A1A] text-white"
                  : "bg-[#F5F5F7] text-[#1A1A1A] hover:bg-black/5"
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>

        <AdSense slot="launches-leaderboard" format="leaderboard" />

        {groups.length === 0 ? (
          <p className="py-20 text-center text-[#86868B]">
            Nenhum lançamento neste período.
          </p>
        ) : (
          <div className="space-y-10">
            {groups.map((g) => (
              <div key={g.label}>
                <h2 className="mb-4 text-lg font-bold capitalize">{g.label}</h2>
                <div className="ml-2 border-l-2 border-black/5 pl-6">
                  {g.items.map((n) => (
                    <div key={n.id} className="relative pb-7">
                      <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-[#CC785C] ring-4 ring-white" />
                      <p className="text-xs text-[#86868B]">
                        {formatDate(n.publishedAt ?? n.createdAt)}
                        {n.tool?.name ? ` · ${n.tool.name}` : ""}
                      </p>
                      <Link
                        href={`/noticias/${n.slug}`}
                        className="mt-1 block text-lg font-semibold leading-snug hover:text-[#CC785C]"
                      >
                        {n.title}
                      </Link>
                      {n.excerpt && (
                        <p className="mt-1 line-clamp-2 text-sm text-[#86868B]">{n.excerpt}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
