"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  IconSearch,
  IconMenu2,
  IconX,
  IconChevronDown,
} from "@tabler/icons-react";
import { CATEGORIES, PRIMARY_NAV, MORE_NAV } from "@/lib/constants";
import { CategoryIcon } from "./CategoryIcon";

function Logo() {
  return (
    <Link href="/" className="text-lg tracking-tight" aria-label="Escola de IA">
      <span className="font-normal">ESCOLA DE </span>
      <span className="font-bold text-[#CC785C]">I.A</span>
    </Link>
  );
}

export function Header() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setQuery("");
    router.push(`/ferramentas?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {/* Ferramentas dropdown */}
          <div className="group relative">
            <Link
              href="/ferramentas"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] hover:bg-black/5"
            >
              Ferramentas <IconChevronDown size={14} />
            </Link>
            <div className="invisible absolute left-0 top-full w-60 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="rounded-2xl bg-white p-2 shadow-[0_12px_40px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.04)]">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/ferramentas/${c.slug}`}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F5F7]"
                  >
                    <CategoryIcon icon={c.icon} size={18} className="text-[#CC785C]" />
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {PRIMARY_NAV.filter((n) => n.href !== "/ferramentas").map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm text-[#1A1A1A] hover:bg-black/5"
            >
              {n.label}
            </Link>
          ))}

          {/* Mais dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#1A1A1A] hover:bg-black/5">
              Mais <IconChevronDown size={14} />
            </button>
            <div className="invisible absolute right-0 top-full w-52 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="rounded-2xl bg-white p-2 shadow-[0_12px_40px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.04)]">
                {MORE_NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="block rounded-xl px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F5F7]"
                  >
                    {n.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Buscar"
            className="rounded-lg p-2 text-[#1A1A1A] hover:bg-black/5"
          >
            <IconSearch size={20} />
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="rounded-lg p-2 text-[#1A1A1A] hover:bg-black/5 lg:hidden"
          >
            {mobileOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-black/5 bg-white px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {PRIMARY_NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-[#1A1A1A] hover:bg-[#F5F5F7]"
              >
                {n.label}
              </Link>
            ))}
            <div className="my-1 border-t border-black/5" />
            <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#86868B]">
              Categorias
            </p>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/ferramentas/${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F5F7]"
              >
                <CategoryIcon icon={c.icon} size={18} className="text-[#CC785C]" />
                {c.name}
              </Link>
            ))}
            <div className="my-1 border-t border-black/5" />
            {MORE_NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F5F5F7]"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Search modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-white p-2 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={submitSearch} className="flex items-center gap-2">
              <IconSearch size={20} className="ml-2 text-[#86868B]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar ChatGPT, Midjourney, Claude..."
                className="flex-1 bg-transparent px-1 py-3 text-base outline-none placeholder:text-[#86868B]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#1A1A1A] px-4 py-2 text-sm font-semibold text-white hover:bg-black"
              >
                Buscar
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
