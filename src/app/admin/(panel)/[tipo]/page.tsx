import Link from "next/link";
import { notFound } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { adminTypeByRoute } from "@/lib/admin";
import { ADMIN_FIELDS } from "@/lib/admin-fields";
import { formatDate } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";

export default async function AdminListPage({
  params,
}: {
  params: Promise<{ tipo: string }>;
}) {
  const { tipo } = await params;
  const type = adminTypeByRoute(tipo);
  if (!type) notFound();

  const schema = ADMIN_FIELDS[type.key];
  const items: any[] = await safeQuery(
    () => (prisma as any)[type.model].findMany({ orderBy: { id: "desc" } }),
    []
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{type.label}</h1>
        <Link
          href={`/admin/${type.route}/novo`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#CC785C] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b86848]"
        >
          <IconPlus size={16} /> Novo
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl shadow-[0_2px_6px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.04)]">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F5F7] text-left text-xs uppercase tracking-wide text-[#86868B]">
            <tr>
              <th className="px-4 py-3">Título</th>
              {schema.hasPublished && <th className="px-4 py-3">Status</th>}
              <th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-[#86868B]">
                  Nenhum item ainda.
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-[#FAFAFA]">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/${type.route}/${item.id}`}
                    className="font-medium hover:text-[#CC785C]"
                  >
                    {String(item[schema.titleField] ?? "(sem título)")}
                  </Link>
                </td>
                {schema.hasPublished && (
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.published
                          ? "bg-green-50 text-green-700"
                          : "bg-[#F5F5F7] text-[#86868B]"
                      }`}
                    >
                      {item.published ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3 text-[#86868B]">
                  {formatDate(item.publishedAt ?? item.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
