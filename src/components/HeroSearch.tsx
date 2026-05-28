"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { IconSearch } from "@tabler/icons-react";

export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/ferramentas?q=${encodeURIComponent(term)}`);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-xl">
      <div className="flex items-center gap-2 rounded-xl bg-[#F5F5F7] p-2">
        <IconSearch size={20} className="ml-2 shrink-0 text-[#86868B]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar ChatGPT, Midjourney, Claude..."
          aria-label="Buscar ferramentas de IA"
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base outline-none placeholder:text-[#86868B]"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-[#1A1A1A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-black"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
