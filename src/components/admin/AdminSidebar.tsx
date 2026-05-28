"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLogout } from "@tabler/icons-react";
import { ADMIN_TYPES } from "@/lib/admin";
import { AdminIcon } from "./AdminIcon";

const MAIN = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/novo", label: "Novo conteúdo", icon: "plus" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const itemClass = (active: boolean) =>
    `flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition ${
      active ? "bg-[#CC785C] text-white" : "text-white/80 hover:bg-[#2A2A2C]"
    }`;

  return (
    <aside className="sticky top-0 flex h-screen w-[200px] shrink-0 flex-col bg-[#1A1A1A] text-white">
      <div className="px-4 py-5">
        <Link href="/admin" className="text-base tracking-tight">
          <span className="font-normal">ESCOLA DE </span>
          <span className="font-bold text-[#CC785C]">I.A</span>
        </Link>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/40">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
          Principal
        </p>
        {MAIN.map((m) => (
          <Link key={m.href} href={m.href} className={itemClass(pathname === m.href)}>
            <AdminIcon name={m.icon} />
            {m.label}
          </Link>
        ))}

        <p className="px-3 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-widest text-white/40">
          Conteúdo
        </p>
        {ADMIN_TYPES.map((t) => {
          const href = `/admin/${t.route}`;
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={t.route} href={href} className={itemClass(active)}>
              <AdminIcon name={t.icon} />
              {t.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="mb-2 flex items-center gap-2.5 px-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CC785C] text-xs font-bold">
            EI
          </span>
          <span className="text-sm text-white/80">Administrador</span>
        </div>
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-[#2A2A2C]"
          >
            <IconLogout size={18} stroke={1.6} />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
