import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconBrandX, IconBrandWhatsapp } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { siteUrl } from "@/lib/url";
import { SITE, NEWS_CATEGORIES } from "@/lib/constants";
import {
  formatDate,
  estimateReadingTime,
  splitMarkdownForAd,
} from "@/lib/utils";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card } from "@/components/Card";
import { CoverImage } from "@/components/CoverImage";
import { AdSense } from "@/components/AdSense";
import { Markdown } from "@/components/Markdown";
import { JsonLd } from "@/components/JsonLd";
import { ViewTracker } from "@/components/ViewTracker";
import { NewsletterForm } from "@/components/NewsletterForm";

export const revalidate = 300;

export async function generateStaticParams() {
  const items = await safeQuery(
    () => prisma.news.findMany({ where: { published: true }, select: { slug: true } }),
    []
  );
  return items.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await safeQuery(
    () => prisma.news.findUnique({ where: { slug } }),
    null
  );
  if (!news) return {};
  const title = news.metaTitle ?? news.title;
  const description = news.metaDescription ?? news.excerpt ?? undefined;
  return {
    title,
    description,
    alternates: { canonical: `/noticias/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: news.publishedAt?.toISOString(),
      images: news.coverImageUrl ? [{ url: news.coverImageUrl }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

function catLabel(key: string) {
  return NEWS_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await safeQuery(
    () => prisma.news.findUnique({ where: { slug }, include: { tool: true } }),
    null
  );
  if (!news) notFound();

  const since = new Date(Date.now() - 24 * 3600 * 1000);
  let mostRead = await safeQuery(
    () =>
      prisma.news.findMany({
        where: { published: true, publishedAt: { gte: since } },
        orderBy: { views: "desc" },
        take: 5,
      }),
    []
  );
  if (mostRead.length === 0) {
    mostRead = await safeQuery(
      () =>
        prisma.news.findMany({
          where: { published: true },
          orderBy: { views: "desc" },
          take: 5,
        }),
      []
    );
  }

  const related = await safeQuery(
    () =>
      prisma.news.findMany({
        where: { published: true, category: news.category, NOT: { id: news.id } },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
    []
  );

  const url = `${siteUrl()}/noticias/${news.slug}`;
  const readingTime = estimateReadingTime(news.content);
  const { before, after } = splitMarkdownForAd(news.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    description: news.excerpt ?? undefined,
    image: news.coverImageUrl ? [news.coverImageUrl] : undefined,
    datePublished: (news.publishedAt ?? news.createdAt).toISOString(),
    dateModified: news.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Redação Escola de IA" },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${siteUrl()}/icon-512.png` },
    },
    mainEntityOfPage: url,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={jsonLd} />
      <ViewTracker id={news.id} />
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Notícias", href: "/noticias" },
          { label: news.title },
        ]}
      />

      <div className="mt-5 grid gap-10 lg:grid-cols-[1.7fr_1fr]">
        {/* Article */}
        <article className="min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#CC785C]">
            {catLabel(news.category)}
          </span>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {news.title}
          </h1>
          {news.excerpt && (
            <p className="mt-3 text-lg text-[#86868B]">{news.excerpt}</p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-black/5 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#CC785C] text-xs font-bold text-white">
                EI
              </span>
              <div className="text-sm">
                <p className="font-medium">Redação Escola de IA</p>
                <p className="text-xs text-[#86868B]">
                  {formatDate(news.publishedAt ?? news.createdAt)} · {readingTime} min de
                  leitura
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(news.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartilhar no X"
                className="rounded-lg p-2 text-[#1A1A1A] hover:bg-[#F5F5F7]"
              >
                <IconBrandX size={18} />
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(news.title + " " + url)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartilhar no WhatsApp"
                className="rounded-lg p-2 text-[#1A1A1A] hover:bg-[#F5F5F7]"
              >
                <IconBrandWhatsapp size={18} />
              </a>
            </div>
          </div>

          <div className="relative mt-6 h-64 w-full overflow-hidden rounded-2xl shadow-[0_2px_6px_rgba(0,0,0,0.08)] sm:h-80">
            <CoverImage
              src={news.coverImageUrl}
              alt={news.title}
              label={catLabel(news.category)}
              sizes="(max-width: 1024px) 100vw, 700px"
              priority
            />
          </div>

          <div className="mt-8">
            <Markdown>{before}</Markdown>
            {after && (
              <>
                <AdSense slot="news-in-article" format="rectangle" />
                <Markdown>{after}</Markdown>
              </>
            )}
          </div>

          {/* Continue reading */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold tracking-tight">Continue lendo</h2>
              <div className="mt-4 space-y-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/noticias/${r.slug}`}
                    className="block rounded-xl p-3 hover:bg-[#F5F5F7]"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-[#CC785C]">
                      {catLabel(r.category)}
                    </span>
                    <p className="font-medium leading-snug">{r.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <AdSense slot="news-sidebar" format="halfpage" />

          <Card className="mt-2 p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#86868B]">
              Mais lidas
            </h3>
            <ol className="space-y-3">
              {mostRead.map((m, i) => (
                <li key={m.id} className="flex gap-3">
                  <span className="text-lg font-bold text-[#CC785C]">{i + 1}</span>
                  <Link
                    href={`/noticias/${m.slug}`}
                    className="text-sm font-medium leading-snug hover:text-[#CC785C]"
                  >
                    {m.title}
                  </Link>
                </li>
              ))}
            </ol>
          </Card>

          <div className="mt-5 rounded-2xl bg-[#1A1A1A] p-6 text-white">
            <h3 className="text-lg font-bold">Newsletter</h3>
            <p className="mt-1 text-sm text-white/70">
              Receba as principais notícias de IA no seu e-mail.
            </p>
            <div className="mt-4">
              <NewsletterForm variant="dark" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
