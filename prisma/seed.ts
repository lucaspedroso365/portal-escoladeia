import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* -------------------------------------------------------------------------- */
/*  Categories                                                                */
/* -------------------------------------------------------------------------- */

const CATEGORIES = [
  { name: "Texto", icon: "message", order: 1, description: "Modelos de linguagem e assistentes de escrita com IA." },
  { name: "Imagem", icon: "photo", order: 2, description: "Geradores de imagem e arte por inteligência artificial." },
  { name: "Vídeo", icon: "video", order: 3, description: "Criação e edição de vídeo com IA generativa." },
  { name: "Áudio", icon: "microphone", order: 4, description: "Síntese de voz, música e áudio com IA." },
  { name: "Código", icon: "code", order: 5, description: "Assistentes de programação e geração de código." },
  { name: "APIs", icon: "plug", order: 6, description: "APIs de modelos de IA para desenvolvedores." },
  { name: "Plugins", icon: "puzzle", order: 7, description: "Extensões e integrações com IA." },
];

/* -------------------------------------------------------------------------- */
/*  Tools (25)                                                                */
/* -------------------------------------------------------------------------- */

type ToolSeed = {
  name: string;
  cat: string;
  tagline: string;
  pricingType: string;
  pricingFrom?: number;
  rating: number;
  url: string;
  company: string;
  year: number;
  featured?: boolean;
  isNew?: boolean;
};

