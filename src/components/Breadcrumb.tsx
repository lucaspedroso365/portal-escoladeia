import Link from "next/link";
import { Fragment } from "react";
import { siteUrl } from "@/lib/url";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Visual breadcrumb + JSON-LD BreadcrumbList. */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const base = siteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: `${base}${it.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Trilha de navegação" className="text-xs text-[#86868B]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <Fragment key={i}>
            {i > 0 && <span aria-hidden>›</span>}
            <li>
              {it.href && i < items.length - 1 ? (
                <Link href={it.href} className="hover:text-[#1A1A1A] transition-colors">
                  {it.label}
                </Link>
              ) : (
                <span className="text-[#1A1A1A]">{it.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
