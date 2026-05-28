/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * In-memory mock data + a small Prisma-compatible client.
 *
 * Enabled when MOCK_DATA="true" so `npm run dev` works with no MariaDB.
 * Supports the subset of the Prisma query API the app actually uses:
 * findMany / findUnique / findFirst / count / create / update / upsert /
 * delete / deleteMany, with where / orderBy / take / skip / include / select.
 */

type Row = Record<string, any>;

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

/* -------------------------------------------------------------------------- */
/*  Seed arrays                                                               */
/* -------------------------------------------------------------------------- */

export const categories: Row[] = [
  { id: 1, name: "Texto", slug: "texto", description: "Modelos de linguagem e assistentes de escrita com IA.", icon: "message", order: 1, createdAt: daysAgo(120) },
  { id: 2, name: "Imagem", slug: "imagem", description: "Geradores de imagem e arte por inteligência artificial.", icon: "photo", order: 2, createdAt: daysAgo(120) },
  { id: 3, name: "Vídeo", slug: "video", description: "Criação e edição de vídeo com IA generativa.", icon: "video", order: 3, createdAt: daysAgo(120) },
  { id: 4, name: "Áudio", slug: "audio", description: "Síntese de voz, música e áudio com IA.", icon: "microphone", order: 4, createdAt: daysAgo(120) },
  { id: 5, name: "Código", slug: "codigo", description: "Assistentes de programação e geração de código.", icon: "code", order: 5, createdAt: daysAgo(120) },
  { id: 6, name: "APIs", slug: "apis", description: "APIs de modelos de IA para desenvolvedores.", icon: "plug", order: 6, createdAt: daysAgo(120) },
  { id: 7, name: "Plugins", slug: "plugins", description: "Extensões e integrações com IA.", icon: "puzzle", order: 7, createdAt: daysAgo(120) },
];

