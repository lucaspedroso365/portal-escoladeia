import Link from "next/link";
import { CATEGORIES, MORE_NAV, PRIMARY_NAV, SITE } from "@/lib/constants";
import { NewsletterForm } from "./NewsletterForm";

const INSTITUTIONAL = [
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
  { label: "Privacidade", href: "/privacidade" },
  { label: "Termos", href: "/termos" },
  { label: "Cookies", href: "/cookies" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + newsletter */}
          <div className="lg:col-span-1">
            <div className="text-lg tracking-tight">
              <span className="font-normal">ESCOLA DE </span>
              <span className="font-bold text-[#CC785C]">I.A</span>
            </div>
            <p className="mt-3 text-sm text-[#86868B]">{SITE.description}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#86868B]">
              Receba novidades de IA
            </p>
            <NewsletterForm className="mt-2" />
          </div>

          {/* Conteúdo */}
          <div>
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Conteúdo</h3>
            <ul className="mt-3 space-y-2 text-sm text-[#86868B]">
              {PRIMARY_NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-[#1A1A1A]">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mais */}
          <div>
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Mais</h3>
            <ul className="mt-3 space-y-2 text-sm text-[#86868B]">
              {MORE_NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-[#1A1A1A]">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Categorias</h3>
            <ul className="mt-3 space-y-2 text-sm text-[#86868B]">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/ferramentas/${c.slug}`} className="hover:text-[#1A1A1A]">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-black/5 pt-6 text-xs text-[#86868B] sm:flex-row sm:items-center">
          <p>
            © {year} {SITE.name}. Todos os direitos reservados.
          </p>
          <ul className="flex flex-wrap gap-4">
            {INSTITUTIONAL.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-[#1A1A1A]">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
