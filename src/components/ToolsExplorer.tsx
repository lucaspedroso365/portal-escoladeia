"use client";

import { useMemo, useState } from "react";
import { IconAdjustmentsHorizontal, IconSearch, IconX } from "@tabler/icons-react";
import { ToolCard } from "./ToolCard";
import type { Tool } from "@/types";

const PRICING_OPTIONS = [
  { key: "todas", label: "Todas" },
  { key: "free", label: "Grátis" },
  { key: "freemium", label: "Freemium" },
  { key: "paid", label: "Pago" },
];

export function ToolsExplorer({
  tools,
  categories,
  initialQuery = "",
}: {
  tools: Tool[];
  categories: { name: string; slug: string }[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [pricing, setPricing] = useState("todas");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (q && !`${t.name} ${t.tagline ?? ""}`.toLowerCase().includes(q)) return false;
      if (selectedCats.length && !(t.category && selectedCats.includes(t.category.slug)))
        return false;
      if (pricing !== "todas" && t.pricingType !== pricing) return false;
      return true;
    });
  }, [tools, query, selectedCats, pricing]);

  function toggleCat(slug: string) {
    setSelectedCats((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  const filters = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Categoria</h3>
        <div className="space-y-1.5">
          {categories.map((c) => (
            <label key={c.slug} className="flex cursor-pointer items-center gap-2 text-sm text-[#1A1A1A]">
              <input
                type="checkbox"
                checked={selectedCats.includes(c.slug)}
                onChange={() => toggleCat(c.slug)}
                className="h-4 w-4 rounded accent-[#CC785C]"
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-semibold">Preço</h3>
        <div className="space-y-1.5">
          {PRICING_OPTIONS.map((p) => (
            <label key={p.key} className="flex cursor-pointer items-center gap-2 text-sm text-[#1A1A1A]">
              <input
                type="radio"
                name="pricing"
                checked={pricing === p.key}
                onChange={() => setPricing(p.key)}
                className="h-4 w-4 accent-[#CC785C]"
              />
              {p.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[220px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-20">{filters}</div>
      </aside>

      <div>
        <div className="mb-5 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-[#F5F5F7] px-3 py-2">
            <IconSearch size={18} className="text-[#86868B]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar ferramentas..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#86868B]"
            />
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#F5F5F7] px-3 py-2 text-sm font-medium lg:hidden"
          >
            <IconAdjustmentsHorizontal size={18} /> Filtros
          </button>
        </div>

        <p className="mb-4 text-sm text-[#86868B]">
          {filtered.length} {filtered.length === 1 ? "ferramenta" : "ferramentas"}
        </p>

        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-[#86868B]">Nenhuma ferramenta encontrada.</p>
        )}
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative ml-auto h-full w-72 overflow-y-auto bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Filtros</h2>
              <button onClick={() => setDrawerOpen(false)} aria-label="Fechar">
                <IconX size={20} />
              </button>
            </div>
            {filters}
          </div>
        </div>
      )}
    </div>
  );
}
