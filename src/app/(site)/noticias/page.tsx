import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { NEWS_CATEGORIES } from "@/lib/constants";
import { PageHero } from "@/components/PageHero";
import { NewsCard } from "@/components/NewsCard";
import { CoverImage } from "@/components/CoverImage";
import { AdSense } from "@/components/AdSense";
import { Pagination } from "@/components/Pagination";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Notícias de IA — últimas atualizações",
  description:
    "As últimas notícias de inteligência artificial: lançamentos, atualizações, análises e tendências do mercado de IA.",
  alternates: { canonical: "/noticias" },
};

const PER_PAGE = 12;

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const cat = sp.cat ?? "todas";
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const where = {
    published: true,
    ...(cat && cat !== "todas" ? { category: cat } : {}),
  };

  const [total, items] = await Promise.all([
    safeQuery(() => prisma.news.count({ where }), 0),
    safeQuery(
      () =>
        prisma.news.findMany({
          where,
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * PER_PAGE,
          take: PER_PAGE,
          include: { tool: true },
        }),
      []
    ),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const feature = page === 1 ? items[0] : undefined;
  const rest = page === 1 ? items.slice(1) : items;

  const params: Record<string, string> = cat !== "todas" ? { cat } : {};

  return (
    <>
      <PageHero
        title="Notícias de IA — últimas atualizações"
        description="Acompanhe os lançamentos, atualizações e análises do mundo da inteligência artificial."
      />

      <div className="mx-auto max-w-6xl px-4">
        {/* Filter chips */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
          {NEWS_CATEGORIES.map((c) => {
            const active = c.key === cat;
            return (
              <Link
                key={c.key}
                href={c.key === "todas" ? "/noticias" : `/noticias?cat=${c.key}`}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-[#F5F5F7] text-[#1A1A1A] hover:bg-black/5"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        {items.length === 0 ? (
          <p className="py-20 text-center text-[#86868B]">
            Nenhuma notícia encontrada nesta categoria.
          </p>
        ) : (
          <>
            {feature && (
              <div className="mt-6">
                <Link href={`/noticias/${feature.slug}`} className="group block">
                  <div className="grid items-stretch gap-0 overflow-hidden rounded-2xl bg-white shadow-[0_2px_6px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.04)] md:grid-cols-[1fr_1.4fr]">
                    <div className="relative h-48 w-full md:h-auto">
                      <CoverImage src={feature.coverImageUrl} alt={feature.title} priority />
                    </div>
                    <div className="flex flex-col justify-center p-6">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#CC785C]">
                        {NEWS_CATEGORIES.find((c) => c.key === feature.category)?.label ??
                          feature.category}
                      </span>
                      <h2 className="mt-2 text-2xl font-bold leading-snug">
                        {feature.title}
                      </h2>
                      {feature.excerpt && (
                        <p className="mt-2 line-clamp-3 text-[#86868B]">
                          {feature.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            )}

            <AdSense slot="news-leaderboard" format="leaderboard" />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((n) => (
                <NewsCard key={n.id} news={n} />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/noticias"
              params={params}
            />
          </>
        )}
      </div>
    </>
  );
}
