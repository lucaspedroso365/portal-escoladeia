import type { ReactNode } from "react";

export function PageHero({
  title,
  description,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="px-4 pt-12 pb-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-[#86868B]">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
