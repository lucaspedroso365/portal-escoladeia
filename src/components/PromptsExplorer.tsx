"use client";

import { useMemo, useState } from "react";
import { IconCopy, IconCheck, IconX } from "@tabler/icons-react";
import { Card } from "./Card";
import type { Prompt } from "@/types";

export function PromptsExplorer({ prompts }: { prompts: Prompt[] }) {
  const categories = useMemo(() => {
    const set = new Set(prompts.map((p) => p.category));
    return ["Todas", ...Array.from(set).sort()];
  }, [prompts]);

  const [cat, setCat] = useState("Todas");
  const [open, setOpen] = useState<Prompt | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filtered = useMemo(
    () => (cat === "Todas" ? prompts : prompts.filter((p) => p.category === cat)),
    [prompts, cat]
  );

  async function copy(text: string, id: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              cat === c
                ? "bg-[#1A1A1A] text-white"
                : "bg-[#F5F5F7] text-[#1A1A1A] hover:bg-black/5"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.id} className="flex flex-col p-5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#CC785C]">
              {p.category}
            </span>
            <button
              onClick={() => setOpen(p)}
              className="mt-1 text-left font-semibold hover:text-[#CC785C]"
            >
              {p.title}
            </button>
            <pre className="mt-3 line-clamp-4 whitespace-pre-wrap rounded-xl bg-[#F5F5F7] p-3 text-xs text-[#1A1A1A]">
              {p.promptText}
            </pre>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => copy(p.promptText, p.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A1A1A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-black"
              >
                {copiedId === p.id ? <IconCheck size={14} /> : <IconCopy size={14} />}
                {copiedId === p.id ? "Copiado!" : "Copiar"}
              </button>
              <button
                onClick={() => setOpen(p)}
                className="text-xs font-medium text-[#86868B] hover:text-[#1A1A1A]"
              >
                Ver completo
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-[#86868B]">Nenhum prompt nesta categoria.</p>
      )}

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#CC785C]">
                  {open.category}
                </span>
                <h3 className="text-xl font-bold">{open.title}</h3>
              </div>
              <button onClick={() => setOpen(null)} aria-label="Fechar">
                <IconX size={20} />
              </button>
            </div>
            {open.description && (
              <p className="mt-2 text-sm text-[#86868B]">{open.description}</p>
            )}
            <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-[#F5F5F7] p-4 text-sm">
              {open.promptText}
            </pre>
            <button
              onClick={() => copy(open.promptText, open.id)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#CC785C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#b86848]"
            >
              {copiedId === open.id ? <IconCheck size={16} /> : <IconCopy size={16} />}
              {copiedId === open.id ? "Copiado!" : "Copiar prompt"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
