import Link from "next/link";
import { Card } from "./Card";
import { CoverImage } from "./CoverImage";

/** Generic content card for comparisons, tutorials, rankings, etc. */
export function ContentCard({
  href,
  title,
  excerpt,
  label,
  meta,
  imageUrl,
  showImage = false,
}: {
  href: string;
  title: string;
  excerpt?: string | null;
  label?: string;
  meta?: string;
  imageUrl?: string | null;
  showImage?: boolean;
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition group-hover:-translate-y-0.5">
        {showImage && (
          <div className="relative h-28 w-full">
            <CoverImage src={imageUrl} alt={title} label={label} />
          </div>
        )}
        <div className="flex flex-1 flex-col p-5">
          {label && (
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#CC785C]">
              {label}
            </span>
          )}
          <h3 className="mt-1 line-clamp-2 font-semibold leading-snug">{title}</h3>
          {excerpt && (
            <p className="mt-2 line-clamp-3 text-sm text-[#86868B]">{excerpt}</p>
          )}
          {meta && <p className="mt-auto pt-3 text-xs text-[#86868B]">{meta}</p>}
        </div>
      </Card>
    </Link>
  );
}
