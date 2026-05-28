import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { siteUrl } from "@/lib/url";
import { ArticleLayout } from "@/components/ArticleLayout";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await safeQuery(
    () => prisma.alternative.findMany({ where: { published: true }, select: { slug: true } }),
    []
  );
  return items.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = await safeQuery(() => prisma.alternative.findUnique({ where: { slug } }), null);
  if (!a) return {};
  return {
    title: a.metaTitle ?? a.title,
    description: a.metaDescription ?? a.excerpt ?? undefined,
    alternates: { canonical: `/alternativas/${slug}` },
    openGraph: {
      type: "article",
      title: a.metaTitle ?? a.title,
      description: a.metaDescription ?? a.excerpt ?? undefined,
      images: a.coverImageUrl ? [{ url: a.coverImageUrl }] : undefined,
    },
  };
}

export default async function AlternativePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await safeQuery(() => prisma.alternative.findUnique({ where: { slug } }), null);
  if (!a) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt ?? undefined,
    mainEntityOfPage: `${siteUrl()}/alternativas/${a.slug}`,
    author: { "@type": "Organization", name: "Escola de IA" },
  };

  const footer = (
    <div className="mt-10 rounded-2xl bg-[#FFF4EE] p-6 ring-1 ring-[#CC785C]/15">
      <h3 className="font-semibold text-[#CC785C]">Explore mais ferramentas</h3>
      <p className="mt-2 text-[#1A1A1A]">
        Veja o catálogo completo de ferramentas de IA e encontre a ideal para você.
      </p>
      <Link
        href="/ferramentas"
        className="mt-4 inline-flex rounded-xl bg-[#CC785C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b86848]"
      >
        Ver todas as ferramentas
      </Link>
    </div>
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleLayout
        breadcrumb={[
          { label: "Início", href: "/" },
          { label: "Alternativas", href: "/alternativas" },
          { label: a.title },
        ]}
        label={`Alternativas ao ${a.targetTool}`}
        title={a.title}
        subtitle={a.excerpt}
        content={a.content}
        coverImageUrl={a.coverImageUrl}
        footer={footer}
      />
    </>
  );
}
