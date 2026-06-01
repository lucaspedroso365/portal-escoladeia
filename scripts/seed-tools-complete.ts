import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Pricing = "free" | "freemium" | "paid";

interface Seed {
  slug: string;
  name: string;
  tagline: string;
  cat: "texto" | "imagem" | "video" | "audio" | "codigo" | "apis" | "plugins";
  pricingType: Pricing;
  url: string;
  featured?: boolean;
  isNew?: boolean;
}

/* -------------------------------------------------------------------------- */
/*  117 ferramentas — dados estáticos. description vazio (gerado depois).     */
/* -------------------------------------------------------------------------- */

const TOOLS: Seed[] = [
  // ===== TEXTO (33) =====
  { slug: "chatgpt", name: "ChatGPT", tagline: "O assistente conversacional da OpenAI.", cat: "texto", pricingType: "freemium", url: "https://chat.openai.com", featured: true },
  { slug: "claude", name: "Claude", tagline: "IA da Anthropic com janela de contexto enorme.", cat: "texto", pricingType: "freemium", url: "https://claude.ai", featured: true },
  { slug: "gemini", name: "Gemini", tagline: "A IA multimodal do Google.", cat: "texto", pricingType: "freemium", url: "https://gemini.google.com", featured: true },
  { slug: "grok", name: "Grok", tagline: "Assistente da xAI integrado ao X.", cat: "texto", pricingType: "paid", url: "https://x.ai", isNew: true },
  { slug: "perplexity", name: "Perplexity", tagline: "Motor de busca com IA que cita fontes em tempo real.", cat: "texto", pricingType: "freemium", url: "https://perplexity.ai", featured: true },
  { slug: "copilot", name: "Microsoft Copilot", tagline: "O copiloto de IA da Microsoft integrado ao Windows e 365.", cat: "texto", pricingType: "freemium", url: "https://copilot.microsoft.com" },
  { slug: "mistral", name: "Mistral", tagline: "Modelos abertos e eficientes da Mistral AI.", cat: "texto", pricingType: "freemium", url: "https://mistral.ai" },
  { slug: "llama", name: "Llama", tagline: "Família de modelos abertos da Meta.", cat: "texto", pricingType: "free", url: "https://llama.meta.com", isNew: true },
  { slug: "deepseek", name: "DeepSeek", tagline: "Modelos abertos de alta performance e baixo custo.", cat: "texto", pricingType: "freemium", url: "https://deepseek.com", isNew: true },
  { slug: "qwen", name: "Qwen", tagline: "Família multilíngue de modelos da Alibaba.", cat: "texto", pricingType: "freemium", url: "https://tongyi.aliyun.com", isNew: true },
  { slug: "command-r", name: "Command R", tagline: "Família de LLMs da Cohere otimizada para RAG.", cat: "texto", pricingType: "paid", url: "https://cohere.com/command" },
  { slug: "pi", name: "Pi", tagline: "Assistente pessoal e empático da Inflection AI.", cat: "texto", pricingType: "free", url: "https://pi.ai" },
  { slug: "you", name: "You.com", tagline: "Busca conversacional com IA personalizável.", cat: "texto", pricingType: "freemium", url: "https://you.com" },
  { slug: "phind", name: "Phind", tagline: "Mecanismo de busca com IA focado em devs.", cat: "texto", pricingType: "freemium", url: "https://phind.com" },
  { slug: "poe", name: "Poe", tagline: "Acesse vários LLMs em uma só interface (Quora).", cat: "texto", pricingType: "freemium", url: "https://poe.com" },
  { slug: "character-ai", name: "Character.AI", tagline: "Crie e converse com personagens de IA.", cat: "texto", pricingType: "freemium", url: "https://character.ai" },
  { slug: "jasper", name: "Jasper", tagline: "Plataforma de geração de copy para marketing.", cat: "texto", pricingType: "paid", url: "https://jasper.ai" },
  { slug: "writesonic", name: "Writesonic", tagline: "Suite de IA para escrita, SEO e chatbots.", cat: "texto", pricingType: "freemium", url: "https://writesonic.com" },
  { slug: "copy-ai", name: "Copy.ai", tagline: "Automação de conteúdo e vendas com IA.", cat: "texto", pricingType: "freemium", url: "https://copy.ai" },
  { slug: "notion-ai", name: "Notion AI", tagline: "Assistente de IA dentro do seu workspace Notion.", cat: "texto", pricingType: "paid", url: "https://www.notion.so/product/ai" },
  { slug: "otter-ai", name: "Otter.ai", tagline: "Transcrição e notas de reuniões com IA.", cat: "texto", pricingType: "freemium", url: "https://otter.ai" },
  { slug: "openai-playground", name: "OpenAI Playground", tagline: "Ambiente para testar os modelos da OpenAI.", cat: "texto", pricingType: "paid", url: "https://platform.openai.com/playground" },
  { slug: "hugging-chat", name: "HuggingChat", tagline: "Chat gratuito com modelos abertos da Hugging Face.", cat: "texto", pricingType: "free", url: "https://huggingface.co/chat" },
  { slug: "together-ai", name: "Together AI", tagline: "Plataforma para rodar e ajustar modelos abertos.", cat: "texto", pricingType: "freemium", url: "https://together.ai" },
  { slug: "groq", name: "Groq", tagline: "Inferência ultrarrápida de LLMs em LPU dedicada.", cat: "texto", pricingType: "freemium", url: "https://groq.com", isNew: true },
  { slug: "fireworks-ai", name: "Fireworks AI", tagline: "Inferência rápida e barata de modelos abertos.", cat: "texto", pricingType: "freemium", url: "https://fireworks.ai" },
  { slug: "ai21", name: "AI21 Labs", tagline: "Modelos Jurassic e Jamba para uso empresarial.", cat: "texto", pricingType: "paid", url: "https://ai21.com" },
  { slug: "openrouter", name: "OpenRouter", tagline: "Acesse dezenas de LLMs com uma única API.", cat: "texto", pricingType: "paid", url: "https://openrouter.ai" },
  { slug: "lmsys", name: "LMSYS Chatbot Arena", tagline: "Compare LLMs lado a lado e veja o ranking.", cat: "texto", pricingType: "free", url: "https://chat.lmsys.org" },
  { slug: "nous-hermes", name: "Nous Hermes", tagline: "Modelos abertos refinados pela Nous Research.", cat: "texto", pricingType: "free", url: "https://nousresearch.com" },
  { slug: "inflection-ai", name: "Inflection AI", tagline: "Empresa por trás do assistente Pi.", cat: "texto", pricingType: "free", url: "https://inflection.ai" },
  { slug: "dolphin", name: "Dolphin", tagline: "Linhagem de modelos abertos sem censura.", cat: "texto", pricingType: "free", url: "https://huggingface.co/cognitivecomputations" },
  { slug: "coral", name: "Coral", tagline: "Assistente conversacional empresarial da Cohere.", cat: "texto", pricingType: "paid", url: "https://cohere.com/coral" },

  // ===== IMAGEM (22) =====
  { slug: "midjourney", name: "Midjourney", tagline: "Referência em geração de imagens artísticas.", cat: "imagem", pricingType: "paid", url: "https://midjourney.com", featured: true },
  { slug: "dall-e", name: "DALL·E", tagline: "Gerador de imagens da OpenAI integrado ao ChatGPT.", cat: "imagem", pricingType: "paid", url: "https://openai.com/dall-e" },
  { slug: "stable-diffusion", name: "Stable Diffusion", tagline: "Modelo aberto de geração de imagens.", cat: "imagem", pricingType: "free", url: "https://stability.ai" },
  { slug: "firefly", name: "Firefly", tagline: "Família de modelos generativos da Adobe.", cat: "imagem", pricingType: "freemium", url: "https://firefly.adobe.com" },
  { slug: "imagen", name: "Imagen", tagline: "Gerador de imagens da Google DeepMind.", cat: "imagem", pricingType: "paid", url: "https://deepmind.google/technologies/imagen" },
  { slug: "flux", name: "Flux", tagline: "Geração de imagens de alta fidelidade da Black Forest Labs.", cat: "imagem", pricingType: "freemium", url: "https://blackforestlabs.ai", isNew: true },
  { slug: "ideogram", name: "Ideogram", tagline: "Geração de imagens com tipografia precisa.", cat: "imagem", pricingType: "freemium", url: "https://ideogram.ai", isNew: true },
  { slug: "leonardo-ai", name: "Leonardo.AI", tagline: "Plataforma criativa de imagens e game assets.", cat: "imagem", pricingType: "freemium", url: "https://leonardo.ai" },
  { slug: "playground-ai", name: "Playground AI", tagline: "Editor de imagens com IA e modelos próprios.", cat: "imagem", pricingType: "freemium", url: "https://playground.com" },
  { slug: "blue-willow", name: "BlueWillow", tagline: "Gerador de imagens gratuito via Discord.", cat: "imagem", pricingType: "free", url: "https://bluewillow.ai" },
  { slug: "nightcafe", name: "NightCafe", tagline: "Comunidade e gerador de arte com IA.", cat: "imagem", pricingType: "freemium", url: "https://nightcafe.studio" },
  { slug: "dream-by-wombo", name: "Dream by Wombo", tagline: "App popular de arte gerada por IA.", cat: "imagem", pricingType: "freemium", url: "https://dream.ai" },
  { slug: "canva-ai", name: "Canva AI (Magic Studio)", tagline: "Recursos de IA generativa do Canva.", cat: "imagem", pricingType: "freemium", url: "https://canva.com" },
  { slug: "adobe-express-ai", name: "Adobe Express AI", tagline: "Design rápido com IA generativa.", cat: "imagem", pricingType: "freemium", url: "https://www.adobe.com/express" },
  { slug: "bing-image-creator", name: "Bing Image Creator", tagline: "Geração de imagens gratuita pela Microsoft.", cat: "imagem", pricingType: "free", url: "https://www.bing.com/create" },
  { slug: "getimg-ai", name: "getimg.ai", tagline: "Suite de geração e edição de imagens.", cat: "imagem", pricingType: "freemium", url: "https://getimg.ai" },
  { slug: "seaart", name: "SeaArt", tagline: "Geração de imagens estilo anime e mais.", cat: "imagem", pricingType: "freemium", url: "https://seaart.ai" },
  { slug: "krea-ai", name: "Krea AI", tagline: "Geração e edição de imagens em tempo real.", cat: "imagem", pricingType: "freemium", url: "https://krea.ai", isNew: true },
  { slug: "magnific", name: "Magnific", tagline: "Upscaler de imagens que reimagina detalhes.", cat: "imagem", pricingType: "paid", url: "https://magnific.ai", isNew: true },
  { slug: "clipdrop", name: "Clipdrop", tagline: "Ferramentas de edição com IA da Stability.", cat: "imagem", pricingType: "freemium", url: "https://clipdrop.co" },
  { slug: "fooocus", name: "Fooocus", tagline: "Interface aberta para Stable Diffusion XL.", cat: "imagem", pricingType: "free", url: "https://github.com/lllyasviel/Fooocus" },
  { slug: "adobe-firefly", name: "Adobe Firefly Web", tagline: "App web do Firefly com geração e edição.", cat: "imagem", pricingType: "freemium", url: "https://firefly.adobe.com" },

  // ===== VIDEO (16) =====
  { slug: "sora", name: "Sora", tagline: "Geração de vídeo realista da OpenAI.", cat: "video", pricingType: "paid", url: "https://openai.com/sora", featured: true, isNew: true },
  { slug: "runway", name: "Runway", tagline: "Suite completa de criação de vídeo com IA.", cat: "video", pricingType: "freemium", url: "https://runwayml.com", featured: true },
  { slug: "pika", name: "Pika", tagline: "Geração de vídeo a partir de texto e imagem.", cat: "video", pricingType: "freemium", url: "https://pika.art", isNew: true },
  { slug: "kling", name: "Kling", tagline: "Geração de vídeo realista da Kuaishou.", cat: "video", pricingType: "freemium", url: "https://klingai.com", isNew: true },
  { slug: "hailuo", name: "Hailuo AI", tagline: "Gerador de vídeo do MiniMax (Hailuo).", cat: "video", pricingType: "freemium", url: "https://hailuoai.com", isNew: true },
  { slug: "luma-dream-machine", name: "Luma Dream Machine", tagline: "Geração de vídeo cinematográfico da Luma.", cat: "video", pricingType: "freemium", url: "https://lumalabs.ai/dream-machine", isNew: true },
  { slug: "stable-video", name: "Stable Video Diffusion", tagline: "Vídeo gerado pelo modelo aberto da Stability.", cat: "video", pricingType: "free", url: "https://stability.ai/stable-video" },
  { slug: "invideo-ai", name: "InVideo AI", tagline: "Geração de vídeos completos a partir de um prompt.", cat: "video", pricingType: "freemium", url: "https://invideo.io/ai" },
  { slug: "synthesia", name: "Synthesia", tagline: "Vídeos com avatares de IA realistas.", cat: "video", pricingType: "paid", url: "https://synthesia.io" },
  { slug: "heygen", name: "HeyGen", tagline: "Avatares e dublagem de vídeo com IA.", cat: "video", pricingType: "freemium", url: "https://heygen.com" },
  { slug: "d-id", name: "D-ID", tagline: "Anime fotos e crie avatares falantes.", cat: "video", pricingType: "freemium", url: "https://d-id.com" },
  { slug: "opus-clip", name: "Opus Clip", tagline: "Transforma vídeos longos em clipes virais.", cat: "video", pricingType: "freemium", url: "https://opus.pro" },
  { slug: "descript", name: "Descript", tagline: "Editor de vídeo e áudio guiado por transcrição.", cat: "video", pricingType: "freemium", url: "https://descript.com" },
  { slug: "captions-ai", name: "Captions", tagline: "Edição de vídeo com legendas automáticas.", cat: "video", pricingType: "freemium", url: "https://captions.ai" },
  { slug: "gen2", name: "Runway Gen-2", tagline: "Modelo de vídeo da Runway (Gen-2/Gen-3).", cat: "video", pricingType: "paid", url: "https://runwayml.com/research/gen-2" },
  { slug: "pixverse", name: "PixVerse", tagline: "Geração rápida de vídeo a partir de texto.", cat: "video", pricingType: "freemium", url: "https://pixverse.ai", isNew: true },

  // ===== AUDIO (14) =====
  { slug: "elevenlabs", name: "ElevenLabs", tagline: "Vozes hiper-realistas e clonagem de voz.", cat: "audio", pricingType: "freemium", url: "https://elevenlabs.io", featured: true },
  { slug: "suno", name: "Suno", tagline: "Músicas completas com vocais geradas por IA.", cat: "audio", pricingType: "freemium", url: "https://suno.com", isNew: true },
  { slug: "udio", name: "Udio", tagline: "Geração de música por IA com qualidade de estúdio.", cat: "audio", pricingType: "freemium", url: "https://udio.com", isNew: true },
  { slug: "mubert", name: "Mubert", tagline: "Trilhas e jingles gerados por IA royalty-free.", cat: "audio", pricingType: "freemium", url: "https://mubert.com" },
  { slug: "soundraw", name: "Soundraw", tagline: "Criação personalizada de música com IA.", cat: "audio", pricingType: "paid", url: "https://soundraw.io" },
  { slug: "aiva", name: "AIVA", tagline: "Composição de trilhas sonoras com IA.", cat: "audio", pricingType: "freemium", url: "https://aiva.ai" },
  { slug: "boomy", name: "Boomy", tagline: "Faça e publique músicas com IA em segundos.", cat: "audio", pricingType: "freemium", url: "https://boomy.com" },
  { slug: "voicemod", name: "Voicemod", tagline: "Modulador e clonador de voz em tempo real.", cat: "audio", pricingType: "freemium", url: "https://voicemod.net" },
  { slug: "resemble-ai", name: "Resemble AI", tagline: "Clonagem de voz e geração de fala expressiva.", cat: "audio", pricingType: "paid", url: "https://resemble.ai" },
  { slug: "play-ht", name: "PlayHT", tagline: "Síntese de voz com mais de 800 vozes.", cat: "audio", pricingType: "freemium", url: "https://play.ht" },
  { slug: "murf-ai", name: "Murf AI", tagline: "Voice-over profissional com IA.", cat: "audio", pricingType: "freemium", url: "https://murf.ai" },
  { slug: "speechify", name: "Speechify", tagline: "Texto-para-fala para acessibilidade e estudo.", cat: "audio", pricingType: "freemium", url: "https://speechify.com" },
  { slug: "adobe-podcast", name: "Adobe Podcast", tagline: "Melhoria de áudio e gravação assistida por IA.", cat: "audio", pricingType: "freemium", url: "https://podcast.adobe.com" },
  { slug: "cleanvoice", name: "Cleanvoice AI", tagline: "Remove ruídos e bocejos de podcasts.", cat: "audio", pricingType: "paid", url: "https://cleanvoice.ai" },

  // ===== CODIGO (12) =====
  { slug: "github-copilot", name: "GitHub Copilot", tagline: "Par de programação com IA no seu editor.", cat: "codigo", pricingType: "paid", url: "https://github.com/features/copilot", featured: true },
  { slug: "cursor", name: "Cursor", tagline: "Editor de código nativo de IA (fork do VS Code).", cat: "codigo", pricingType: "freemium", url: "https://cursor.com", featured: true, isNew: true },
  { slug: "replit", name: "Replit", tagline: "IDE no navegador com agente de IA integrado.", cat: "codigo", pricingType: "freemium", url: "https://replit.com" },
  { slug: "codeium", name: "Codeium", tagline: "Autocomplete e chat de código gratuito para devs.", cat: "codigo", pricingType: "freemium", url: "https://codeium.com" },
  { slug: "tabnine", name: "Tabnine", tagline: "Assistente de código com foco em privacidade.", cat: "codigo", pricingType: "freemium", url: "https://tabnine.com" },
  { slug: "amazon-codewhisperer", name: "Amazon CodeWhisperer", tagline: "Assistente de código da AWS (Q Developer).", cat: "codigo", pricingType: "freemium", url: "https://aws.amazon.com/q/developer" },
  { slug: "sourcegraph-cody", name: "Sourcegraph Cody", tagline: "IA que entende toda a base de código.", cat: "codigo", pricingType: "freemium", url: "https://sourcegraph.com/cody" },
  { slug: "supermaven", name: "Supermaven", tagline: "Autocomplete ultrarrápido com 1M de contexto.", cat: "codigo", pricingType: "freemium", url: "https://supermaven.com", isNew: true },
  { slug: "continue", name: "Continue", tagline: "Assistente de código open-source para VS Code/JetBrains.", cat: "codigo", pricingType: "free", url: "https://continue.dev" },
  { slug: "windsurf", name: "Windsurf", tagline: "IDE com agente Cascade da Codeium.", cat: "codigo", pricingType: "freemium", url: "https://codeium.com/windsurf", isNew: true },
  { slug: "v0", name: "v0", tagline: "Geração de UI React/Tailwind da Vercel.", cat: "codigo", pricingType: "freemium", url: "https://v0.dev", isNew: true },
  { slug: "bolt", name: "Bolt.new", tagline: "Crie e edite apps full-stack no navegador.", cat: "codigo", pricingType: "freemium", url: "https://bolt.new", isNew: true },

  // ===== APIS (10) =====
  { slug: "openai-api", name: "OpenAI API", tagline: "Acesso programático aos modelos GPT.", cat: "apis", pricingType: "paid", url: "https://platform.openai.com" },
  { slug: "anthropic-api", name: "Anthropic API", tagline: "API dos modelos Claude com contexto longo.", cat: "apis", pricingType: "paid", url: "https://console.anthropic.com" },
  { slug: "google-ai-studio", name: "Google AI Studio", tagline: "Plataforma para testar e usar a API Gemini.", cat: "apis", pricingType: "freemium", url: "https://aistudio.google.com" },
  { slug: "groq-api", name: "Groq API", tagline: "API de inferência ultrarrápida em LPU.", cat: "apis", pricingType: "freemium", url: "https://console.groq.com" },
  { slug: "hugging-face-api", name: "Hugging Face Inference", tagline: "API para milhares de modelos abertos.", cat: "apis", pricingType: "freemium", url: "https://huggingface.co/inference-api" },
  { slug: "replicate", name: "Replicate", tagline: "Rode modelos de IA em uma única API.", cat: "apis", pricingType: "paid", url: "https://replicate.com" },
  { slug: "cohere-api", name: "Cohere API", tagline: "API enterprise com Command R e embeddings.", cat: "apis", pricingType: "paid", url: "https://cohere.com" },
  { slug: "stability-ai-api", name: "Stability AI API", tagline: "API dos modelos Stable Diffusion e mais.", cat: "apis", pricingType: "paid", url: "https://platform.stability.ai" },
  { slug: "together-ai-api", name: "Together AI API", tagline: "Inferência e fine-tuning de modelos abertos.", cat: "apis", pricingType: "paid", url: "https://together.ai" },
  { slug: "fireworks-api", name: "Fireworks API", tagline: "API otimizada para modelos abertos em produção.", cat: "apis", pricingType: "paid", url: "https://fireworks.ai" },

  // ===== PLUGINS (10) =====
  { slug: "chatgpt-plugins", name: "ChatGPT Plugins / GPTs", tagline: "Extensões e GPTs personalizados no ChatGPT.", cat: "plugins", pricingType: "paid", url: "https://openai.com/blog/chatgpt-plugins" },
  { slug: "merlin", name: "Merlin", tagline: "Assistente de IA em qualquer site (extensão).", cat: "plugins", pricingType: "freemium", url: "https://getmerlin.in" },
  { slug: "sider", name: "Sider", tagline: "Sidebar com vários LLMs no navegador.", cat: "plugins", pricingType: "freemium", url: "https://sider.ai" },
  { slug: "monica-ai", name: "Monica AI", tagline: "Copiloto de IA tudo-em-um para o navegador.", cat: "plugins", pricingType: "freemium", url: "https://monica.im" },
  { slug: "maxai", name: "MaxAI", tagline: "Atalho global para perguntar a IA em qualquer lugar.", cat: "plugins", pricingType: "freemium", url: "https://maxai.me" },
  { slug: "superpower-chatgpt", name: "Superpower ChatGPT", tagline: "Extensão que adiciona super poderes ao ChatGPT.", cat: "plugins", pricingType: "freemium", url: "https://chromewebstore.google.com/detail/superpower-chatgpt" },
  { slug: "wiseone", name: "Wiseone", tagline: "Assistente de leitura que enriquece páginas.", cat: "plugins", pricingType: "freemium", url: "https://wiseone.io" },
  { slug: "harpa-ai", name: "Harpa AI", tagline: "Automação web e agentes no navegador.", cat: "plugins", pricingType: "freemium", url: "https://harpa.ai" },
  { slug: "wordtune", name: "Wordtune", tagline: "Reescreve frases e melhora sua escrita.", cat: "plugins", pricingType: "freemium", url: "https://wordtune.com" },
  { slug: "grammarly", name: "Grammarly", tagline: "Correção gramatical e sugestões com IA.", cat: "plugins", pricingType: "freemium", url: "https://grammarly.com" },
];