const TOOLS: ToolSeed[] = [
  { name: "ChatGPT", cat: "Texto", tagline: "O assistente conversacional da OpenAI.", pricingType: "freemium", pricingFrom: 0, rating: 4.8, url: "https://chat.openai.com", company: "OpenAI", year: 2022, featured: true },
  { name: "Claude", cat: "Texto", tagline: "Assistente de IA da Anthropic focado em segurança.", pricingType: "freemium", pricingFrom: 0, rating: 4.7, url: "https://claude.ai", company: "Anthropic", year: 2023, featured: true },
  { name: "Gemini", cat: "Texto", tagline: "A IA multimodal do Google.", pricingType: "freemium", pricingFrom: 0, rating: 4.5, url: "https://gemini.google.com", company: "Google", year: 2023, featured: true },
  { name: "Grok", cat: "Texto", tagline: "A IA da xAI integrada ao X.", pricingType: "paid", pricingFrom: 8, rating: 4.1, url: "https://x.ai", company: "xAI", year: 2023, isNew: true },
  { name: "Perplexity", cat: "Texto", tagline: "Motor de busca conversacional com IA.", pricingType: "freemium", pricingFrom: 0, rating: 4.6, url: "https://perplexity.ai", company: "Perplexity AI", year: 2022, featured: true },
  { name: "Microsoft Copilot", cat: "Texto", tagline: "O copiloto de IA da Microsoft.", pricingType: "freemium", pricingFrom: 0, rating: 4.3, url: "https://copilot.microsoft.com", company: "Microsoft", year: 2023 },
  { name: "Mistral", cat: "Texto", tagline: "Modelos abertos e eficientes da Mistral AI.", pricingType: "freemium", pricingFrom: 0, rating: 4.3, url: "https://mistral.ai", company: "Mistral AI", year: 2023 },
  { name: "DeepSeek", cat: "Texto", tagline: "Modelos de IA abertos e eficientes.", pricingType: "freemium", pricingFrom: 0, rating: 4.4, url: "https://deepseek.com", company: "DeepSeek", year: 2023, isNew: true },
  { name: "Midjourney", cat: "Imagem", tagline: "Geração de imagens artísticas de alta qualidade.", pricingType: "paid", pricingFrom: 10, rating: 4.8, url: "https://midjourney.com", company: "Midjourney", year: 2022, featured: true },
  { name: "DALL-E", cat: "Imagem", tagline: "Geração de imagens da OpenAI.", pricingType: "paid", pricingFrom: 20, rating: 4.4, url: "https://openai.com/dall-e", company: "OpenAI", year: 2021 },
  { name: "Stable Diffusion", cat: "Imagem", tagline: "Geração de imagens open-source.", pricingType: "free", pricingFrom: 0, rating: 4.5, url: "https://stability.ai", company: "Stability AI", year: 2022 },
  { name: "Adobe Firefly", cat: "Imagem", tagline: "IA generativa da Adobe para criativos.", pricingType: "freemium", pricingFrom: 0, rating: 4.4, url: "https://firefly.adobe.com", company: "Adobe", year: 2023 },
  { name: "Imagen", cat: "Imagem", tagline: "O gerador de imagens do Google.", pricingType: "paid", pricingFrom: 0, rating: 4.5, url: "https://deepmind.google/technologies/imagen", company: "Google", year: 2023, isNew: true },
  { name: "Flux", cat: "Imagem", tagline: "Geração de imagens de alta fidelidade da Black Forest Labs.", pricingType: "freemium", pricingFrom: 0, rating: 4.6, url: "https://blackforestlabs.ai", company: "Black Forest Labs", year: 2024, isNew: true },
  { name: "Sora", cat: "Vídeo", tagline: "Geração de vídeo da OpenAI.", pricingType: "paid", pricingFrom: 20, rating: 4.6, url: "https://openai.com/sora", company: "OpenAI", year: 2024, featured: true, isNew: true },
  { name: "Runway", cat: "Vídeo", tagline: "Suite de criação de vídeo com IA.", pricingType: "freemium", pricingFrom: 12, rating: 4.5, url: "https://runwayml.com", company: "Runway", year: 2018 },
  { name: "Pika", cat: "Vídeo", tagline: "Geração de vídeo a partir de texto e imagem.", pricingType: "freemium", pricingFrom: 0, rating: 4.3, url: "https://pika.art", company: "Pika Labs", year: 2023, isNew: true },
  { name: "Kling", cat: "Vídeo", tagline: "Geração de vídeo realista da Kuaishou.", pricingType: "freemium", pricingFrom: 0, rating: 4.4, url: "https://klingai.com", company: "Kuaishou", year: 2024, isNew: true },
  { name: "ElevenLabs", cat: "Áudio", tagline: "Síntese de voz realista com IA.", pricingType: "freemium", pricingFrom: 5, rating: 4.7, url: "https://elevenlabs.io", company: "ElevenLabs", year: 2022, featured: true },
  { name: "Suno", cat: "Áudio", tagline: "Geração de músicas completas com IA.", pricingType: "freemium", pricingFrom: 8, rating: 4.5, url: "https://suno.com", company: "Suno", year: 2023, isNew: true },
  { name: "GitHub Copilot", cat: "Código", tagline: "Par de programação com IA.", pricingType: "paid", pricingFrom: 10, rating: 4.6, url: "https://github.com/features/copilot", company: "GitHub", year: 2021, featured: true },
  { name: "Cursor", cat: "Código", tagline: "O editor de código nativo de IA.", pricingType: "freemium", pricingFrom: 20, rating: 4.7, url: "https://cursor.com", company: "Anysphere", year: 2023, featured: true, isNew: true },
  { name: "v0", cat: "Código", tagline: "Geração de UI com IA da Vercel.", pricingType: "freemium", pricingFrom: 0, rating: 4.4, url: "https://v0.dev", company: "Vercel", year: 2023, isNew: true },
  { name: "OpenAI API", cat: "APIs", tagline: "API dos modelos GPT da OpenAI.", pricingType: "paid", pricingFrom: 0, rating: 4.7, url: "https://platform.openai.com", company: "OpenAI", year: 2020 },
  { name: "Anthropic API", cat: "APIs", tagline: "API dos modelos Claude da Anthropic.", pricingType: "paid", pricingFrom: 0, rating: 4.6, url: "https://console.anthropic.com", company: "Anthropic", year: 2023 },
];

/* -------------------------------------------------------------------------- */
/*  Glossary (40)                                                             */
/* -------------------------------------------------------------------------- */

