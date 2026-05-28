import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { PageHero } from "@/components/PageHero";
import { ContentCard } from "@/components/ContentCard";
import { AdSense } from "@/components/AdSense";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Preços de ferramentas de IA",
  description:
    "Quanto custam as principais ferramentas de inteligência artificial? Veja planos e preços detalhados.",
  alternates: { canonical: "/precos" },
};

export default async function PricesListPage() {
  const items = await safeQuery(
    () =>
      prisma.price.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
      }),
    []
  );

  return (
    <>
      <PageHero
        title="Preços de ferramentas de IA"
        description="Compare planos e preços das principais ferramentas de IA."
      />
      <div className="mx-auto max-w-6xl px-4">
        <AdSense slot="prices-leaderboard" format="leaderboard" />
        {items.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <ContentCard
                key={p.id}
                href={`/precos/${p.slug}`}
                title={p.title}
                label={`Preços · ${p.toolName}`}
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
