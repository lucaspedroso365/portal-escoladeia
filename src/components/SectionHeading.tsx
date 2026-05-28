import Link from "next/link";

export function SectionHeading({
  title,
  href,
  linkLabel = "Ver tudo",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-bold tracking-tight sm:text-[1.75rem]">{title}</h2>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-[#CC785C] hover:underline"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
