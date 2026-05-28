import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { PageHero } from "@/components/PageHero";
import { TutorialsExplorer } from "@/components/TutorialsExplorer";
import { AdSense } from "@/components/AdSense";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Tutoriais de IA",
  description:
    "Tutoriais passo a passo para dominar as ferramentas de inteligência artificial, do básico ao avançado.",
  alternates: { canonical: "/tutoriais" },
};

export default async function TutorialsListPage() {
  const [tutorials, tools] = await Promise.all([
    safeQuery(
      () =>
        prisma.tutorial.findMany({
          where: { published: true },
          orderBy: { publishedAt: "desc" },
        }),
      []
    ),
    safeQuery(
      () => prisma.tool.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      []
    ),
  ]);

  return (
    <>
      <PageHero
        title="Tutoriais de IA"
        description="Aprenda a usar as ferramentas de IA com guias passo a passo, do básico ao avançado."
      />
      <div className="mx-auto max-w-6xl px-4">
        <AdSense slot="tutorials-leaderboard" format="leaderboard" />
      </div>
      <TutorialsExplorer tutorials={tutorials} tools={tools} />
    </>
  );
}
