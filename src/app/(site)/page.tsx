import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { siteUrl } from "@/lib/url";
import { SITE } from "@/lib/constants";
import { Card } from "@/components/Card";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ToolCard } from "@/components/ToolCard";
import { NewsCard } from "@/components/NewsCard";
import { ContentCard } from "@/components/ContentCard";
import { HeroSearch } from "@/components/HeroSearch";
import { AdSense } from "@/components/AdSense";
import { SectionHeading } from "@/components/SectionHeading";
import { NewsletterForm } from "@/components/NewsletterForm";
import { CoursesHighlight } from "@/components/CoursesHighlight";
import { Reveal } from "@/components/Reveal";
import { DIFFICULTY_LABELS } from "@/lib/constants";
import { formatRelativeDate } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${SITE.name} — Tudo sobre inteligência artificial`,
    description: SITE.description,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [
    categories,
    featuredTools,
    latestNews,
    popularComparisons,
    latestTutorials,
    toolCount,
    tutorialCount,
  ] = await Promise.all([
    safeQuery(
      () =>
        prisma.category.findMany({
          orderBy: { order: "asc" },
          include: { _count: { select: { tools: true } } },
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.tool.findMany({
          where: { isFeatured: true },
          take: 6,
          include: { category: true },
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.news.findMany({
          where: { published: true },
          orderBy: { publishedAt: "desc" },
          take: 3,
          include: { tool: true },
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.comparison.findMany({
          where: { published: true },
          orderBy: { publishedAt: "desc" },
          take: 6,
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.tutorial.findMany({
          where: { published: true },
          orderBy: { publishedAt: "desc" },
          take: 3,
        }),
      []
    ),
    safeQuery(() => prisma.tool.count(), 0),
    safeQuery(() => prisma.tutorial.count({ where: { published: true } }), 0),
  ]);

  const [featureNews, ...sideNews] = latestNews;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: siteUrl(),
    description: SITE.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl()}/ferramentas?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-20 pb-4 text-center sm:pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-80 max-w-5xl bg-[radial-gradient(55%_60%_at_50%_0%,rgba(204,120,92,0.12),transparent_70%)]"
        />
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#CC785C]">
              Escola de Vídeos IA
            </p>
            <h1 className="font-serif text-4xl font-medium leading-[1.06] tracking-tight text-[#1A1A1A] sm:text-6xl">
              Domine a <span className="text-[#CC785C]">inteligência artificial</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-[#6B6B63]">
              Cursos, ferramentas, tutoriais e notícias de IA — em português, pra você
              aprender e aplicar de verdade.
            </p>
            <HeroSearch />
            <p className="mt-5 text-sm text-[#86868B]">
              {toolCount || 25} ferramentas · {tutorialCount || 5}+ tutoriais · Notícias
              diárias
            </p>
          </div>
        </Reveal>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* Cursos em destaque */}
        <Reveal>
          <CoursesHighlight />
        </Reveal>

        <AdSense slot="home-leaderboard" format="leaderboard" />

        {/* Categorias */}
        {categories.length > 0 && (
          <Reveal>
            <section className="py-10">
              <SectionHeading title="Categorias" href="/ferramentas" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {categories.map((c) => (
                  <Link key={c.slug} href={`/ferramentas/${c.slug}`} className="group block">
                    <Card className="flex h-full flex-col items-center gap-3 p-6 text-center transition group-hover:-translate-y-0.5">
                      <CategoryIcon icon={c.icon} size={32} className="text-[#CC785C]" />
                      <div>
                        <h3 className="font-semibold">{c.name}</h3>
                        <p className="text-xs text-[#86868B]">
                          {c._count?.tools ?? 0} ferramentas
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* Ferramentas em destaque */}
        {featuredTools.length > 0 && (
          <Reveal>
            <section className="py-10">
              <SectionHeading title="Ferramentas em destaque" href="/ferramentas" />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featuredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* Últimas notícias */}
        {latestNews.length > 0 && (
          <Reveal>
            <section className="py-10">
              <SectionHeading title="Últimas notícias" href="/noticias" />
              <div className="grid gap-5 lg:grid-cols-3">
                {featureNews && (
                  <div className="lg:col-span-2">
                    <NewsCard news={featureNews} feature />
                  </div>
                )}
                {sideNews.length > 0 && (
                  <div className="flex flex-col gap-5">
                    {sideNews.map((n) => (
                      <NewsCard key={n.id} news={n} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </Reveal>
        )}

        <AdSense slot="home-rectangle" format="rectangle" />

        {/* Comparativos populares */}
        {popularComparisons.length > 0 && (
          <Reveal>
            <section className="py-10">
              <SectionHeading title="Comparativos populares" href="/comparativos" />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {popularComparisons.map((c) => (
                  <ContentCard
                    key={c.id}
                    href={`/comparativos/${c.slug}`}
                    title={c.title}
                    excerpt={c.excerpt}
                    label="Comparativo"
                  />
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* Últimos tutoriais */}
        {latestTutorials.length > 0 && (
          <Reveal>
            <section className="py-10">
              <SectionHeading title="Últimos tutoriais" href="/tutoriais" />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {latestTutorials.map((t) => (
                  <ContentCard
                    key={t.id}
                    href={`/tutoriais/${t.slug}`}
                    title={t.title}
                    excerpt={t.excerpt}
                    label={DIFFICULTY_LABELS[t.difficulty] ?? t.difficulty}
                    meta={formatRelativeDate(t.publishedAt ?? t.createdAt)}
                  />
                ))}
              </div>
            </section>
          </Reveal>
        )}

        {/* Newsletter */}
        <Reveal>
          <section className="my-12 overflow-hidden rounded-3xl bg-[#1A1A1A] px-6 py-12 text-center text-white sm:px-12">
            <h2 className="font-serif text-2xl font-medium sm:text-3xl">
              Receba as novidades de IA no seu e-mail
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/70">
              Um resumo semanal das ferramentas, notícias e tutoriais que importam.
            </p>
            <div className="mx-auto mt-6 max-w-md">
              <NewsletterForm variant="dark" />
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}
