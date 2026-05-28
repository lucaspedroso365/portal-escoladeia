import type { ContentType } from "@/types";

export interface AdminType {
  /** English key used in API routes and the AI generator. */
  key: ContentType;
  /** Portuguese URL segment used under /admin. */
  route: string;
  /** Plural label. */
  label: string;
  /** Singular label. */
  singular: string;
  /** Prisma model accessor name. */
  model: string;
  /** Icon key (see AdminIcon). */
  icon: string;
}

export const ADMIN_TYPES: AdminType[] = [
  { key: "news", route: "noticias", label: "Notícias", singular: "Notícia", model: "news", icon: "news" },
  { key: "tool", route: "ferramentas", label: "Ferramentas", singular: "Ferramenta", model: "tool", icon: "tool" },
  { key: "tutorial", route: "tutoriais", label: "Tutoriais", singular: "Tutorial", model: "tutorial", icon: "tutorial" },
  { key: "comparison", route: "comparativos", label: "Comparativos", singular: "Comparativo", model: "comparison", icon: "comparison" },
  { key: "ranking", route: "rankings", label: "Rankings", singular: "Ranking", model: "ranking", icon: "ranking" },
  { key: "alternative", route: "alternativas", label: "Alternativas", singular: "Alternativa", model: "alternative", icon: "alternative" },
  { key: "price", route: "precos", label: "Preços", singular: "Preço", model: "price", icon: "price" },
  { key: "prompt", route: "prompts", label: "Prompts", singular: "Prompt", model: "prompt", icon: "prompt" },
  { key: "glossary", route: "glossario", label: "Glossário", singular: "Termo", model: "glossaryTerm", icon: "glossary" },
];

export function adminTypeByKey(key: string): AdminType | undefined {
  return ADMIN_TYPES.find((t) => t.key === key);
}

export function adminTypeByRoute(route: string): AdminType | undefined {
  return ADMIN_TYPES.find((t) => t.route === route);
}