const GLOSSARY: { term: string; definition: string; related?: string[] }[] = [
  { term: "LLM", definition: "Large Language Model (Modelo de Linguagem de Grande Escala) é um modelo de IA treinado em enormes volumes de texto para entender e gerar linguagem natural.", related: ["Transformer", "Token"] },
  { term: "Prompt", definition: "Instrução ou pergunta enviada a um modelo de IA para obter uma resposta.", related: ["Prompt Engineering", "Few-shot"] },
  { term: "Token", definition: "Unidade básica de texto processada por um modelo, podendo ser uma palavra, parte de palavra ou caractere.", related: ["Tokenização", "Context Window"] },
  { term: "RAG", definition: "Retrieval-Augmented Generation combina busca de informações com geração de texto, permitindo respostas baseadas em dados externos.", related: ["Embeddings", "Vector Database"] },
  { term: "Embeddings", definition: "Representações numéricas (vetores) de texto ou dados que capturam significado semântico.", related: ["Vector Database", "Semantic Search"] },
  { term: "Fine-tuning", definition: "Processo de ajustar um modelo pré-treinado com dados específicos para uma tarefa.", related: ["Treinamento", "LoRA"] },
  { term: "Transformer", definition: "Arquitetura de rede neural baseada em atenção que sustenta os LLMs modernos.", related: ["Attention", "LLM"] },
  { term: "GPT", definition: "Generative Pre-trained Transformer é a família de modelos de linguagem da OpenAI.", related: ["LLM", "Transformer"] },
  { term: "Alucinação", definition: "Quando um modelo de IA gera informações falsas ou inventadas com aparência de verdade.", related: ["LLM", "RAG"] },
  { term: "Temperature", definition: "Parâmetro que controla a aleatoriedade das respostas: valores baixos geram saídas mais determinísticas.", related: ["Inferência", "LLM"] },
  { term: "Zero-shot", definition: "Capacidade de um modelo realizar uma tarefa sem exemplos prévios no prompt.", related: ["Few-shot", "Prompt"] },
  { term: "Few-shot", definition: "Técnica de fornecer poucos exemplos no prompt para guiar o modelo.", related: ["Zero-shot", "Prompt Engineering"] },
  { term: "Chain-of-Thought", definition: "Técnica em que o modelo raciocina passo a passo antes de dar a resposta final.", related: ["Prompt Engineering", "LLM"] },
  { term: "Diffusion", definition: "Modelos de difusão geram imagens removendo ruído de forma iterativa a partir de ruído aleatório.", related: ["GAN", "Latent Space"] },
  { term: "GAN", definition: "Generative Adversarial Network é uma arquitetura com dois modelos que competem para gerar dados realistas.", related: ["Diffusion", "Deep Learning"] },
  { term: "Rede Neural", definition: "Modelo computacional inspirado no cérebro, composto por camadas de neurônios artificiais.", related: ["Deep Learning", "Transformer"] },
  { term: "Deep Learning", definition: "Subárea do machine learning que usa redes neurais profundas com muitas camadas.", related: ["Machine Learning", "Rede Neural"] },
  { term: "Machine Learning", definition: "Campo da IA em que sistemas aprendem padrões a partir de dados sem programação explícita.", related: ["Deep Learning", "Treinamento"] },
  { term: "Inferência", definition: "Processo de usar um modelo treinado para gerar previsões ou respostas.", related: ["Treinamento", "Temperature"] },
  { term: "Treinamento", definition: "Processo de ajustar os parâmetros de um modelo usando dados.", related: ["Fine-tuning", "Backpropagation"] },
  { term: "Overfitting", definition: "Quando um modelo memoriza os dados de treino e generaliza mal para dados novos.", related: ["Treinamento", "Machine Learning"] },
  { term: "Backpropagation", definition: "Algoritmo que ajusta os pesos de uma rede neural propagando o erro de volta pelas camadas.", related: ["Treinamento", "Rede Neural"] },
  { term: "Attention", definition: "Mecanismo que permite ao modelo ponderar a importância de diferentes partes da entrada.", related: ["Transformer", "LLM"] },
  { term: "Context Window", definition: "Quantidade máxima de tokens que um modelo consegue considerar de uma vez.", related: ["Token", "LLM"] },
  { term: "Multimodal", definition: "Modelos que processam múltiplos tipos de dados, como texto, imagem e áudio.", related: ["LLM", "Embeddings"] },
  { term: "Tokenização", definition: "Processo de dividir o texto em tokens para o modelo processar.", related: ["Token", "LLM"] },
  { term: "Vector Database", definition: "Banco de dados otimizado para armazenar e buscar embeddings por similaridade.", related: ["Embeddings", "Semantic Search"] },
  { term: "Semantic Search", definition: "Busca baseada em significado, usando embeddings em vez de palavras exatas.", related: ["Embeddings", "Vector Database"] },
  { term: "Prompt Engineering", definition: "Prática de criar e otimizar prompts para obter melhores resultados de modelos de IA.", related: ["Prompt", "Few-shot"] },
  { term: "Agente", definition: "Sistema de IA que planeja e executa ações de forma autônoma para atingir um objetivo.", related: ["Function Calling", "LLM"] },
  { term: "Function Calling", definition: "Capacidade de um modelo invocar funções ou ferramentas externas de forma estruturada.", related: ["Agente", "LLM"] },
  { term: "System Prompt", definition: "Instrução de alto nível que define o comportamento e o papel do modelo.", related: ["Prompt", "Prompt Engineering"] },
  { term: "Quantização", definition: "Técnica de reduzir a precisão dos parâmetros para diminuir tamanho e custo do modelo.", related: ["Parâmetros", "Inferência"] },
  { term: "LoRA", definition: "Low-Rank Adaptation é um método eficiente de fine-tuning que treina poucos parâmetros adicionais.", related: ["Fine-tuning", "Parâmetros"] },
  { term: "Destilação", definition: "Processo de treinar um modelo menor para imitar um modelo maior.", related: ["Fine-tuning", "Quantização"] },
  { term: "Reinforcement Learning", definition: "Aprendizado por recompensa, em que o agente aprende com tentativa e erro.", related: ["RLHF", "Machine Learning"] },
  { term: "RLHF", definition: "Reinforcement Learning from Human Feedback alinha modelos usando feedback humano.", related: ["Reinforcement Learning", "Fine-tuning"] },
  { term: "Latent Space", definition: "Espaço vetorial comprimido onde o modelo representa conceitos de forma abstrata.", related: ["Embeddings", "Diffusion"] },
  { term: "Checkpoint", definition: "Estado salvo dos pesos de um modelo em um ponto do treinamento.", related: ["Treinamento", "Parâmetros"] },
  { term: "Parâmetros", definition: "Valores aprendidos por um modelo durante o treinamento; o número deles indica seu tamanho.", related: ["Treinamento", "Quantização"] },
];

