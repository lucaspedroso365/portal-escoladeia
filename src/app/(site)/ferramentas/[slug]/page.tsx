import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconCheck,
  IconX,
  IconExternalLink,
  IconStarFilled,
} from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { siteUrl } from "@/lib/url";
import { PRICING_LABELS } from "@/lib/constants";
import { toStringArray } from "@/lib/utils";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { ToolLogo } from "@/components/ToolLogo";
import { ToolCard } from "@/components/ToolCard";
import { ContentCard } from "@/components/ContentCard";
import { NewsCard } from "@/components/NewsCard";
import { AdSense } from "@/components/AdSense";
import { Markdown } from "@/components/Markdown";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 3600;

export async function generateStaticParams() {
  const [cats, tools] = await Promise.all([
    safeQuery(() => prisma.category.findMany({ select: { slug: true } }), []),
    safeQuery(() => prisma.tool.findMany({ select: { slug: true } }), []),
  ]);
  return [...cats, ...tools].map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await safeQuery(
    () => prisma.category.findUnique({ where: { slug } }),
    null
  );
  if (category) {
    const title = `Ferramentas de ${category.name}`;
    return {
      title,
      description:
        category.description ?? `As melhores ferramentas de IA de ${category.name}.`,
      alternates: { canonical: `/ferramentas/${slug}` },
    };
  }
  const tool = await safeQuery(
    () => prisma.tool.findUnique({ where: { slug } }),
    null
  );
  if (!tool) return {};
  return {
    title: tool.metaTitle ?? tool.name,
    description: tool.metaDescription ?? tool.tagline ?? undefined,
    alternates: { canonical: `/ferramentas/${slug}` },
    openGraph: {
      title: tool.metaTitle ?? tool.name,
      description: tool.metaDescription ?? tool.tagline ?? undefined,
      images: tool.coverImageUrl ? [tool.coverImageUrl] : undefined,
    },
  };
}

