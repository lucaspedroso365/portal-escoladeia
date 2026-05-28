import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { siteUrl } from "@/lib/url";
import { SITE } from "@/lib/constants";

export const revalidate = 600;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const base = siteUrl();
  const items = await safeQuery(
    () =>
      prisma.news.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 100,
      }),
    []
  );

  const rssItems = items
    .map((n) => {
      const link = `${base}/noticias/${n.slug}`;
      const date = (n.publishedAt ?? n.createdAt).toUTCString();
      const image = n.coverImageUrl
        ? `<media:content url="${esc(n.coverImageUrl)}" medium="image" />`
        : "";
      return `    <item>
      <title>${esc(n.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>
      <pubDate>${date}</pubDate>
      <category>${esc(n.category)}</category>
      <dc:creator>Redação Escola de IA</dc:creator>
      <description>${esc(n.excerpt ?? "")}</description>
      ${image}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(SITE.name)} — Notícias de IA</title>
    <link>${base}/noticias</link>
    <description>${esc(SITE.description)}</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${base}/feed.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
}