/* -------------------------------------------------------------------------- */
/*  Starter editorial content                                                 */
/* -------------------------------------------------------------------------- */

const NEWS = [
  { title: "OpenAI lança novo modelo com raciocínio aprimorado", category: "lancamento", tool: "ChatGPT", excerpt: "A OpenAI anunciou um modelo que melhora tarefas de raciocínio e matemática.", content: "## Novidade\n\nA OpenAI apresentou seu novo modelo com raciocínio aprimorado.\n\n## O que muda\n\nGanhos em matemática, programação e lógica.\n\n## Disponibilidade\n\nLiberado para assinantes nesta semana." },
  { title: "Anthropic expande janela de contexto do Claude", category: "atualizacao", tool: "Claude", excerpt: "O Claude agora suporta janelas de contexto ainda maiores.", content: "## Atualização\n\nA Anthropic aumentou a janela de contexto do Claude.\n\n## Impacto\n\nDocumentos muito maiores em uma única conversa." },
  { title: "Google integra Gemini a mais produtos do Workspace", category: "atualizacao", tool: "Gemini", excerpt: "O Gemini chega a novos apps do Google Workspace.", content: "## Novidade\n\nO Google expandiu a integração do Gemini.\n\n## Recursos\n\nResumo, escrita e análise nos apps." },
  { title: "Midjourney melhora consistência de personagens", category: "lancamento", tool: "Midjourney", excerpt: "Nova versão melhora a consistência entre imagens.", content: "## Lançamento\n\nMelhorias para manter personagens consistentes.\n\n## Como usar\n\nUtilize as novas referências de personagem." },
  { title: "Mercado de IA generativa deve dobrar até o próximo ano", category: "mercado", tool: null, excerpt: "Analistas projetam crescimento acelerado do setor.", content: "## Mercado\n\nRelatórios apontam crescimento expressivo.\n\n## Tendências\n\nEmpresas aceleram a adoção de IA." },
  { title: "Análise: vale a pena assinar o ChatGPT Plus em 2026?", category: "analise", tool: "ChatGPT", excerpt: "Avaliamos se o investimento no ChatGPT Plus compensa.", content: "## Análise\n\nO Plus oferece acesso prioritário e recursos avançados.\n\n## Conclusão\n\nPara uso intenso, o plano se paga." },
];

