import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { CATEGORIES } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";
import { ToolsExplorer } from "@/components/ToolsExplorer";
import { AdSense } from "@/components/AdSense";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Todas as ferramentas de IA",
  description:
    "Catálogo completo de ferramentas de inteligência artificial: texto, imagem, vídeo, áudio, código e APIs. Filtre por categoria e preço.",
  alternates: { canonical: "/ferramentas" },
};

export default async function ToolsCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";

  const tools = await safeQuery(
    () =>
      prisma.tool.findMany({
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
        include: { category: true },
      }),
    []
  );

  return (
    <>
      <PageHero
        title="Todas as ferramentas de IA"
        description="Explore o catálogo completo de ferramentas de inteligência artificial em português. Filtre por categoria e tipo de preço."
      />
      <ToolsExplorer
        tools={tools}
        categories={CATEGORIES.map((c) => ({ name: c.name, slug: c.slug }))}
        initialQuery={q}
      />
      <div className="mx-auto max-w-6xl px-4">
        <AdSense slot="tools-leaderboard" format="leaderboard" />
      </div>
    </>
  );
}
