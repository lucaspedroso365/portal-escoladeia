import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { ArticleLayout } from "@/components/ArticleLayout";
import { ToolLogo } from "@/components/ToolLogo";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await safeQuery(
    () =>
      prisma.comparison.findMany({ where: { published: true }, select: { slug: true } }),
    []
  );
  return items.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await safeQuery(
    () => prisma.comparison.findUnique({ where: { slug } }),
    null
  );
  if (!c) return {};
  return {
    title: c.metaTitle ?? c.title,
    description: c.metaDescription ?? c.excerpt ?? undefined,
    alternates: { canonical: `/comparativos/${slug}` },
    openGraph: {
      type: "article",
      title: c.metaTitle ?? c.title,
      description: c.metaDescription ?? c.excerpt ?? undefined,
      images: c.coverImageUrl ? [{ url: c.coverImageUrl }] : undefined,
    },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await safeQuery(
    () => prisma.comparison.findUnique({ where: { slug } }),
    null
  );
  if (!c) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${c.tool1Name} ou ${c.tool2Name}: qual é melhor?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: c.verdict ?? c.excerpt ?? `Comparativo entre ${c.tool1Name} e ${c.tool2Name}.`,
        },
      },
    ],
  };

  const header = (
    <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      {[c.tool1Name, c.tool2Name].map((name, i) => (
        <div
          key={i}
          className={`flex flex-col items-center gap-2 rounded-2xl bg-white p-5 text-center shadow-[0_2px_6px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.04)] ${
            i === 1 ? "order-3" : ""
          }`}
        >
          <ToolLogo name={name} size={48} />
          <span className="font-semibold">{name}</span>
        </div>
      ))}
      <span className="order-2 text-sm font-bold text-[#86868B]">VS</span>
    </div>
  );

  const footer = c.verdict ? (
    <div className="mt-10 rounded-2xl bg-[#FFF4EE] p-6 ring-1 ring-[#CC785C]/15">
      <h3 className="font-semibold text-[#CC785C]">Nosso veredicto</h3>
      <p className="mt-2 text-[#1A1A1A]">{c.verdict}</p>
    </div>
  ) : null;

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleLayout
        breadcrumb={[
          { label: "Início", href: "/" },
          { label: "Comparativos", href: "/comparativos" },
          { label: c.title },
        ]}
        label="Comparativo"
        title={c.title}
        subtitle={c.excerpt}
        content={c.content}
        coverImageUrl={c.coverImageUrl}
        showCover={false}
        headerExtra={header}
        footer={footer}
      />
    </>
  );
}