const TUTORIALS = [
  { title: "Como escrever prompts melhores no ChatGPT", difficulty: "iniciante", time: 6, tool: "ChatGPT", excerpt: "Técnicas práticas para respostas melhores.", content: "## Introdução\n\nEscrever bons prompts é uma habilidade.\n\n## Seja específico\n\nDê contexto e exemplos.\n\n## Itere\n\nRefine conversando." },
  { title: "Primeiros passos com o Midjourney", difficulty: "iniciante", time: 8, tool: "Midjourney", excerpt: "Guia inicial para criar imagens no Midjourney.", content: "## Configuração\n\nEntre no Discord.\n\n## Primeiro comando\n\nUse /imagine.\n\n## Refinamento\n\nVariações e upscale." },
  { title: "Usando o Claude para documentos longos", difficulty: "intermediario", time: 7, tool: "Claude", excerpt: "Aproveite a janela de contexto do Claude.", content: "## Upload\n\nEnvie o documento.\n\n## Perguntas\n\nFaça perguntas específicas.\n\n## Resumos\n\nPeça resumos estruturados." },
  { title: "Configurando o Cursor para produtividade", difficulty: "intermediario", time: 9, tool: "Cursor", excerpt: "Configure o Cursor e programe mais rápido.", content: "## Instalação\n\nImporte configs do VS Code.\n\n## Atalhos\n\nCmd+K e Cmd+L.\n\n## Contexto\n\nIndexe seu codebase." },
];

const COMPARISONS = [
  { title: "ChatGPT vs Claude", t1: "ChatGPT", t2: "Claude", verdict: "Para textos longos, Claude. Para ecossistema, ChatGPT.", excerpt: "Qual assistente é melhor para você?", content: "## Visão geral\n\nAmbos são excelentes.\n\n## Diferenças\n\nClaude tem contexto maior; ChatGPT tem mais integrações." },
  { title: "Midjourney vs DALL-E", t1: "Midjourney", t2: "DALL-E", verdict: "Midjourney para arte; DALL-E para conveniência.", excerpt: "Os dois principais geradores de imagem.", content: "## Qualidade\n\nMidjourney é mais artístico.\n\n## Facilidade\n\nDALL-E é mais acessível." },
  { title: "Gemini vs ChatGPT", t1: "Gemini", t2: "ChatGPT", verdict: "Gemini para usuários Google; ChatGPT para versatilidade.", excerpt: "A IA do Google contra a da OpenAI.", content: "## Integração\n\nGemini integra ao Google.\n\n## Ecossistema\n\nChatGPT tem mais plugins." },
  { title: "Cursor vs GitHub Copilot", t1: "Cursor", t2: "GitHub Copilot", verdict: "Cursor para imersão; Copilot para flexibilidade.", excerpt: "Qual ferramenta de IA para código é melhor?", content: "## Abordagem\n\nCursor é um editor completo.\n\n## Integração\n\nCopilot funciona em vários editores." },
];

const RANKINGS = [
  { title: "As 10 melhores IAs de texto em 2026", topic: "Texto", excerpt: "Ranking das melhores ferramentas de escrita.", content: "## Ranking\n\n1. ChatGPT\n2. Claude\n3. Gemini\n4. Perplexity" },
  { title: "Top 5 geradores de imagem com IA", topic: "Imagem", excerpt: "As melhores ferramentas de imagem.", content: "## Ranking\n\n1. Midjourney\n2. DALL-E\n3. Stable Diffusion" },
  { title: "Melhores IAs para programadores", topic: "Código", excerpt: "As IAs que aumentam a produtividade.", content: "## Ranking\n\n1. Cursor\n2. GitHub Copilot\n3. v0" },
  { title: "As melhores IAs de vídeo do momento", topic: "Vídeo", excerpt: "Ferramentas de geração de vídeo em alta.", content: "## Ranking\n\n1. Sora\n2. Runway\n3. Pika" },
];

