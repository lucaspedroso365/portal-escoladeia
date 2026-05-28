import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { adminTypeByRoute } from "@/lib/admin";
import { AdminForm } from "@/components/admin/AdminForm";

export const dynamic = "force-dynamic";

export default async function NewItemPage({
  params,
}: {
  params: Promise<{ tipo: string }>;
}) {
  const { tipo } = await params;
  const type = adminTypeByRoute(tipo);
  if (!type) notFound();

  const [tools, categories] = await Promise.all([
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

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Nova {type.singular}</h1>
      <AdminForm
        type={type.key}
        routeSlug={type.route}
        tools={tools}
        categories={categories}
        initial={null}
        id={null}
      />
    </div>
  );
}
