import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { PageHero } from "@/components/PageHero";
import { ContentCard } from "@/components/ContentCard";
import { AdSense } from "@/components/AdSense";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Alternativas a ferramentas de IA",
  description:
    "Descubra as melhores alternativas às principais ferramentas de inteligência artificial.",
  alternates: { canonical: "/alternativas" },
};

export default async function AlternativesListPage() {
  const items = await safeQuery(
    () =>
      prisma.alternative.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
      }),
    []
  );

  return (
    <>
      <PageHero
        title="Alternativas de IA"
        description="As melhores alternativas às ferramentas de IA mais populares."
      />
      <div className="mx-auto max-w-6xl px-4">
        <AdSense slot="alternatives-leaderboard" format="leaderboard" />
        {items.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <ContentCard
                key={a.id}
                href={`/alternativas/${a.slug}`}
                title={a.title}
                excerpt={a.excerpt}
                label="Alternativas"
              />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-[#86868B]">Nenhuma página publicada ainda.</p>
        )}
      </div>
    </>
  );
}
