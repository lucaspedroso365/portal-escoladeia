import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { siteUrl } from "@/lib/url";
import { DIFFICULTY_LABELS } from "@/lib/constants";
import { estimateReadingTime, extractHeadings, formatDate } from "@/lib/utils";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Badge } from "@/components/Badge";
import { AdSense } from "@/components/AdSense";
import { Markdown } from "@/components/Markdown";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await safeQuery(
    () => prisma.tutorial.findMany({ where: { published: true }, select: { slug: true } }),
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
  const t = await safeQuery(() => prisma.tutorial.findUnique({ where: { slug } }), null);
  if (!t) return {};
  return {
    title: t.metaTitle ?? t.title,
    description: t.metaDescription ?? t.excerpt ?? undefined,
    alternates: { canonical: `/tutoriais/${slug}` },
    openGraph: {
      type: "article",
      title: t.metaTitle ?? t.title,
      description: t.metaDescription ?? t.excerpt ?? undefined,
      images: t.coverImageUrl ? [{ url: t.coverImageUrl }] : undefined,
    },
  };
}

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await safeQuery(() => prisma.tutorial.findUnique({ where: { slug } }), null);
  if (!t) notFound();

  const headings = extractHeadings(t.content);
  const readingTime = t.readingTime ?? estimateReadingTime(t.content);
  const url = `${siteUrl()}/tutoriais/${t.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t.title,
    description: t.excerpt ?? undefined,
    totalTime: `PT${readingTime}M`,
    step: headings.map((h, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: h.text,
      url: `${url}#${h.id}`,
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Tutoriais", href: "/tutoriais" },
          { label: t.title },
        ]}
      />

      <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_220px]">
        <article className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">{DIFFICULTY_LABELS[t.difficulty] ?? t.difficulty}</Badge>
            <Badge variant="muted">{readingTime} min de leitura</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            {t.title}
          </h1>
          {t.excerpt && <p className="mt-3 text-lg text-[#86868B]">{t.excerpt}</p>}
          <p className="mt-2 text-sm text-[#86868B]">
            {formatDate(t.publishedAt ?? t.createdAt)}
          </p>

          <AdSense slot="tutorial-leaderboard" format="leaderboard" />

          <Markdown>{t.content}</Markdown>
        </article>

        {headings.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#86868B]">
                Neste tutorial
              </p>
              <nav className="space-y-1.5 border-l border-black/5 pl-3 text-sm">
                {headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className="block text-[#86868B] hover:text-[#CC785C]"
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
