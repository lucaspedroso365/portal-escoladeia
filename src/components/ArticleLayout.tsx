import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";
import { CoverImage } from "./CoverImage";
import { AdSense } from "./AdSense";
import { Markdown } from "./Markdown";
import { splitMarkdownForAd } from "@/lib/utils";

/** Single-column article shell shared by comparisons, rankings, etc. */
export function ArticleLayout({
  breadcrumb,
  label,
  title,
  subtitle,
  content,
  coverImageUrl,
  showCover = true,
  headerExtra,
  footer,
}: {
  breadcrumb: BreadcrumbItem[];
  label?: string;
  title: string;
  subtitle?: string | null;
  content: string;
  coverImageUrl?: string | null;
  showCover?: boolean;
  headerExtra?: ReactNode;
  footer?: ReactNode;
}) {
  const { before, after } = splitMarkdownForAd(content);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb items={breadcrumb} />
      {label && (
        <span className="mt-4 block text-xs font-semibold uppercase tracking-wide text-[#CC785C]">
          {label}
        </span>
      )}
      <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
        {title}
      </h1>
      {subtitle && <p className="mt-3 text-lg text-[#86868B]">{subtitle}</p>}

      {headerExtra}

      <AdSense slot="article-leaderboard" format="leaderboard" />

      {showCover && (
        <div className="relative mb-8 h-56 w-full overflow-hidden rounded-2xl shadow-[0_2px_6px_rgba(0,0,0,0.08)] sm:h-72">
          <CoverImage
            src={coverImageUrl}
            alt={title}
            label={label}
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </div>
      )}

      <Markdown>{before}</Markdown>
      {after && (
        <>
          <AdSense slot="article-rectangle" format="rectangle" />
          <Markdown>{after}</Markdown>
        </>
      )}

      {footer}
    </div>
  );
}
