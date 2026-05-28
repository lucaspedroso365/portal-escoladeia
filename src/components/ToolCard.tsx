import Link from "next/link";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { ToolLogo } from "./ToolLogo";
import { PRICING_LABELS } from "@/lib/constants";
import type { Tool } from "@/types";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/ferramentas/${tool.slug}`} className="group block">
      <Card className="flex h-full flex-col p-5 transition group-hover:-translate-y-0.5">
        <div className="flex items-start gap-3">
          <ToolLogo name={tool.name} logoUrl={tool.logoUrl} size={44} />
          <div className="min-w-0 flex-1">
            <h3 className="flex items-center gap-1.5 font-semibold">
              <span className="truncate">{tool.name}</span>
            </h3>
            {tool.tagline && (
              <p className="line-clamp-2 text-sm text-[#86868B]">{tool.tagline}</p>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tool.category?.name && <Badge variant="primary">{tool.category.name}</Badge>}
          <Badge variant="muted">
            {PRICING_LABELS[tool.pricingType] ?? tool.pricingType}
          </Badge>
          {tool.isNew && <Badge variant="solid">Novo</Badge>}
        </div>
      </Card>
    </Link>
  );
}
