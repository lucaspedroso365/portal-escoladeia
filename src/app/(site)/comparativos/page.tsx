import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { PageHero } from "@/components/PageHero";
import { ContentCard } from "@/components/ContentCard";
import { AdSense } from "@/components/AdSense";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Comparativos de ferramentas de IA",
  description:
    "Comparativos imparciais entre as principais ferramentas de inteligência artificial. Descubra qual é a melhor para você.",
  alternates: { canonical: "/comparativos" },
};

export default async function ComparisonsListPage() {
  const items = await safeQuery(
    () =>
      prisma.comparison.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
      }),
    []
  );

  return (
    <>
      <PageHero
        title="Comparativos de IA"
        description="Comparações lado a lado das principais ferramentas de IA para você escolher a certa."
      />
      <div className="mx-auto max-w-6xl px-4">
        <AdSense slot="comparisons-leaderboard" format="leaderboard" />
        {items.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <ContentCard
                key={c.id}
                href={`/comparativos/${c.slug}`}
                title={c.title}
                excerpt={c.excerpt}
                label="Comparativo"
              />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-[#86868B]">Nenhum comparativo publicado ainda.</p>
        )}
      </div>
    </>
  );
}
