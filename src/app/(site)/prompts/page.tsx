import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { PageHero } from "@/components/PageHero";
import { PromptsExplorer } from "@/components/PromptsExplorer";
import { AdSense } from "@/components/AdSense";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Biblioteca de prompts de IA",
  description:
    "Prompts prontos para ChatGPT, Claude, Gemini e outras IAs. Copie e use em segundos, organizados por categoria.",
  alternates: { canonical: "/prompts" },
};

export default async function PromptsPage() {
  const prompts = await safeQuery(
    () =>
      prisma.prompt.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      }),
    []
  );

  return (
    <>
      <PageHero
        title="Biblioteca de prompts"
        description="Prompts prontos para usar com as principais ferramentas de IA. Copie e cole."
      />
      <div className="mx-auto max-w-6xl px-4">
        <AdSense slot="prompts-leaderboard" format="leaderboard" />
      </div>
      <PromptsExplorer prompts={prompts} />
    </>
  );
}