export default async function ToolOrCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  /* ---- Category listing ---- */
  const category = await safeQuery(
    () =>
      prisma.category.findUnique({
        where: { slug },
        include: {
          tools: {
            orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
            include: { category: true },
          },
        },
      }),
    null
  );

  if (category) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: "Ferramentas", href: "/ferramentas" },
            { label: category.name },
          ]}
        />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Ferramentas de {category.name}
        </h1>
        {category.description && (
          <p className="mt-3 max-w-2xl text-[#86868B]">{category.description}</p>
        )}
        <AdSense slot="category-leaderboard" format="leaderboard" />
        {category.tools.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {category.tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-[#86868B]">
            Ainda não há ferramentas nesta categoria.
          </p>
        )}
      </div>
    );
  }

  /* ---- Tool detail ---- */
  const tool = await safeQuery(
    () => prisma.tool.findUnique({ where: { slug }, include: { category: true } }),
    null
  );
  if (!tool) notFound();

  const [comparisons, tutorials, news] = await Promise.all([
    safeQuery(
      () =>
        prisma.comparison.findMany({
          where: {
            published: true,
            OR: [{ tool1Name: tool.name }, { tool2Name: tool.name }],
          },
          take: 4,
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.tutorial.findMany({
          where: { published: true, toolId: tool.id },
          take: 4,
        }),
      []
    ),
    safeQuery(
      () =>
        prisma.news.findMany({
          where: { published: true, toolId: tool.id },
          orderBy: { publishedAt: "desc" },
          take: 5,
        }),
      []
    ),
  ]);

  const pros = toStringArray(tool.pros);
  const cons = toStringArray(tool.cons);
  const visitUrl = tool.affiliateUrl || tool.officialUrl || "#";
  const priceFrom = tool.pricingFrom != null ? `US$ ${tool.pricingFrom}` : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.metaDescription ?? tool.tagline ?? tool.description.slice(0, 200),
    applicationCategory: tool.category?.name ?? "AI",
    operatingSystem: "Web",
    url: tool.officialUrl ?? `${siteUrl()}/ferramentas/${tool.slug}`,
    offers: {
      "@type": "Offer",
      price: tool.pricingFrom ?? 0,
      priceCurrency: "USD",
    },
    ...(tool.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: tool.rating,
            bestRating: 5,
            ratingCount: 128,
          },
        }
      : {}),
  };

  const plans = [
    {
      name: "Free",
      price: "US$ 0",
      popular: false,
      features: ["Recursos básicos", "Uso pessoal", "Sem cartão de crédito"],
    },
    {
      name: "Pro",
      price: priceFrom ? `${priceFrom}/mês` : "Sob consulta",
      popular: true,
      features: ["Tudo do Free", "Recursos avançados", "Prioridade e mais limites"],
    },
    {
      name: "Team",
      price: priceFrom ? `US$ ${Math.round((tool.pricingFrom ?? 0) * 1.25)}/usuário` : "Sob consulta",
      popular: false,
      features: ["Tudo do Pro", "Colaboração em equipe", "Administração centralizada"],
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Ferramentas", href: "/ferramentas" },
          ...(tool.category
            ? [{ label: tool.category.name, href: `/ferramentas/${tool.category.slug}` }]
            : []),
          { label: tool.name },
        ]}
      />

      {/* Hero */}
      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
        <ToolLogo name={tool.name} logoUrl={tool.logoUrl} size={72} />
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{tool.name}</h1>
          {tool.tagline && <p className="mt-1 text-[#86868B]">{tool.tagline}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {tool.category?.name && <Badge variant="primary">{tool.category.name}</Badge>}
            <Badge variant="muted">
              {PRICING_LABELS[tool.pricingType] ?? tool.pricingType}
            </Badge>
            {tool.rating && (
              <Badge variant="default">
                <IconStarFilled size={12} className="mr-1 text-[#CC785C]" />
                {tool.rating.toFixed(1)}
              </Badge>
            )}
          </div>
        </div>
        <a
          href={visitUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1A1A1A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
        >
          Visitar site <IconExternalLink size={16} />
        </a>
      </div>

      <AdSense slot="tool-leaderboard" format="leaderboard" />

      {/* What is it */}
      <section className="mt-2">
        <h2 className="text-2xl font-bold tracking-tight">O que é o {tool.name}?</h2>
        <div className="mt-3">
          <Markdown>{tool.description}</Markdown>
        </div>
      </section>

      {/* How to use */}
      {tool.howToUse && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">Como usar</h2>
          <div className="mt-3">
            <Markdown>{tool.howToUse}</Markdown>
          </div>
        </section>
      )}

      {/* Pros / Cons */}
      {(pros.length > 0 || cons.length > 0) && (
        <section className="mt-10 grid gap-5 sm:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-3 font-semibold">Prós</h3>
            <ul className="space-y-2">
              {pros.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <IconCheck size={18} className="mt-0.5 shrink-0 text-green-600" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="mb-3 font-semibold">Contras</h3>
            <ul className="space-y-2">
              {cons.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <IconX size={18} className="mt-0.5 shrink-0 text-red-500" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {/* Plans */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold tracking-tight">Planos e preços</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              variant={plan.popular ? "featured" : "default"}
              className={`relative flex flex-col p-6 ${
                plan.popular ? "ring-1 ring-[#CC785C]" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[#CC785C] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Popular
                </span>
              )}
              <h3 className="font-semibold">{plan.name}</h3>
              <p className="mt-1 text-2xl font-bold">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-[#86868B]">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <IconCheck size={16} className="mt-0.5 shrink-0 text-[#CC785C]" />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        {tool.pricing && (
          <div className="mt-6">
            <Markdown>{tool.pricing}</Markdown>
          </div>
        )}
      </section>

      <AdSense slot="tool-rectangle" format="rectangle" />

      {/* Comparisons */}
      {comparisons.length > 0 && (
        <section className="mt-6">
          <h2 className="text-2xl font-bold tracking-tight">Comparações populares</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {comparisons.map((c) => (
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
      )}

      {/* Tutorials */}
      {tutorials.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">Tutoriais relacionados</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {tutorials.map((t) => (
              <ContentCard
                key={t.id}
                href={`/tutoriais/${t.slug}`}
                title={t.title}
                excerpt={t.excerpt}
                label="Tutorial"
              />
            ))}
          </div>
        </section>
      )}

      {/* News */}
      {news.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">Notícias recentes</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
