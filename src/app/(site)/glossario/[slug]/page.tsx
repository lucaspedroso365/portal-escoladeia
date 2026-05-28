import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { siteUrl } from "@/lib/url";
import { slugify, toStringArray } from "@/lib/utils";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Markdown } from "@/components/Markdown";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 86400;

export async function generateStaticParams() {
  const items = await safeQuery(
    () => prisma.glossaryTerm.findMany({ select: { slug: true } }),
    []
  );
  return items.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = await safeQuery(() => prisma.glossaryTerm.findUnique({ where: { slug } }), null);
  if (!t) return {};
  return {
    title: t.metaTitle ?? `${t.term}: o que é?`,
    description: t.metaDescription ?? t.definition.slice(0, 155),
    alternates: { canonical: `/glossario/${slug}` },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await safeQuery(() => prisma.glossaryTerm.findUnique({ where: { slug } }), null);
  if (!t) notFound();

  const related = toStringArray(t.relatedTerms);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: t.term,
    description: t.definition,
    inDefinedTermSet: `${siteUrl()}/glossario`,
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Glossário", href: "/glossario" },
          { label: t.term },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{t.term}</h1>
      <div className="mt-4">
        <Markdown>{t.definition}</Markdown>
      </div>

      {related.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#86868B]">
            Termos relacionados
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r}
                href={`/glossario/${slugify(r)}`}
                className="rounded-full bg-[#F5F5F7] px-3 py-1.5 text-sm font-medium text-[#1A1A1A] hover:bg-[#CC785C] hover:text-white"
              >
                {r}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