/* -------------------------------------------------------------------------- */
/*  Run                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  console.log(`Total na lista: ${TOOLS.length} ferramentas`);

  const categories = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const catIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));

  const missingCats = new Set(
    TOOLS.map((t) => t.cat).filter((slug) => !catIdBySlug.has(slug))
  );
  if (missingCats.size) {
    console.error(`❌ Categorias ausentes no banco: ${[...missingCats].join(", ")}.`);
    console.error("   Rode 'npm run seed' antes para criar as categorias.");
    process.exit(1);
  }

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (let i = 0; i < TOOLS.length; i++) {
    const t = TOOLS[i];
    const categoryId = catIdBySlug.get(t.cat)!;
    const baseData = {
      name: t.name,
      tagline: t.tagline,
      categoryId,
      officialUrl: t.url,
      pricingType: t.pricingType,
      isFeatured: !!t.featured,
      isNew: !!t.isNew,
    };
    try {
      const existing = await prisma.tool.findUnique({ where: { slug: t.slug } });
      if (existing) {
        // Update only the basic metadata; preserve description/howToUse/pricing/pros/cons
        await prisma.tool.update({ where: { slug: t.slug }, data: baseData });
        updated++;
        console.log(`[${i + 1}/${TOOLS.length}] ${t.name} — atualizado`);
      } else {
        await prisma.tool.create({
          data: { ...baseData, slug: t.slug, description: "" },
        });
        created++;
        console.log(`[${i + 1}/${TOOLS.length}] ${t.name} — criado`);
      }
    } catch (e) {
      failed++;
      console.error(`[${i + 1}/${TOOLS.length}] ${t.name} — ERRO: ${(e as Error).message}`);
    }
  }

  console.log("");
  console.log(`✅ Concluído. Criadas: ${created}  Atualizadas: ${updated}  Falhas: ${failed}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
