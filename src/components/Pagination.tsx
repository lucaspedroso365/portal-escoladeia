import Link from "next/link";

/** Server-rendered pagination that preserves existing query params. */
export function Pagination({
  page,
  totalPages,
  basePath,
  params = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const sp = new URLSearchParams(params);
    if (p > 1) sp.set("page", String(p));
    else sp.delete("page");
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const window: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let p = start; p <= end; p++) window.push(p);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Paginação">
      {page > 1 && (
        <Link
          href={href(page - 1)}
          className="rounded-lg px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F5F5F7]"
        >
          ← Anterior
        </Link>
      )}
      {window.map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? "page" : undefined}
          className={`rounded-lg px-3.5 py-2 text-sm font-medium ${
            p === page ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A] hover:bg-[#F5F5F7]"
          }`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link
          href={href(page + 1)}
          className="rounded-lg px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F5F5F7]"
        >
          Próxima →
        </Link>
      )}
    </nav>
  );
}
