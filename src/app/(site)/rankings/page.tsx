import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { PageHero } from "@/components/PageHero";
import { ContentCard } from "@/components/ContentCard";
import { AdSense } from "@/components/AdSense";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Rankings de ferramentas de IA",
  description:
    "Os melhores rankings de ferramentas de inteligência artificial por categoria, atualizados regularmente.",
  alternates: { canonical: "/rankings" },
};

export default async function RankingsListPage() {
  const items = await safeQuery(
    () =>
      prisma.ranking.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
      }),
    []
  );

  return (
    <>
      <PageHero
        title="Rankings de IA"
        description="As melhores ferramentas de IA, ranqueadas por categoria e caso de uso."
      />
      <div className="mx-auto max-w-6xl px-4">
        <AdSense slot="rankings-leaderboard" format="leaderboard" />
        {items.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r) => (
              <ContentCard
                key={r.id}
                href={`/rankings/${r.slug}`}
                title={r.title}
                excerpt={r.excerpt}
                label={`Ranking · ${r.topic}`}
              />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-[#86868B]">Nenhum ranking publicado ainda.</p>
        )}
      </div>
    </>
  );
}