const ALTERNATIVES = [
  { title: "Melhores alternativas ao ChatGPT", target: "ChatGPT", excerpt: "Opções para substituir o ChatGPT.", content: "## Alternativas\n\n- Claude\n- Gemini\n- Perplexity" },
  { title: "Alternativas ao Midjourney", target: "Midjourney", excerpt: "Outras ferramentas de imagem.", content: "## Alternativas\n\n- DALL-E\n- Stable Diffusion\n- Flux" },
  { title: "Alternativas ao GitHub Copilot", target: "GitHub Copilot", excerpt: "Outras IAs para programar.", content: "## Alternativas\n\n- Cursor\n- Codeium" },
  { title: "Alternativas ao Claude", target: "Claude", excerpt: "Assistentes que competem com o Claude.", content: "## Alternativas\n\n- ChatGPT\n- Gemini" },
];

const PRICES = [
  { title: "Quanto custa o ChatGPT?", tool: "ChatGPT", content: "## Planos\n\n- Grátis: US$ 0\n- Plus: US$ 20/mês\n- Team: US$ 25/usuário" },
  { title: "Quanto custa o Midjourney?", tool: "Midjourney", content: "## Planos\n\n- Basic: US$ 10/mês\n- Standard: US$ 30/mês\n- Pro: US$ 60/mês" },
  { title: "Quanto custa o Claude?", tool: "Claude", content: "## Planos\n\n- Grátis: US$ 0\n- Pro: US$ 20/mês\n- Team: US$ 25/usuário" },
  { title: "Quanto custa o ElevenLabs?", tool: "ElevenLabs", content: "## Planos\n\n- Grátis: US$ 0\n- Starter: US$ 5/mês\n- Creator: US$ 22/mês" },
];

const PROMPTS = [
  { title: "Resumir um artigo longo", category: "Produtividade", tags: ["resumo", "texto"], promptText: "Resuma o texto a seguir em 5 pontos principais:\n\n[COLE O TEXTO]", description: "Resuma textos longos rapidamente." },
  { title: "Gerar ideias de conteúdo", category: "Marketing", tags: ["conteúdo", "ideias"], promptText: "Atue como estrategista de conteúdo. Gere 10 ideias de posts sobre [TEMA] para [PÚBLICO].", description: "Brainstorming de conteúdo." },
  { title: "Revisar código", category: "Programação", tags: ["código", "revisão"], promptText: "Revise o código a seguir apontando bugs e melhorias:\n\n```\n[CÓDIGO]\n```", description: "Revisão de código com IA." },
  { title: "Criar prompt de imagem", category: "Imagem", tags: ["imagem", "prompt"], promptText: "Crie um prompt detalhado em inglês para uma imagem de [DESCRIÇÃO], com estilo e iluminação.", description: "Gere prompts de imagem." },
  { title: "Escrever e-mail profissional", category: "Produtividade", tags: ["email", "escrita"], promptText: "Escreva um e-mail profissional sobre [ASSUNTO] para [DESTINATÁRIO], com tom [TOM].", description: "Redija e-mails." },
  { title: "Explicar conceito complexo", category: "Educação", tags: ["educação"], promptText: "Explique [CONCEITO] como se eu tivesse 12 anos, usando uma analogia.", description: "Explicações simples." },
];

/* -------------------------------------------------------------------------- */
/*  Run                                                                       */
/* -------------------------------------------------------------------------- */

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000);