export const tools: Row[] = [
  { id: 1, name: "ChatGPT", slug: "chatgpt", tagline: "O assistente de IA conversacional da OpenAI.", description: "O **ChatGPT** é um assistente conversacional baseado nos modelos GPT da OpenAI. Ele entende linguagem natural e ajuda em escrita, pesquisa, programação e muito mais.", howToUse: "## Como usar\n\n1. Acesse chat.openai.com\n2. Crie uma conta\n3. Digite seu prompt\n4. Refine a resposta conversando", pricing: "Gratuito com limites. ChatGPT Plus por US$ 20/mês.", pros: ["Respostas rápidas e coerentes", "Suporta múltiplos idiomas", "Integração com ferramentas", "Modo de voz", "Plugins e GPTs"], cons: ["Pode alucinar", "Limite de uso no plano grátis", "Conhecimento com data de corte"], officialUrl: "https://chat.openai.com", logoUrl: null, pricingType: "freemium", pricingFrom: 0, rating: 4.8, monthlyVisits: "1.8B", launchYear: 2022, company: "OpenAI", headquarters: "San Francisco, EUA", isFeatured: true, isNew: false, metaTitle: "ChatGPT: o que é, como usar e preços", metaDescription: "Guia completo do ChatGPT da OpenAI: recursos, planos, prós e contras.", categoryId: 1, createdAt: daysAgo(100), updatedAt: daysAgo(2) },
  { id: 2, name: "Claude", slug: "claude", tagline: "Assistente de IA da Anthropic focado em segurança.", description: "O **Claude** é o assistente da Anthropic, conhecido por respostas longas, raciocínio sólido e grande janela de contexto.", howToUse: "## Como usar\n\n1. Acesse claude.ai\n2. Faça login\n3. Envie documentos ou perguntas\n4. Use Projetos para contexto persistente", pricing: "Gratuito com limites. Claude Pro por US$ 20/mês.", pros: ["Janela de contexto enorme", "Ótimo para textos longos", "Análise de documentos", "Respostas cuidadosas", "Artifacts"], cons: ["Menos plugins que o ChatGPT", "Sem geração de imagem nativa"], officialUrl: "https://claude.ai", logoUrl: null, pricingType: "freemium", pricingFrom: 0, rating: 4.7, monthlyVisits: "120M", launchYear: 2023, company: "Anthropic", headquarters: "San Francisco, EUA", isFeatured: true, isNew: false, metaTitle: "Claude da Anthropic: o que é e como usar", metaDescription: "Tudo sobre o Claude: recursos, contexto, planos e comparações.", categoryId: 1, createdAt: daysAgo(95), updatedAt: daysAgo(1) },
  { id: 3, name: "Gemini", slug: "gemini", tagline: "A IA multimodal do Google.", description: "O **Gemini** é a família de modelos multimodais do Google, integrada ao ecossistema Workspace e Android.", howToUse: "## Como usar\n\n1. Acesse gemini.google.com\n2. Entre com sua conta Google\n3. Converse ou envie imagens", pricing: "Gratuito. Gemini Advanced no Google One AI Premium.", pros: ["Multimodal nativo", "Integração com Google", "Contexto longo", "Grátis robusto"], cons: ["Disponibilidade regional", "Respostas inconsistentes às vezes"], officialUrl: "https://gemini.google.com", logoUrl: null, pricingType: "freemium", pricingFrom: 0, rating: 4.5, monthlyVisits: "300M", launchYear: 2023, company: "Google", headquarters: "Mountain View, EUA", isFeatured: true, isNew: false, metaTitle: "Google Gemini: o que é e como usar", metaDescription: "Guia do Gemini: recursos multimodais, planos e integrações Google.", categoryId: 1, createdAt: daysAgo(90), updatedAt: daysAgo(3) },
  { id: 4, name: "Perplexity", slug: "perplexity", tagline: "Motor de busca conversacional com IA.", description: "O **Perplexity** combina busca na web com IA, citando fontes em tempo real.", howToUse: "## Como usar\n\n1. Acesse perplexity.ai\n2. Faça uma pergunta\n3. Veja as fontes citadas", pricing: "Gratuito. Pro por US$ 20/mês.", pros: ["Cita fontes", "Dados em tempo real", "Modo Focus", "Boa para pesquisa"], cons: ["Respostas curtas", "Menos criativo"], officialUrl: "https://perplexity.ai", logoUrl: null, pricingType: "freemium", pricingFrom: 0, rating: 4.6, monthlyVisits: "90M", launchYear: 2022, company: "Perplexity AI", headquarters: "San Francisco, EUA", isFeatured: true, isNew: false, metaTitle: "Perplexity AI: busca com IA", metaDescription: "Como usar o Perplexity para pesquisa com fontes em tempo real.", categoryId: 1, createdAt: daysAgo(80), updatedAt: daysAgo(4) },
  { id: 5, name: "Grok", slug: "grok", tagline: "A IA da xAI integrada ao X.", description: "O **Grok** é o assistente da xAI, com acesso em tempo real ao X (Twitter).", howToUse: "## Como usar\n\n1. Assine o X Premium\n2. Acesse o Grok\n3. Pergunte sobre tópicos atuais", pricing: "Incluído no X Premium.", pros: ["Dados em tempo real do X", "Tom descontraído", "Acesso a tendências"], cons: ["Requer assinatura X", "Menos preciso"], officialUrl: "https://x.ai", logoUrl: null, pricingType: "paid", pricingFrom: 8, rating: 4.1, monthlyVisits: "40M", launchYear: 2023, company: "xAI", headquarters: "EUA", isFeatured: false, isNew: true, metaTitle: "Grok da xAI: o que é", metaDescription: "Conheça o Grok, a IA da xAI integrada ao X.", categoryId: 1, createdAt: daysAgo(40), updatedAt: daysAgo(5) },
  { id: 6, name: "DeepSeek", slug: "deepseek", tagline: "Modelos de IA abertos e eficientes.", description: "O **DeepSeek** oferece modelos de linguagem de alto desempenho e baixo custo.", howToUse: "## Como usar\n\n1. Acesse chat.deepseek.com\n2. Faça login\n3. Use o chat ou a API", pricing: "Gratuito no chat. API de baixo custo.", pros: ["Custo baixíssimo", "Modelos abertos", "Bom em raciocínio"], cons: ["Suporte limitado", "Menos integrações"], officialUrl: "https://deepseek.com", logoUrl: null, pricingType: "freemium", pricingFrom: 0, rating: 4.4, monthlyVisits: "60M", launchYear: 2023, company: "DeepSeek", headquarters: "China", isFeatured: false, isNew: true, metaTitle: "DeepSeek: IA aberta e barata", metaDescription: "Tudo sobre o DeepSeek e seus modelos eficientes.", categoryId: 1, createdAt: daysAgo(35), updatedAt: daysAgo(6) },
  { id: 7, name: "Midjourney", slug: "midjourney", tagline: "Geração de imagens artísticas de alta qualidade.", description: "O **Midjourney** é referência em geração de imagens artísticas via prompts de texto.", howToUse: "## Como usar\n\n1. Entre no Discord do Midjourney\n2. Use /imagine\n3. Descreva a imagem", pricing: "A partir de US$ 10/mês.", pros: ["Qualidade artística excepcional", "Comunidade ativa", "Estilos variados", "Upscale de alta resolução"], cons: ["Sem plano grátis", "Funciona via Discord", "Curva de aprendizado"], officialUrl: "https://midjourney.com", logoUrl: null, pricingType: "paid", pricingFrom: 10, rating: 4.8, monthlyVisits: "50M", launchYear: 2022, company: "Midjourney", headquarters: "San Francisco, EUA", isFeatured: true, isNew: false, metaTitle: "Midjourney: gerador de imagens com IA", metaDescription: "Guia do Midjourney: como usar, planos e exemplos.", categoryId: 2, createdAt: daysAgo(88), updatedAt: daysAgo(7) },
  { id: 8, name: "DALL-E", slug: "dall-e", tagline: "Geração de imagens da OpenAI.", description: "O **DALL-E** é o gerador de imagens da OpenAI, integrado ao ChatGPT.", howToUse: "## Como usar\n\n1. Use no ChatGPT\n2. Descreva a imagem\n3. Refine com follow-ups", pricing: "Incluído no ChatGPT Plus.", pros: ["Integrado ao ChatGPT", "Edição por prompt", "Fácil de usar"], cons: ["Menos artístico que Midjourney", "Requer ChatGPT Plus"], officialUrl: "https://openai.com/dall-e", logoUrl: null, pricingType: "paid", pricingFrom: 20, rating: 4.4, monthlyVisits: "30M", launchYear: 2021, company: "OpenAI", headquarters: "San Francisco, EUA", isFeatured: false, isNew: false, metaTitle: "DALL-E: imagens com IA da OpenAI", metaDescription: "Como usar o DALL-E para gerar imagens.", categoryId: 2, createdAt: daysAgo(70), updatedAt: daysAgo(8) },
  { id: 9, name: "Stable Diffusion", slug: "stable-diffusion", tagline: "Geração de imagens open-source.", description: "O **Stable Diffusion** é um modelo aberto de geração de imagens que roda localmente.", howToUse: "## Como usar\n\n1. Instale localmente ou use online\n2. Configure o prompt\n3. Gere e ajuste", pricing: "Gratuito (open-source).", pros: ["Open-source", "Roda localmente", "Altamente customizável", "Sem censura forte"], cons: ["Requer hardware", "Configuração técnica"], officialUrl: "https://stability.ai", logoUrl: null, pricingType: "free", pricingFrom: 0, rating: 4.5, monthlyVisits: "20M", launchYear: 2022, company: "Stability AI", headquarters: "Londres, Reino Unido", isFeatured: false, isNew: false, metaTitle: "Stable Diffusion: IA de imagem open-source", metaDescription: "Guia do Stable Diffusion e como rodar localmente.", categoryId: 2, createdAt: daysAgo(65), updatedAt: daysAgo(9) },
  { id: 10, name: "Sora", slug: "sora", tagline: "Geração de vídeo da OpenAI.", description: "O **Sora** é o modelo de geração de vídeo da OpenAI, criando cenas realistas a partir de texto.", howToUse: "## Como usar\n\n1. Acesse o Sora\n2. Descreva a cena\n3. Gere o vídeo", pricing: "Incluído em planos do ChatGPT.", pros: ["Vídeos realistas", "Da OpenAI", "Controle de cena"], cons: ["Acesso limitado", "Custo alto"], officialUrl: "https://openai.com/sora", logoUrl: null, pricingType: "paid", pricingFrom: 20, rating: 4.6, monthlyVisits: "15M", launchYear: 2024, company: "OpenAI", headquarters: "San Francisco, EUA", isFeatured: true, isNew: true, metaTitle: "Sora: geração de vídeo com IA", metaDescription: "Tudo sobre o Sora da OpenAI.", categoryId: 3, createdAt: daysAgo(30), updatedAt: daysAgo(1) },
  { id: 11, name: "Runway", slug: "runway", tagline: "Suite de criação de vídeo com IA.", description: "O **Runway** oferece ferramentas de geração e edição de vídeo com IA para criadores.", howToUse: "## Como usar\n\n1. Crie uma conta\n2. Escolha a ferramenta (Gen)\n3. Gere e edite", pricing: "Freemium. Planos a partir de US$ 12/mês.", pros: ["Suite completa", "Gen-3 poderoso", "Edição avançada"], cons: ["Créditos limitados", "Curva de aprendizado"], officialUrl: "https://runwayml.com", logoUrl: null, pricingType: "freemium", pricingFrom: 12, rating: 4.5, monthlyVisits: "12M", launchYear: 2018, company: "Runway", headquarters: "Nova York, EUA", isFeatured: false, isNew: false, metaTitle: "Runway: vídeo com IA", metaDescription: "Guia do Runway para criação de vídeo.", categoryId: 3, createdAt: daysAgo(55), updatedAt: daysAgo(10) },
  { id: 12, name: "ElevenLabs", slug: "elevenlabs", tagline: "Síntese de voz realista com IA.", description: "O **ElevenLabs** gera vozes realistas e clonagem de voz em múltiplos idiomas.", howToUse: "## Como usar\n\n1. Crie uma conta\n2. Escolha ou clone uma voz\n3. Digite o texto e gere", pricing: "Freemium. Planos a partir de US$ 5/mês.", pros: ["Vozes muito realistas", "Clonagem de voz", "Múltiplos idiomas", "API robusta"], cons: ["Créditos limitados no grátis", "Questões éticas de clonagem"], officialUrl: "https://elevenlabs.io", logoUrl: null, pricingType: "freemium", pricingFrom: 5, rating: 4.7, monthlyVisits: "25M", launchYear: 2022, company: "ElevenLabs", headquarters: "Nova York, EUA", isFeatured: true, isNew: false, metaTitle: "ElevenLabs: vozes com IA", metaDescription: "Como usar o ElevenLabs para síntese e clonagem de voz.", categoryId: 4, createdAt: daysAgo(50), updatedAt: daysAgo(11) },
  { id: 13, name: "Suno", slug: "suno", tagline: "Geração de músicas completas com IA.", description: "O **Suno** cria músicas completas com vocais a partir de uma descrição.", howToUse: "## Como usar\n\n1. Acesse suno.com\n2. Descreva o estilo\n3. Gere a música", pricing: "Freemium. Planos a partir de US$ 8/mês.", pros: ["Músicas completas", "Vocais realistas", "Fácil de usar"], cons: ["Direitos autorais incertos", "Créditos limitados"], officialUrl: "https://suno.com", logoUrl: null, pricingType: "freemium", pricingFrom: 8, rating: 4.5, monthlyVisits: "18M", launchYear: 2023, company: "Suno", headquarters: "Cambridge, EUA", isFeatured: false, isNew: true, metaTitle: "Suno: música com IA", metaDescription: "Guia do Suno para criar músicas com IA.", categoryId: 4, createdAt: daysAgo(28), updatedAt: daysAgo(2) },
  { id: 14, name: "GitHub Copilot", slug: "github-copilot", tagline: "Par de programação com IA.", description: "O **GitHub Copilot** sugere código em tempo real dentro do editor.", howToUse: "## Como usar\n\n1. Instale a extensão\n2. Faça login com GitHub\n3. Comece a digitar e aceite sugestões", pricing: "US$ 10/mês individual.", pros: ["Integrado ao editor", "Sugestões em tempo real", "Suporta várias linguagens", "Chat de código"], cons: ["Assinatura paga", "Sugestões nem sempre corretas"], officialUrl: "https://github.com/features/copilot", logoUrl: null, pricingType: "paid", pricingFrom: 10, rating: 4.6, monthlyVisits: "40M", launchYear: 2021, company: "GitHub / Microsoft", headquarters: "EUA", isFeatured: true, isNew: false, metaTitle: "GitHub Copilot: IA para programar", metaDescription: "Como usar o GitHub Copilot no seu editor.", categoryId: 5, createdAt: daysAgo(60), updatedAt: daysAgo(12) },
  { id: 15, name: "Cursor", slug: "cursor", tagline: "O editor de código nativo de IA.", description: "O **Cursor** é um editor (fork do VS Code) construído em torno de IA para escrever e editar código.", howToUse: "## Como usar\n\n1. Baixe o Cursor\n2. Abra seu projeto\n3. Use Cmd+K para editar com IA", pricing: "Freemium. Pro por US$ 20/mês.", pros: ["IA integrada ao editor", "Edição multi-arquivo", "Chat com codebase", "Rápido"], cons: ["Assinatura para uso pesado", "Baseado em VS Code"], officialUrl: "https://cursor.com", logoUrl: null, pricingType: "freemium", pricingFrom: 20, rating: 4.7, monthlyVisits: "22M", launchYear: 2023, company: "Anysphere", headquarters: "San Francisco, EUA", isFeatured: true, isNew: true, metaTitle: "Cursor: editor de código com IA", metaDescription: "Guia do Cursor, o editor nativo de IA.", categoryId: 5, createdAt: daysAgo(25), updatedAt: daysAgo(1) },
  { id: 16, name: "v0", slug: "v0", tagline: "Geração de UI com IA da Vercel.", description: "O **v0** da Vercel gera componentes e interfaces React a partir de prompts.", howToUse: "## Como usar\n\n1. Acesse v0.dev\n2. Descreva a interface\n3. Copie o código gerado", pricing: "Freemium baseado em créditos.", pros: ["Gera UI pronta", "Código React/Tailwind", "Integração Vercel"], cons: ["Baseado em créditos", "Foco em frontend"], officialUrl: "https://v0.dev", logoUrl: null, pricingType: "freemium", pricingFrom: 0, rating: 4.4, monthlyVisits: "8M", launchYear: 2023, company: "Vercel", headquarters: "San Francisco, EUA", isFeatured: false, isNew: true, metaTitle: "v0 da Vercel: UI com IA", metaDescription: "Como usar o v0 para gerar interfaces.", categoryId: 5, createdAt: daysAgo(22), updatedAt: daysAgo(3) },
  { id: 17, name: "OpenAI API", slug: "openai-api", tagline: "API dos modelos GPT da OpenAI.", description: "A **OpenAI API** dá acesso programático aos modelos GPT, embeddings, voz e imagem.", howToUse: "## Como usar\n\n1. Crie uma chave de API\n2. Instale o SDK\n3. Faça chamadas aos modelos", pricing: "Pague pelo uso (por token).", pros: ["Modelos de ponta", "Documentação rica", "SDKs oficiais", "Ampla adoção"], cons: ["Custo por uso", "Limites de taxa"], officialUrl: "https://platform.openai.com", logoUrl: null, pricingType: "paid", pricingFrom: 0, rating: 4.7, monthlyVisits: "35M", launchYear: 2020, company: "OpenAI", headquarters: "San Francisco, EUA", isFeatured: false, isNew: false, metaTitle: "OpenAI API: guia para desenvolvedores", metaDescription: "Como usar a API da OpenAI nos seus projetos.", categoryId: 6, createdAt: daysAgo(45), updatedAt: daysAgo(13) },
  { id: 18, name: "Anthropic API", slug: "anthropic-api", tagline: "API dos modelos Claude da Anthropic.", description: "A **Anthropic API** oferece acesso aos modelos Claude, com foco em contexto longo e segurança.", howToUse: "## Como usar\n\n1. Crie uma chave de API\n2. Instale o SDK\n3. Chame os modelos Claude", pricing: "Pague pelo uso (por token).", pros: ["Contexto longo", "Prompt caching", "Modelos seguros", "SDKs oficiais"], cons: ["Custo por uso", "Menos recursos que OpenAI"], officialUrl: "https://console.anthropic.com", logoUrl: null, pricingType: "paid", pricingFrom: 0, rating: 4.6, monthlyVisits: "15M", launchYear: 2023, company: "Anthropic", headquarters: "San Francisco, EUA", isFeatured: false, isNew: false, metaTitle: "Anthropic API: guia Claude para devs", metaDescription: "Como usar a API da Anthropic com os modelos Claude.", categoryId: 6, createdAt: daysAgo(42), updatedAt: daysAgo(14) },
];

