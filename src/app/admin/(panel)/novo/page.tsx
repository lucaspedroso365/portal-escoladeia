import Link from "next/link";
import { ADMIN_TYPES } from "@/lib/admin";
import { Card } from "@/components/Card";
import { AdminIcon } from "@/components/admin/AdminIcon";

export default function NewContentPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight">Novo conteúdo</h1>
      <p className="mt-1 text-sm text-[#86868B]">Escolha o tipo de conteúdo que deseja criar.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {ADMIN_TYPES.map((t) => (
          <Link key={t.route} href={`/admin/${t.route}/novo`}>
            <Card className="flex flex-col items-center gap-3 p-6 text-center transition hover:-translate-y-0.5">
              <AdminIcon name={t.icon} size={28} className="text-[#CC785C]" />
              <span className="font-semibold">{t.singular}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