async function main() {
  console.log("Seeding categories...");
  const categoryIdBySlug = new Map<string, number>();
  for (const c of CATEGORIES) {
    const slug = slugify(c.name);
    const cat = await prisma.category.upsert({
      where: { slug },
      update: { name: c.name, icon: c.icon, order: c.order, description: c.description },
      create: { name: c.name, slug, icon: c.icon, order: c.order, description: c.description },
    });
    categoryIdBySlug.set(c.name, cat.id);
  }

  console.log("Seeding tools...");
  const toolIdByName = new Map<string, number>();
  for (const t of TOOLS) {
    const slug = slugify(t.name);
    const categoryId = categoryIdBySlug.get(t.cat)!;
    const tool = await prisma.tool.upsert({
      where: { slug },
      update: {
        name: t.name, tagline: t.tagline, pricingType: t.pricingType, pricingFrom: t.pricingFrom ?? null,
        rating: t.rating, officialUrl: t.url, company: t.company, launchYear: t.year,
        isFeatured: !!t.featured, isNew: !!t.isNew, categoryId,
      },
      create: {
        name: t.name, slug, tagline: t.tagline,
        description: `O ${t.name} é uma ferramenta de IA da categoria ${t.cat}. Conteúdo detalhado gerado pelo painel administrativo.`,
        pricingType: t.pricingType, pricingFrom: t.pricingFrom ?? null, rating: t.rating,
        officialUrl: t.url, company: t.company, launchYear: t.year,
        isFeatured: !!t.featured, isNew: !!t.isNew, categoryId,
        metaTitle: `${t.name}: o que é, como usar e preços`,
        metaDescription: `Guia completo do ${t.name}: recursos, planos, prós e contras.`,
      },
    });
    toolIdByName.set(t.name, tool.id);
  }

  console.log("Seeding glossary...");
  for (const g of GLOSSARY) {
    const slug = slugify(g.term);
    await prisma.glossaryTerm.upsert({
      where: { slug },
      update: { definition: g.definition, relatedTerms: g.related ?? [] },
      create: { term: g.term, slug, definition: g.definition, relatedTerms: g.related ?? [] },
    });
  }

  console.log("Seeding news...");
  let i = 0;
  for (const n of NEWS) {
    const slug = slugify(n.title);
    await prisma.news.upsert({
      where: { slug },
      update: {},
      create: {
        title: n.title, slug, excerpt: n.excerpt, content: n.content, category: n.category,
        published: true, publishedAt: daysAgo(i + 1), views: 100 * (NEWS.length - i),
        toolId: n.tool ? toolIdByName.get(n.tool) ?? null : null,
        metaTitle: n.title, metaDescription: n.excerpt,
      },
    });
    i++;
  }

  console.log("Seeding tutorials...");
  i = 0;
  for (const t of TUTORIALS) {
    const slug = slugify(t.title);
    await prisma.tutorial.upsert({
      where: { slug },
      update: {},
      create: {
        title: t.title, slug, excerpt: t.excerpt, content: t.content, difficulty: t.difficulty,
        readingTime: t.time, published: true, publishedAt: daysAgo(i + 2),
        toolId: t.tool ? toolIdByName.get(t.tool) ?? null : null,
        metaTitle: t.title, metaDescription: t.excerpt,
      },
    });
    i++;
  }

  console.log("Seeding comparisons...");
  i = 0;
  for (const c of COMPARISONS) {
    const slug = slugify(c.title);
    await prisma.comparison.upsert({
      where: { slug },
      update: {},
      create: {
        title: c.title, slug, excerpt: c.excerpt, content: c.content, verdict: c.verdict,
        tool1Name: c.t1, tool2Name: c.t2, published: true, publishedAt: daysAgo(i + 3),
        metaTitle: c.title, metaDescription: c.excerpt,
      },
    });
    i++;
  }

  console.log("Seeding rankings...");
  i = 0;
  for (const r of RANKINGS) {
    const slug = slugify(r.title);
    await prisma.ranking.upsert({
      where: { slug },
      update: {},
      create: {
        title: r.title, slug, excerpt: r.excerpt, content: r.content, topic: r.topic,
        published: true, publishedAt: daysAgo(i + 3), metaTitle: r.title, metaDescription: r.excerpt,
      },
    });
    i++;
  }

  console.log("Seeding alternatives...");
  i = 0;
  for (const a of ALTERNATIVES) {
    const slug = slugify(a.title);
    await prisma.alternative.upsert({
      where: { slug },
      update: {},
      create: {
        title: a.title, slug, excerpt: a.excerpt, content: a.content, targetTool: a.target,
        published: true, publishedAt: daysAgo(i + 3), metaTitle: a.title, metaDescription: a.excerpt,
      },
    });
    i++;
  }

  console.log("Seeding prices...");
  i = 0;
  for (const p of PRICES) {
    const slug = slugify(p.title);
    await prisma.price.upsert({
      where: { slug },
      update: {},
      create: {
        title: p.title, slug, content: p.content, toolName: p.tool,
        published: true, publishedAt: daysAgo(i + 3), metaTitle: p.title,
        metaDescription: `Preços e planos do ${p.tool}.`,
      },
    });
    i++;
  }

  console.log("Seeding prompts...");
  for (const p of PROMPTS) {
    const slug = slugify(p.title);
    await prisma.prompt.upsert({
      where: { slug },
      update: {},
      create: {
        title: p.title, slug, promptText: p.promptText, description: p.description,
        category: p.category, tags: p.tags, published: true,
      },
    });
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