export const news: Row[] = [
  { id: 1, title: "OpenAI lança novo modelo com raciocínio aprimorado", slug: "openai-lanca-novo-modelo-raciocinio", excerpt: "A OpenAI anunciou um modelo que melhora significativamente tarefas de raciocínio e matemática.", content: "## Novidade\n\nA OpenAI apresentou seu novo modelo com capacidades de raciocínio aprimoradas.\n\n## O que muda\n\nO modelo traz ganhos em matemática, programação e raciocínio lógico.\n\n## Disponibilidade\n\nDisponível para assinantes a partir desta semana.", coverImageUrl: null, category: "lancamento", metaTitle: "OpenAI lança novo modelo de raciocínio", metaDescription: "Detalhes do novo modelo da OpenAI com raciocínio aprimorado.", published: true, publishedAt: daysAgo(1), views: 1520, toolId: 1, createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  { id: 2, title: "Anthropic expande janela de contexto do Claude", slug: "anthropic-expande-contexto-claude", excerpt: "O Claude agora suporta janelas de contexto ainda maiores para documentos extensos.", content: "## Atualização\n\nA Anthropic aumentou a janela de contexto do Claude.\n\n## Impacto\n\nUsuários podem analisar documentos muito maiores em uma única conversa.", coverImageUrl: null, category: "atualizacao", metaTitle: "Claude com contexto expandido", metaDescription: "Anthropic amplia a janela de contexto do Claude.", published: true, publishedAt: daysAgo(2), views: 980, toolId: 2, createdAt: daysAgo(2), updatedAt: daysAgo(2) },
  { id: 3, title: "Google integra Gemini a mais produtos do Workspace", slug: "google-integra-gemini-workspace", excerpt: "O Gemini chega a novos apps do Google Workspace com recursos de produtividade.", content: "## Novidade\n\nO Google expandiu a integração do Gemini.\n\n## Recursos\n\nNovas funções de resumo, escrita e análise nos apps.", coverImageUrl: null, category: "atualizacao", metaTitle: "Gemini no Google Workspace", metaDescription: "Google integra Gemini a mais produtos.", published: true, publishedAt: daysAgo(3), views: 760, toolId: 3, createdAt: daysAgo(3), updatedAt: daysAgo(3) },
  { id: 4, title: "Midjourney anuncia melhorias em consistência de personagens", slug: "midjourney-consistencia-personagens", excerpt: "Nova versão melhora a consistência de personagens entre imagens.", content: "## Lançamento\n\nO Midjourney trouxe melhorias para manter personagens consistentes.\n\n## Como usar\n\nUtilize as novas referências de personagem nos prompts.", coverImageUrl: null, category: "lancamento", metaTitle: "Midjourney melhora consistência", metaDescription: "Midjourney anuncia consistência de personagens.", published: true, publishedAt: daysAgo(5), views: 640, toolId: 7, createdAt: daysAgo(5), updatedAt: daysAgo(5) },
  { id: 5, title: "Mercado de IA generativa deve dobrar até o próximo ano", slug: "mercado-ia-generativa-dobrar", excerpt: "Analistas projetam crescimento acelerado do mercado de IA generativa.", content: "## Mercado\n\nRelatórios apontam crescimento expressivo do setor.\n\n## Tendências\n\nEmpresas aceleram a adoção de IA em produtos e operações.", coverImageUrl: null, category: "mercado", metaTitle: "Mercado de IA generativa cresce", metaDescription: "Projeções de crescimento do mercado de IA.", published: true, publishedAt: daysAgo(7), views: 530, toolId: null, createdAt: daysAgo(7), updatedAt: daysAgo(7) },
  { id: 6, title: "Análise: vale a pena assinar o ChatGPT Plus em 2026?", slug: "analise-chatgpt-plus-vale-a-pena", excerpt: "Avaliamos os recursos do ChatGPT Plus para decidir se o investimento compensa.", content: "## Análise\n\nO ChatGPT Plus oferece acesso prioritário e recursos avançados.\n\n## Conclusão\n\nPara uso intenso, o plano se paga rapidamente.", coverImageUrl: null, category: "analise", metaTitle: "ChatGPT Plus vale a pena?", metaDescription: "Análise dos recursos e preço do ChatGPT Plus.", published: true, publishedAt: daysAgo(9), views: 410, toolId: 1, createdAt: daysAgo(9), updatedAt: daysAgo(9) },
];

export const tutorials: Row[] = [
  { id: 1, title: "Como escrever prompts melhores no ChatGPT", slug: "como-escrever-prompts-chatgpt", excerpt: "Técnicas práticas para obter respostas melhores do ChatGPT.", content: "## Introdução\n\nEscrever bons prompts é uma habilidade.\n\n## Seja específico\n\nDê contexto e exemplos.\n\n## Itere\n\nRefine a resposta conversando.", coverImageUrl: null, difficulty: "iniciante", readingTime: 6, metaTitle: "Como escrever prompts no ChatGPT", metaDescription: "Aprenda a escrever prompts eficazes no ChatGPT.", published: true, publishedAt: daysAgo(4), toolId: 1, createdAt: daysAgo(4), updatedAt: daysAgo(4) },
  { id: 2, title: "Primeiros passos com o Midjourney", slug: "primeiros-passos-midjourney", excerpt: "Um guia inicial para criar suas primeiras imagens no Midjourney.", content: "## Configuração\n\nEntre no Discord.\n\n## Primeiro comando\n\nUse /imagine com uma descrição.\n\n## Refinamento\n\nUse variações e upscale.", coverImageUrl: null, difficulty: "iniciante", readingTime: 8, metaTitle: "Primeiros passos no Midjourney", metaDescription: "Guia inicial para usar o Midjourney.", published: true, publishedAt: daysAgo(6), toolId: 7, createdAt: daysAgo(6), updatedAt: daysAgo(6) },
  { id: 3, title: "Usando o Claude para analisar documentos longos", slug: "claude-analisar-documentos", excerpt: "Aproveite a janela de contexto do Claude para analisar PDFs e relatórios.", content: "## Upload\n\nEnvie o documento.\n\n## Perguntas\n\nFaça perguntas específicas.\n\n## Resumos\n\nPeça resumos estruturados.", coverImageUrl: null, difficulty: "intermediario", readingTime: 7, metaTitle: "Analisar documentos com Claude", metaDescription: "Como usar o Claude para documentos longos.", published: true, publishedAt: daysAgo(8), toolId: 2, createdAt: daysAgo(8), updatedAt: daysAgo(8) },
  { id: 4, title: "Configurando o Cursor para máxima produtividade", slug: "configurando-cursor-produtividade", excerpt: "Dicas para configurar o Cursor e programar mais rápido com IA.", content: "## Instalação\n\nBaixe e importe configs do VS Code.\n\n## Atalhos\n\nDomine Cmd+K e Cmd+L.\n\n## Contexto\n\nIndexe seu codebase.", coverImageUrl: null, difficulty: "intermediario", readingTime: 9, metaTitle: "Configurar o Cursor", metaDescription: "Configure o Cursor para produtividade máxima.", published: true, publishedAt: daysAgo(10), toolId: 15, createdAt: daysAgo(10), updatedAt: daysAgo(10) },
  { id: 5, title: "Clonando sua voz com o ElevenLabs", slug: "clonando-voz-elevenlabs", excerpt: "Passo a passo para criar uma voz personalizada no ElevenLabs.", content: "## Amostras\n\nGrave amostras limpas.\n\n## Treinamento\n\nCrie a voz clonada.\n\n## Uso\n\nGere áudios com sua voz.", coverImageUrl: null, difficulty: "avancado", readingTime: 10, metaTitle: "Clonar voz no ElevenLabs", metaDescription: "Como clonar sua voz com o ElevenLabs.", published: true, publishedAt: daysAgo(12), toolId: 12, createdAt: daysAgo(12), updatedAt: daysAgo(12) },
];

export const comparisons: Row[] = [
  { id: 1, title: "ChatGPT vs Claude", slug: "chatgpt-vs-claude", excerpt: "Qual assistente de IA é melhor para você?", content: "## Visão geral\n\nAmbos são excelentes assistentes.\n\n## Diferenças\n\nO Claude tem contexto maior; o ChatGPT tem mais integrações.", coverImageUrl: null, verdict: "Para textos longos, Claude. Para ecossistema e plugins, ChatGPT.", tool1Name: "ChatGPT", tool2Name: "Claude", metaTitle: "ChatGPT vs Claude: comparativo", metaDescription: "Comparativo completo entre ChatGPT e Claude.", published: true, publishedAt: daysAgo(3), createdAt: daysAgo(3), updatedAt: daysAgo(3) },
  { id: 2, title: "Midjourney vs DALL-E", slug: "midjourney-vs-dall-e", excerpt: "Comparamos os dois principais geradores de imagem.", content: "## Qualidade\n\nMidjourney é mais artístico.\n\n## Facilidade\n\nDALL-E é mais acessível via ChatGPT.", coverImageUrl: null, verdict: "Midjourney para arte; DALL-E para conveniência.", tool1Name: "Midjourney", tool2Name: "DALL-E", metaTitle: "Midjourney vs DALL-E", metaDescription: "Comparativo entre Midjourney e DALL-E.", published: true, publishedAt: daysAgo(6), createdAt: daysAgo(6), updatedAt: daysAgo(6) },
  { id: 3, title: "Gemini vs ChatGPT", slug: "gemini-vs-chatgpt", excerpt: "A IA do Google contra a da OpenAI.", content: "## Integração\n\nGemini se integra ao Google.\n\n## Ecossistema\n\nChatGPT tem mais plugins.", coverImageUrl: null, verdict: "Gemini para usuários Google; ChatGPT para versatilidade.", tool1Name: "Gemini", tool2Name: "ChatGPT", metaTitle: "Gemini vs ChatGPT", metaDescription: "Comparativo entre Gemini e ChatGPT.", published: true, publishedAt: daysAgo(8), createdAt: daysAgo(8), updatedAt: daysAgo(8) },
  { id: 4, title: "Cursor vs GitHub Copilot", slug: "cursor-vs-github-copilot", excerpt: "Qual ferramenta de IA para código é melhor?", content: "## Abordagem\n\nCursor é um editor completo.\n\n## Integração\n\nCopilot funciona em vários editores.", coverImageUrl: null, verdict: "Cursor para imersão total; Copilot para flexibilidade.", tool1Name: "Cursor", tool2Name: "GitHub Copilot", metaTitle: "Cursor vs GitHub Copilot", metaDescription: "Comparativo entre Cursor e GitHub Copilot.", published: true, publishedAt: daysAgo(10), createdAt: daysAgo(10), updatedAt: daysAgo(10) },
  { id: 5, title: "Suno vs ElevenLabs", slug: "suno-vs-elevenlabs", excerpt: "Música versus voz: qual escolher?", content: "## Foco\n\nSuno cria músicas; ElevenLabs cria vozes.\n\n## Uso\n\nDepende do seu objetivo.", coverImageUrl: null, verdict: "Suno para música; ElevenLabs para narração.", tool1Name: "Suno", tool2Name: "ElevenLabs", metaTitle: "Suno vs ElevenLabs", metaDescription: "Comparativo entre Suno e ElevenLabs.", published: true, publishedAt: daysAgo(12), createdAt: daysAgo(12), updatedAt: daysAgo(12) },
];

export const rankings: Row[] = [
  { id: 1, title: "As 10 melhores IAs de texto em 2026", slug: "melhores-ias-texto-2026", excerpt: "Ranking das melhores ferramentas de IA para escrita e conversa.", content: "## Ranking\n\n1. ChatGPT\n2. Claude\n3. Gemini\n4. Perplexity", coverImageUrl: null, topic: "Texto", metaTitle: "Melhores IAs de texto 2026", metaDescription: "Ranking das melhores IAs de texto.", published: true, publishedAt: daysAgo(4), createdAt: daysAgo(4), updatedAt: daysAgo(4) },
  { id: 2, title: "Top 5 geradores de imagem com IA", slug: "top-geradores-imagem-ia", excerpt: "As melhores ferramentas para criar imagens com IA.", content: "## Ranking\n\n1. Midjourney\n2. DALL-E\n3. Stable Diffusion", coverImageUrl: null, topic: "Imagem", metaTitle: "Top geradores de imagem IA", metaDescription: "Ranking de geradores de imagem.", published: true, publishedAt: daysAgo(7), createdAt: daysAgo(7), updatedAt: daysAgo(7) },
  { id: 3, title: "Melhores ferramentas de IA para programadores", slug: "melhores-ias-programadores", excerpt: "As IAs que aumentam a produtividade de quem programa.", content: "## Ranking\n\n1. Cursor\n2. GitHub Copilot\n3. v0", coverImageUrl: null, topic: "Código", metaTitle: "Melhores IAs para programar", metaDescription: "Ranking de IAs para desenvolvedores.", published: true, publishedAt: daysAgo(9), createdAt: daysAgo(9), updatedAt: daysAgo(9) },
  { id: 4, title: "As melhores IAs de vídeo do momento", slug: "melhores-ias-video", excerpt: "Ferramentas de geração de vídeo que estão dominando.", content: "## Ranking\n\n1. Sora\n2. Runway\n3. Pika", coverImageUrl: null, topic: "Vídeo", metaTitle: "Melhores IAs de vídeo", metaDescription: "Ranking de IAs de vídeo.", published: true, publishedAt: daysAgo(11), createdAt: daysAgo(11), updatedAt: daysAgo(11) },
  { id: 5, title: "Top IAs de áudio e música", slug: "top-ias-audio-musica", excerpt: "As melhores ferramentas de IA para áudio.", content: "## Ranking\n\n1. ElevenLabs\n2. Suno", coverImageUrl: null, topic: "Áudio", metaTitle: "Top IAs de áudio", metaDescription: "Ranking de IAs de áudio e música.", published: true, publishedAt: daysAgo(13), createdAt: daysAgo(13), updatedAt: daysAgo(13) },
];

export const alternatives: Row[] = [
  { id: 1, title: "Melhores alternativas ao ChatGPT", slug: "alternativas-ao-chatgpt", excerpt: "Conheça opções para substituir ou complementar o ChatGPT.", content: "## Alternativas\n\n- Claude\n- Gemini\n- Perplexity", coverImageUrl: null, targetTool: "ChatGPT", metaTitle: "Alternativas ao ChatGPT", metaDescription: "As melhores alternativas ao ChatGPT.", published: true, publishedAt: daysAgo(5), createdAt: daysAgo(5), updatedAt: daysAgo(5) },
  { id: 2, title: "Alternativas ao Midjourney", slug: "alternativas-ao-midjourney", excerpt: "Outras ferramentas para gerar imagens com IA.", content: "## Alternativas\n\n- DALL-E\n- Stable Diffusion\n- Flux", coverImageUrl: null, targetTool: "Midjourney", metaTitle: "Alternativas ao Midjourney", metaDescription: "As melhores alternativas ao Midjourney.", published: true, publishedAt: daysAgo(8), createdAt: daysAgo(8), updatedAt: daysAgo(8) },
  { id: 3, title: "Alternativas ao GitHub Copilot", slug: "alternativas-ao-github-copilot", excerpt: "Outras IAs para ajudar a programar.", content: "## Alternativas\n\n- Cursor\n- Codeium", coverImageUrl: null, targetTool: "GitHub Copilot", metaTitle: "Alternativas ao GitHub Copilot", metaDescription: "As melhores alternativas ao GitHub Copilot.", published: true, publishedAt: daysAgo(10), createdAt: daysAgo(10), updatedAt: daysAgo(10) },
  { id: 4, title: "Alternativas ao Claude", slug: "alternativas-ao-claude", excerpt: "Assistentes que competem com o Claude.", content: "## Alternativas\n\n- ChatGPT\n- Gemini", coverImageUrl: null, targetTool: "Claude", metaTitle: "Alternativas ao Claude", metaDescription: "As melhores alternativas ao Claude.", published: true, publishedAt: daysAgo(12), createdAt: daysAgo(12), updatedAt: daysAgo(12) },
  { id: 5, title: "Alternativas ao ElevenLabs", slug: "alternativas-ao-elevenlabs", excerpt: "Outras ferramentas de voz com IA.", content: "## Alternativas\n\n- PlayHT\n- Murf", coverImageUrl: null, targetTool: "ElevenLabs", metaTitle: "Alternativas ao ElevenLabs", metaDescription: "As melhores alternativas ao ElevenLabs.", published: true, publishedAt: daysAgo(14), createdAt: daysAgo(14), updatedAt: daysAgo(14) },
];

export const prices: Row[] = [
  { id: 1, title: "Quanto custa o ChatGPT?", slug: "quanto-custa-chatgpt", content: "## Planos\n\n- Grátis: US$ 0\n- Plus: US$ 20/mês\n- Team: US$ 25/usuário", toolName: "ChatGPT", metaTitle: "Quanto custa o ChatGPT?", metaDescription: "Preços e planos do ChatGPT.", published: true, publishedAt: daysAgo(4), createdAt: daysAgo(4), updatedAt: daysAgo(4) },
  { id: 2, title: "Quanto custa o Midjourney?", slug: "quanto-custa-midjourney", content: "## Planos\n\n- Basic: US$ 10/mês\n- Standard: US$ 30/mês\n- Pro: US$ 60/mês", toolName: "Midjourney", metaTitle: "Quanto custa o Midjourney?", metaDescription: "Preços e planos do Midjourney.", published: true, publishedAt: daysAgo(7), createdAt: daysAgo(7), updatedAt: daysAgo(7) },
  { id: 3, title: "Quanto custa o Claude?", slug: "quanto-custa-claude", content: "## Planos\n\n- Grátis: US$ 0\n- Pro: US$ 20/mês\n- Team: US$ 25/usuário", toolName: "Claude", metaTitle: "Quanto custa o Claude?", metaDescription: "Preços e planos do Claude.", published: true, publishedAt: daysAgo(9), createdAt: daysAgo(9), updatedAt: daysAgo(9) },
  { id: 4, title: "Quanto custa o ElevenLabs?", slug: "quanto-custa-elevenlabs", content: "## Planos\n\n- Grátis: US$ 0\n- Starter: US$ 5/mês\n- Creator: US$ 22/mês", toolName: "ElevenLabs", metaTitle: "Quanto custa o ElevenLabs?", metaDescription: "Preços e planos do ElevenLabs.", published: true, publishedAt: daysAgo(11), createdAt: daysAgo(11), updatedAt: daysAgo(11) },
  { id: 5, title: "Quanto custa o GitHub Copilot?", slug: "quanto-custa-github-copilot", content: "## Planos\n\n- Individual: US$ 10/mês\n- Business: US$ 19/usuário", toolName: "GitHub Copilot", metaTitle: "Quanto custa o GitHub Copilot?", metaDescription: "Preços e planos do GitHub Copilot.", published: true, publishedAt: daysAgo(13), createdAt: daysAgo(13), updatedAt: daysAgo(13) },
];

export const prompts: Row[] = [
  { id: 1, title: "Resumir um artigo longo", slug: "resumir-artigo-longo", promptText: "Resuma o texto a seguir em 5 pontos principais, mantendo os dados mais importantes:\n\n[COLE O TEXTO AQUI]", description: "Prompt para resumir textos longos rapidamente.", category: "Produtividade", tags: ["resumo", "texto"], metaTitle: null, metaDescription: null, published: true, createdAt: daysAgo(10) },
  { id: 2, title: "Gerar ideias de conteúdo", slug: "gerar-ideias-conteudo", promptText: "Atue como estrategista de conteúdo. Gere 10 ideias de posts sobre [TEMA] para [PÚBLICO].", description: "Prompt para brainstorming de conteúdo.", category: "Marketing", tags: ["conteúdo", "ideias"], metaTitle: null, metaDescription: null, published: true, createdAt: daysAgo(9) },
  { id: 3, title: "Revisar código", slug: "revisar-codigo", promptText: "Revise o código a seguir apontando bugs, problemas de segurança e melhorias:\n\n```\n[COLE O CÓDIGO]\n```", description: "Prompt para revisão de código.", category: "Programação", tags: ["código", "revisão"], metaTitle: null, metaDescription: null, published: true, createdAt: daysAgo(8) },
  { id: 4, title: "Criar prompt de imagem", slug: "criar-prompt-imagem", promptText: "Crie um prompt detalhado em inglês para gerar uma imagem de [DESCRIÇÃO], incluindo estilo, iluminação e composição.", description: "Prompt para gerar prompts de imagem.", category: "Imagem", tags: ["imagem", "prompt"], metaTitle: null, metaDescription: null, published: true, createdAt: daysAgo(7) },
  { id: 5, title: "Escrever e-mail profissional", slug: "escrever-email-profissional", promptText: "Escreva um e-mail profissional e cordial sobre [ASSUNTO] para [DESTINATÁRIO], com tom [TOM].", description: "Prompt para redigir e-mails.", category: "Produtividade", tags: ["email", "escrita"], metaTitle: null, metaDescription: null, published: true, createdAt: daysAgo(6) },
  { id: 6, title: "Explicar conceito complexo", slug: "explicar-conceito-complexo", promptText: "Explique [CONCEITO] como se eu tivesse 12 anos, usando uma analogia do dia a dia.", description: "Prompt para explicações simples.", category: "Educação", tags: ["educação", "explicação"], metaTitle: null, metaDescription: null, published: true, createdAt: daysAgo(5) },
];

export const glossaryTerms: Row[] = [
  { id: 1, term: "LLM", slug: "llm", definition: "Large Language Model (Modelo de Linguagem de Grande Escala) é um modelo de IA treinado em enormes volumes de texto para entender e gerar linguagem natural.", relatedTerms: ["Transformer", "Token"], metaTitle: null, metaDescription: null, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  { id: 2, term: "Prompt", slug: "prompt", definition: "Prompt é a instrução ou pergunta enviada a um modelo de IA para obter uma resposta.", relatedTerms: ["Prompt Engineering", "Few-shot"], metaTitle: null, metaDescription: null, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  { id: 3, term: "Token", slug: "token", definition: "Token é a unidade básica de texto que um modelo processa, podendo ser uma palavra, parte de palavra ou caractere.", relatedTerms: ["Tokenização", "Context Window"], metaTitle: null, metaDescription: null, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  { id: 4, term: "RAG", slug: "rag", definition: "Retrieval-Augmented Generation combina busca de informações com geração de texto, permitindo respostas baseadas em dados externos.", relatedTerms: ["Embeddings", "Vector Database"], metaTitle: null, metaDescription: null, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  { id: 5, term: "Embeddings", slug: "embeddings", definition: "Embeddings são representações numéricas (vetores) de texto ou dados que capturam significado semântico.", relatedTerms: ["Vector Database", "Semantic Search"], metaTitle: null, metaDescription: null, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  { id: 6, term: "Fine-tuning", slug: "fine-tuning", definition: "Fine-tuning é o processo de ajustar um modelo pré-treinado com dados específicos para uma tarefa.", relatedTerms: ["Training", "LoRA"], metaTitle: null, metaDescription: null, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  { id: 7, term: "Transformer", slug: "transformer", definition: "Transformer é a arquitetura de rede neural baseada em atenção que sustenta os LLMs modernos.", relatedTerms: ["Attention", "LLM"], metaTitle: null, metaDescription: null, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  { id: 8, term: "Alucinação", slug: "alucinacao", definition: "Alucinação ocorre quando um modelo de IA gera informações falsas ou inventadas com aparência de verdade.", relatedTerms: ["LLM", "RAG"], metaTitle: null, metaDescription: null, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  { id: 9, term: "Temperature", slug: "temperature", definition: "Temperature é um parâmetro que controla a aleatoriedade das respostas de um modelo: valores baixos geram respostas mais determinísticas.", relatedTerms: ["Inference", "LLM"], metaTitle: null, metaDescription: null, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  { id: 10, term: "Chain-of-Thought", slug: "chain-of-thought", definition: "Chain-of-Thought é uma técnica em que o modelo raciocina passo a passo antes de dar a resposta final.", relatedTerms: ["Prompt Engineering", "LLM"], metaTitle: null, metaDescription: null, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  { id: 11, term: "Diffusion", slug: "diffusion", definition: "Modelos de difusão geram imagens removendo ruído de forma iterativa a partir de ruído aleatório.", relatedTerms: ["GAN", "Latent Space"], metaTitle: null, metaDescription: null, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  { id: 12, term: "RLHF", slug: "rlhf", definition: "Reinforcement Learning from Human Feedback é o treinamento de modelos usando feedback humano para alinhar respostas.", relatedTerms: ["Fine-tuning", "Reinforcement Learning"], metaTitle: null, metaDescription: null, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
];

export const newsletters: Row[] = [];

/* -------------------------------------------------------------------------- */
/*  Store + relations                                                         */
/* -------------------------------------------------------------------------- */

const store: Record<string, Row[]> = {
  category: categories,
  tool: tools,
  news,
  tutorial: tutorials,
  comparison: comparisons,
  ranking: rankings,
  alternative: alternatives,
  price: prices,
  prompt: prompts,
  glossaryTerm: glossaryTerms,
  newsletter: newsletters,
};

const relationResolvers: Record<string, Record<string, (row: Row) => unknown>> = {
  category: {
    tools: (row) => tools.filter((t) => t.categoryId === row.id),
  },
  tool: {
    category: (row) => categories.find((c) => c.id === row.categoryId) ?? null,
    news: (row) => news.filter((n) => n.toolId === row.id),
    tutorials: (row) => tutorials.filter((t) => t.toolId === row.id),
  },
  news: {
    tool: (row) => tools.find((t) => t.id === row.toolId) ?? null,
  },
  tutorial: {
    tool: (row) => tools.find((t) => t.id === row.toolId) ?? null,
  },
};

const relationModel: Record<string, Record<string, string>> = {
  category: { tools: "tool" },
  tool: { category: "category", news: "news", tutorials: "tutorial" },
  news: { tool: "tool" },
  tutorial: { tool: "tool" },
};

/* -------------------------------------------------------------------------- */
/*  Query engine                                                              */
/* -------------------------------------------------------------------------- */

function matchWhere(row: Row, where: any): boolean {
  if (!where) return true;
  for (const [key, cond] of Object.entries(where)) {
    if (key === "OR") {
      if (!(cond as any[]).some((c) => matchWhere(row, c))) return false;
      continue;
    }
    if (key === "AND") {
      if (!(cond as any[]).every((c) => matchWhere(row, c))) return false;
      continue;
    }
    if (key === "NOT") {
      if (matchWhere(row, cond)) return false;
      continue;
    }
    const value = row[key];
    if (cond !== null && typeof cond === "object" && !(cond instanceof Date)) {
      const c = cond as any;
      if ("equals" in c && value !== c.equals) return false;
      if ("not" in c && value === c.not) return false;
      if ("in" in c && !c.in.includes(value)) return false;
      if ("notIn" in c && c.notIn.includes(value)) return false;
      if ("contains" in c) {
        const hay = String(value ?? "").toLowerCase();
        if (!hay.includes(String(c.contains).toLowerCase())) return false;
      }
      if ("startsWith" in c && !String(value ?? "").startsWith(c.startsWith)) return false;
      if ("gt" in c && !(num(value) > num(c.gt))) return false;
      if ("gte" in c && !(num(value) >= num(c.gte))) return false;
      if ("lt" in c && !(num(value) < num(c.lt))) return false;
      if ("lte" in c && !(num(value) <= num(c.lte))) return false;
    } else if (value !== cond) {
      return false;
    }
  }
  return true;
}

function num(v: any): number {
  if (v instanceof Date) return v.getTime();
  if (typeof v === "string") {
    const d = Date.parse(v);
    if (!Number.isNaN(d)) return d;
  }
  return v as number;
}

function matchUnique(row: Row, where: any): boolean {
  for (const [key, value] of Object.entries(where || {})) {
    if (row[key] !== value) return false;
  }
  return true;
}

function applyOrderBy(rows: Row[], orderBy: any): Row[] {
  if (!orderBy) return rows;
  const orders = Array.isArray(orderBy) ? orderBy : [orderBy];
  return [...rows].sort((a, b) => {
    for (const o of orders) {
      const [field, dir] = Object.entries(o)[0] as [string, string];
      let av = a[field];
      let bv = b[field];
      if (av == null && bv == null) continue;
      if (av == null) return dir === "asc" ? -1 : 1;
      if (bv == null) return dir === "asc" ? 1 : -1;
      av = num(av);
      bv = num(bv);
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
    }
    return 0;
  });
}

function project(row: Row, model: string, args: any): Row {
  const include = args?.include;
  const select = args?.select;

  const resolvers = relationResolvers[model];

  if (select) {
    const out: Row = {};
    for (const [key, val] of Object.entries(select)) {
      if (!val) continue;
      if (key === "_count") {
        out._count = computeCount(row, model, val);
        continue;
      }
      if (resolvers && key in resolvers) {
        out[key] = resolveRelation(row, model, key, val);
      } else {
        out[key] = row[key];
      }
    }
    return out;
  }

  if (include) {
    const out: Row = { ...row };
    for (const [key, val] of Object.entries(include)) {
      if (!val) continue;
      if (key === "_count") {
        out._count = computeCount(row, model, val);
        continue;
      }
      if (resolvers && key in resolvers) {
        out[key] = resolveRelation(row, model, key, val);
      }
    }
    return out;
  }

  return { ...row };
}

function computeCount(row: Row, model: string, val: any): Row {
  const sel = (val && val.select) || {};
  const counts: Row = {};
  const resolvers = relationResolvers[model];
  for (const rel of Object.keys(sel)) {
    const resolver = resolvers ? resolvers[rel] : undefined;
    counts[rel] = resolver ? (resolver(row) as unknown[]).length : 0;
  }
  return counts;
}

function resolveRelation(row: Row, model: string, rel: string, val: any): unknown {
  const resolver = relationResolvers[model][rel];
  let related = resolver(row);
  const childModel = relationModel[model]?.[rel];
  const childArgs = val && typeof val === "object" ? val : undefined;
  if (childArgs && childModel) {
    if (Array.isArray(related)) {
      let rows = related as Row[];
      if (childArgs.where) rows = rows.filter((r) => matchWhere(r, childArgs.where));
      if (childArgs.orderBy) rows = applyOrderBy(rows, childArgs.orderBy);
      if (typeof childArgs.take === "number") rows = rows.slice(0, childArgs.take);
      related = rows.map((r) => project(r, childModel, childArgs));
    } else if (related) {
      related = project(related as Row, childModel, childArgs);
    }
  }
  return related;
}

function nextId(data: Row[]): number {
  return data.reduce((max, r) => Math.max(max, r.id ?? 0), 0) + 1;
}

function applyUpdateData(row: Row, data: Row): void {
  for (const [key, val] of Object.entries(data)) {
    if (val !== null && typeof val === "object" && !(val instanceof Date) && !Array.isArray(val)) {
      const v = val as any;
      if ("increment" in v) row[key] = (row[key] ?? 0) + v.increment;
      else if ("decrement" in v) row[key] = (row[key] ?? 0) - v.decrement;
      else if ("set" in v) row[key] = v.set;
      else row[key] = val;
    } else {
      row[key] = val;
    }
  }
}

function makeModel(model: string) {
  const data = store[model];
  return {
    findMany: async (args: any = {}) => {
      let rows = data.filter((r) => matchWhere(r, args.where));
      rows = applyOrderBy(rows, args.orderBy);
      if (typeof args.skip === "number") rows = rows.slice(args.skip);
      if (typeof args.take === "number") rows = rows.slice(0, args.take);
      return rows.map((r) => project(r, model, args));
    },
    findUnique: async (args: any = {}) => {
      const row = data.find((r) => matchUnique(r, args.where));
      return row ? project(row, model, args) : null;
    },
    findFirst: async (args: any = {}) => {
      let rows = data.filter((r) => matchWhere(r, args.where));
      rows = applyOrderBy(rows, args.orderBy);
      const row = rows[0];
      return row ? project(row, model, args) : null;
    },
    count: async (args: any = {}) =>
      data.filter((r) => matchWhere(r, args.where)).length,
    create: async (args: any) => {
      const row: Row = {
        id: nextId(data),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...args.data,
      };
      data.push(row);
      return project(row, model, args);
    },
    update: async (args: any) => {
      const row = data.find((r) => matchUnique(r, args.where));
      if (!row) throw new Error(`[mock] ${model} record not found`);
      applyUpdateData(row, args.data);
      row.updatedAt = new Date();
      return project(row, model, args);
    },
    upsert: async (args: any) => {
      const row = data.find((r) => matchUnique(r, args.where));
      if (row) {
        applyUpdateData(row, args.update);
        row.updatedAt = new Date();
        return project(row, model, args);
      }
      const created: Row = {
        id: nextId(data),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...args.create,
      };
      data.push(created);
      return project(created, model, args);
    },
    delete: async (args: any) => {
      const idx = data.findIndex((r) => matchUnique(r, args.where));
      if (idx === -1) throw new Error(`[mock] ${model} record not found`);
      const [row] = data.splice(idx, 1);
      return row;
    },
    deleteMany: async (args: any = {}) => {
      const before = data.length;
      const kept = data.filter((r) => !matchWhere(r, args.where));
      data.length = 0;
      data.push(...kept);
      return { count: before - data.length };
    },
  };
}

export const mockPrisma = {
  category: makeModel("category"),
  tool: makeModel("tool"),
  news: makeModel("news"),
  tutorial: makeModel("tutorial"),
  comparison: makeModel("comparison"),
  ranking: makeModel("ranking"),
  alternative: makeModel("alternative"),
  price: makeModel("price"),
  prompt: makeModel("prompt"),
  glossaryTerm: makeModel("glossaryTerm"),
  newsletter: makeModel("newsletter"),
  $connect: async () => {},
  $disconnect: async () => {},
};
