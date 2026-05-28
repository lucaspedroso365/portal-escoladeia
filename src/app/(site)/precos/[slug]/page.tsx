import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IconExternalLink } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { siteUrl } from "@/lib/url";
import { ArticleLayout } from "@/components/ArticleLayout";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await safeQuery(
    () => prisma.price.findMany({ where: { published: true }, select: { slug: true } }),
    []
  );
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await safeQuery(() => prisma.price.findUnique({ where: { slug } }), null);
  if (!p) return {};
  return {
    title: p.metaTitle ?? p.title,
    description: p.metaDescription ?? `Planos e preços do ${p.toolName}.`,
    alternates: { canonical: `/precos/${slug}` },
  };
}

export default async function PricePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await safeQuery(() => prisma.price.findUnique({ where: { slug } }), null);
  if (!p) notFound();

  const tool = await safeQuery(
    () => prisma.tool.findFirst({ where: { name: p.toolName } }),
    null
  );
  const ctaUrl = tool?.affiliateUrl || tool?.officialUrl || null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.metaDescription ?? `Planos e preços do ${p.toolName}.`,
    mainEntityOfPage: `${siteUrl()}/precos/${p.slug}`,
    author: { "@type": "Organization", name: "Escola de IA" },
  };

  const footer = ctaUrl ? (
    <div className="mt-10 rounded-2xl bg-[#FFF4EE] p-6 ring-1 ring-[#CC785C]/15">
      <h3 className="font-semibold text-[#CC785C]">Quer assinar o {p.toolName}?</h3>
      <p className="mt-2 text-[#1A1A1A]">Acesse o site oficial e veja as ofertas atuais.</p>
      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#CC785C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b86848]"
      >
        Visitar {p.toolName} <IconExternalLink size={16} />
      </a>
    </div>
  ) : null;

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleLayout
        breadcrumb={[
          { label: "Início", href: "/" },
          { label: "Preços", href: "/precos" },
          { label: p.title },
        ]}
        label={`Preços · ${p.toolName}`}
        title={p.title}
        content={p.content}
        showCover={false}
        footer={footer}
      />
    </>
  );
}
