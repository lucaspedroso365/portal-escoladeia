export const SITE = {
  name: "Escola de IA",
  shortName: "Escola IA",
  domain: "escoladevideosia.com.br",
  description:
    "Tudo sobre inteligência artificial em um só lugar: ferramentas, notícias, tutoriais, comparativos e rankings de IA em português.",
  twitter: "@escoladeia",
};

export const CATEGORIES = [
  { name: "Texto", slug: "texto", icon: "message" },
  { name: "Imagem", slug: "imagem", icon: "photo" },
  { name: "Vídeo", slug: "video", icon: "video" },
  { name: "Áudio", slug: "audio", icon: "microphone" },
  { name: "Código", slug: "codigo", icon: "code" },
  { name: "APIs", slug: "apis", icon: "plug" },
  { name: "Plugins", slug: "plugins", icon: "puzzle" },
] as const;

export const NEWS_CATEGORIES = [
  { key: "todas", label: "Todas" },
  { key: "lancamento", label: "Lançamentos" },
  { key: "atualizacao", label: "Atualizações" },
  { key: "analise", label: "Análises" },
  { key: "mercado", label: "Mercado" },
  { key: "novidade", label: "Novidades" },
] as const;

export const PRIMARY_NAV = [
  { label: "Ferramentas", href: "/ferramentas" },
  { label: "Notícias", href: "/noticias" },
  { label: "Comparativos", href: "/comparativos" },
  { label: "Tutoriais", href: "/tutoriais" },
  { label: "Rankings", href: "/rankings" },
] as const;

export const MORE_NAV = [
  { label: "Alternativas", href: "/alternativas" },
  { label: "Preços", href: "/precos" },
  { label: "Prompts", href: "/prompts" },
  { label: "Glossário", href: "/glossario" },
  { label: "Lançamentos", href: "/lancamentos" },
] as const;

export const PRICING_LABELS: Record<string, string> = {
  free: "Grátis",
  freemium: "Freemium",
  paid: "Pago",
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};
