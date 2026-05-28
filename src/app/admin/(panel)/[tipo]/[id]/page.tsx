import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { adminTypeByRoute } from "@/lib/admin";
import { AdminForm } from "@/components/admin/AdminForm";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ tipo: string; id: string }>;
}) {
  const { tipo, id } = await params;
  const type = adminTypeByRoute(tipo);
  if (!type) notFound();

  const numId = Number.parseInt(id, 10);
  if (Number.isNaN(numId)) notFound();

  const [record, tools, categories] = await Promise.all([
    safeQuery(
      () => (prisma as any)[type.model].findUnique({ where: { id: numId } }),
      null
    ),
    safeQuery(
      () => prisma.tool.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      []
    ),
    safeQuery(
      () =>
        prisma.category.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
      []
    ),
  ]);

  if (!record) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Editar {type.singular}</h1>
      <AdminForm
        type={type.key}
        routeSlug={type.route}
        tools={tools}
        categories={categories}
        initial={record}
        id={numId}
      />
    </div>
  );
}
