import Link from "next/link";
import { Card } from "./Card";
import { CoverImage } from "./CoverImage";
import { formatRelativeDate } from "@/lib/utils";
import { NEWS_CATEGORIES } from "@/lib/constants";
import type { News } from "@/types";

function categoryLabel(key: string): string {
  return NEWS_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

export function NewsCard({
  news,
  feature = false,
}: {
  news: News;
  feature?: boolean;
}) {
  return (
    <Link href={`/noticias/${news.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition group-hover:-translate-y-0.5">
        <div className={`relative w-full ${feature ? "h-40" : "h-28"}`}>
          <CoverImage src={news.coverImageUrl} alt={news.title} label={categoryLabel(news.category)} />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#CC785C]">
            {categoryLabel(news.category)}
          </span>
          <h3
            className={`mt-1 font-semibold leading-snug ${
              feature ? "text-xl line-clamp-3" : "text-base line-clamp-2"
            }`}
          >
            {news.title}
          </h3>
          {feature && news.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm text-[#86868B]">{news.excerpt}</p>
          )}
          <p className="mt-auto pt-3 text-xs text-[#86868B]">
            {formatRelativeDate(news.publishedAt ?? news.createdAt)}
          </p>
        </div>
      </Card>
    </Link>
  );
}
