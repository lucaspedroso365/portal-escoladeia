import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { ArticleLayout } from "@/components/ArticleLayout";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await safeQuery(
    () => prisma.ranking.findMany({ where: { published: true }, select: { slug: true } }),
    []
  );
  return items.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = await safeQuery(() => prisma.ranking.findUnique({ where: { slug } }), null);
  if (!r) return {};
  return {
    title: r.metaTitle ?? r.title,
    description: r.metaDescription ?? r.excerpt ?? undefined,
    alternates: { canonical: `/rankings/${slug}` },
    openGraph: {
      type: "article",
      title: r.metaTitle ?? r.title,
      description: r.metaDescription ?? r.excerpt ?? undefined,
      images: r.coverImageUrl ? [{ url: r.coverImageUrl }] : undefined,
    },
  };
}

export default async function RankingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = await safeQuery(() => prisma.ranking.findUnique({ where: { slug } }), null);
  if (!r) notFound();

  const listItems = [...r.content.matchAll(/^\s*\d+\.\s+(.+)$/gm)].map((m, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: m[1].replace(/\*\*/g, "").trim(),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: r.title,
    description: r.excerpt ?? undefined,
    itemListElement: listItems,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleLayout
        breadcrumb={[
          { label: "Início", href: "/" },
          { label: "Rankings", href: "/rankings" },
          { label: r.title },
        ]}
        label={`Ranking · ${r.topic}`}
        title={r.title}
        subtitle={r.excerpt}
        content={r.content}
        coverImageUrl={r.coverImageUrl}
      />
    </>
  );
}
