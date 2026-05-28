import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { PageHero } from "@/components/PageHero";
import { truncate } from "@/lib/utils";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Glossário de IA",
  description:
    "Glossário completo de inteligência artificial: entenda os principais termos e conceitos de IA de A a Z.",
  alternates: { canonical: "/glossario" },
};

export default async function GlossaryPage() {
  const terms = await safeQuery(
    () => prisma.glossaryTerm.findMany({ orderBy: { term: "asc" } }),
    []
  );

  const groups: Record<string, typeof terms> = {};
  for (const t of terms) {
    const letter = (t.slug.charAt(0) || "#").toUpperCase();
    (groups[letter] ||= []).push(t);
  }
  const letters = Object.keys(groups).sort();

  return (
    <>
      <PageHero
        title="Glossário de IA"
        description="Os principais termos e conceitos de inteligência artificial, explicados de forma simples."
      />

      <div className="mx-auto max-w-4xl px-4">
        {/* A-Z index */}
        <div className="sticky top-14 z-10 -mx-4 bg-white/80 px-4 py-3 backdrop-blur-sm">
          <div className="no-scrollbar flex flex-wrap gap-1.5">
            {letters.map((l) => (
              <a
                key={l}
                href={`#${l}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F5F7] text-sm font-semibold text-[#1A1A1A] hover:bg-[#CC785C] hover:text-white"
              >
                {l}
              </a>
            ))}
          </div>
        </div>

        {letters.map((l) => (
          <section key={l} id={l} className="scroll-mt-28 py-6">
            <h2 className="mb-4 text-2xl font-bold text-[#CC785C]">{l}</h2>
            <div className="space-y-5">
              {groups[l].map((t) => (
                <div key={t.id} className="border-b border-black/5 pb-5">
                  <h3 className="text-lg font-semibold">{t.term}</h3>
                  <p className="mt-1 text-[#86868B]">{truncate(t.definition, 140)}</p>
                  <Link
                    href={`/glossario/${t.slug}`}
                    className="mt-1 inline-block text-sm font-medium text-[#CC785C] hover:underline"
                  >
                    Ver mais →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}

        {terms.length === 0 && (
          <p className="py-20 text-center text-[#86868B]">Glossário em construção.</p>
        )}
      </div>
    </>
  );
}
