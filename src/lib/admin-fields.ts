import type { ContentType } from "@/types";

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "toggle"
  | "tags"
  | "image"
  | "select";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  maxLength?: number;
  /** Static select options. */
  options?: { value: string; label: string }[];
  /** Dynamic select options resolved server-side. */
  optionsSource?: "tools" | "categories";
  /** Stored as a number; select values that are numeric ids. */
  numericId?: boolean;
}

export interface TypeSchema {
  /** Field whose value generates the slug. */
  slugFrom: string;
  /** Whether the model has a `published` flag (draft/publish flow). */
  hasPublished: boolean;
  /** Column used as the title in list tables. */
  titleField: string;
  fields: Field[];
}

const META: Field[] = [
  { name: "metaTitle", label: "Meta título", type: "text", maxLength: 70 },
  { name: "metaDescription", label: "Meta descrição", type: "textarea", maxLength: 160 },
];

const NEWS_CATEGORY_OPTIONS = [
  { value: "lancamento", label: "Lançamento" },
  { value: "atualizacao", label: "Atualização" },
  { value: "analise", label: "Análise" },
  { value: "mercado", label: "Mercado" },
  { value: "novidade", label: "Novidade" },
];

const DIFFICULTY_OPTIONS = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

const PRICING_OPTIONS = [
  { value: "free", label: "Grátis" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Pago" },
];

export const ADMIN_FIELDS: Record<ContentType, TypeSchema> = {
  news: {
    slugFrom: "title",
    hasPublished: true,
    titleField: "title",
    fields: [
      { name: "title", label: "Título", type: "text", maxLength: 120 },
      { name: "slug", label: "Slug", type: "text" },
      { name: "toolId", label: "Ferramenta", type: "select", optionsSource: "tools", numericId: true },
      { name: "category", label: "Categoria", type: "select", options: NEWS_CATEGORY_OPTIONS },
      { name: "excerpt", label: "Resumo", type: "textarea", maxLength: 160 },
      { name: "content", label: "Conteúdo (markdown)", type: "markdown" },
      { name: "coverImageUrl", label: "Imagem de capa", type: "image" },
      ...META,
    ],
  },
  tool: {
    slugFrom: "name",
    hasPublished: false,
    titleField: "name",
    fields: [
      { name: "name", label: "Nome", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "categoryId", label: "Categoria", type: "select", optionsSource: "categories", numericId: true },
      { name: "pricingType", label: "Tipo de preço", type: "select", options: PRICING_OPTIONS },
      { name: "pricingFrom", label: "Preço a partir de (US$)", type: "number" },
      { name: "rating", label: "Nota (0-5)", type: "number" },
      { name: "company", label: "Empresa", type: "text" },
      { name: "launchYear", label: "Ano de lançamento", type: "number" },
      { name: "officialUrl", label: "URL oficial", type: "text" },
      { name: "affiliateUrl", label: "URL de afiliado", type: "text" },
      { name: "description", label: "Descrição (markdown)", type: "markdown" },
      { name: "howToUse", label: "Como usar (markdown)", type: "markdown" },
      { name: "pricing", label: "Preços (markdown)", type: "markdown" },
      { name: "pros", label: "Prós", type: "tags" },
      { name: "cons", label: "Contras", type: "tags" },
      { name: "logoUrl", label: "Logo", type: "image" },
      { name: "coverImageUrl", label: "Imagem de capa", type: "image" },
      { name: "isFeatured", label: "Destaque", type: "toggle" },
      { name: "isNew", label: "Novo", type: "toggle" },
      ...META,
    ],
  },
  tutorial: {
    slugFrom: "title",
    hasPublished: true,
    titleField: "title",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "toolId", label: "Ferramenta", type: "select", optionsSource: "tools", numericId: true },
      { name: "difficulty", label: "Dificuldade", type: "select", options: DIFFICULTY_OPTIONS },
      { name: "readingTime", label: "Tempo de leitura (min)", type: "number" },
      { name: "excerpt", label: "Resumo", type: "textarea", maxLength: 160 },
      { name: "content", label: "Conteúdo (markdown)", type: "markdown" },
      { name: "coverImageUrl", label: "Imagem de capa", type: "image" },
      ...META,
    ],
  },
  comparison: {
    slugFrom: "title",
    hasPublished: true,
    titleField: "title",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "tool1Name", label: "Ferramenta 1", type: "text" },
      { name: "tool2Name", label: "Ferramenta 2", type: "text" },
      { name: "excerpt", label: "Resumo", type: "textarea", maxLength: 160 },
      { name: "content", label: "Conteúdo (markdown)", type: "markdown" },
      { name: "verdict", label: "Veredicto", type: "textarea" },
      { name: "coverImageUrl", label: "Imagem de capa", type: "image" },
      ...META,
    ],
  },
  ranking: {
    slugFrom: "title",
    hasPublished: true,
    titleField: "title",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "topic", label: "Tópico", type: "text" },
      { name: "excerpt", label: "Resumo", type: "textarea", maxLength: 160 },
      { name: "content", label: "Conteúdo (markdown, lista numerada)", type: "markdown" },
      { name: "coverImageUrl", label: "Imagem de capa", type: "image" },
      ...META,
    ],
  },
  alternative: {
    slugFrom: "title",
    hasPublished: true,
    titleField: "title",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "targetTool", label: "Ferramenta de referência", type: "text" },
      { name: "excerpt", label: "Resumo", type: "textarea", maxLength: 160 },
      { name: "content", label: "Conteúdo (markdown)", type: "markdown" },
      { name: "coverImageUrl", label: "Imagem de capa", type: "image" },
      ...META,
    ],
  },
  price: {
    slugFrom: "title",
    hasPublished: true,
    titleField: "title",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "toolName", label: "Nome da ferramenta", type: "text" },
      { name: "content", label: "Conteúdo (markdown)", type: "markdown" },
      ...META,
    ],
  },
  prompt: {
    slugFrom: "title",
    hasPublished: true,
    titleField: "title",
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "category", label: "Categoria", type: "text" },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "promptText", label: "Texto do prompt", type: "markdown" },
      { name: "tags", label: "Tags", type: "tags" },
    ],
  },
  glossary: {
    slugFrom: "term",
    hasPublished: false,
    titleField: "term",
    fields: [
      { name: "term", label: "Termo", type: "text" },
      { name: "slug", label: "Slug", type: "text" },
      { name: "definition", label: "Definição (markdown)", type: "markdown" },
      { name: "relatedTerms", label: "Termos relacionados", type: "tags" },
      ...META,
    ],
  },
};
