export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
  createdAt: Date;
  tools?: Tool[];
  _count?: { tools: number };
}

export interface Tool {
  id: number;
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
  howToUse: string | null;
  pricing: string | null;
  pros: unknown;
  cons: unknown;
  officialUrl: string | null;
  affiliateUrl: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  pricingType: string;
  pricingFrom: number | null;
  rating: number | null;
  monthlyVisits: string | null;
  launchYear: number | null;
  company: string | null;
  headquarters: string | null;
  isFeatured: boolean;
  isNew: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  categoryId: number;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface News {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  category: string;
  metaTitle: string | null;
  metaDescription: string | null;
  published: boolean;
  publishedAt: Date | null;
  views: number;
  toolId: number | null;
  tool?: Tool | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tutorial {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  difficulty: string;
  readingTime: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  published: boolean;
  publishedAt: Date | null;
  toolId: number | null;
  tool?: Tool | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comparison {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  verdict: string | null;
  tool1Name: string;
  tool2Name: string;
  metaTitle: string | null;
  metaDescription: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ranking {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  topic: string;
  metaTitle: string | null;
  metaDescription: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Alternative {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  targetTool: string;
  metaTitle: string | null;
  metaDescription: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Price {
  id: number;
  title: string;
  slug: string;
  content: string;
  toolName: string;
  metaTitle: string | null;
  metaDescription: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prompt {
  id: number;
  title: string;
  slug: string;
  promptText: string;
  description: string | null;
  category: string;
  tags: unknown;
  metaTitle: string | null;
  metaDescription: string | null;
  published: boolean;
  createdAt: Date;
}

export interface GlossaryTerm {
  id: number;
  term: string;
  slug: string;
  definition: string;
  relatedTerms: unknown;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Newsletter {
  id: number;
  email: string;
  active: boolean;
  createdAt: Date;
}

export type ContentType =
  | "news"
  | "tool"
  | "tutorial"
  | "comparison"
  | "ranking"
  | "alternative"
  | "price"
  | "prompt"
  | "glossary";
