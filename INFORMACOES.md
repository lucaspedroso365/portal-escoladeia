# Escola de IA — Diário do Projeto

Documento de bordo (PT-BR) de tudo que foi construído, decisões tomadas e o que falta. Mantenha atualizado.

URL: https://escoladevideosia.com.br
Repo: https://github.com/lucaspedroso365/portal-escoladeia (público)

---

## 1. Estado atual do banco

| Tabela | Itens | Observações |
| --- | ---: | --- |
| Tool | 118 | Todas com `description`, `howToUse`, `pricing`, `pros[5]`, `cons[5]`, `metaTitle`, `metaDescription`. |
| Tutorial | 793 | Distribuição: 1 tool com 2 · 35 com 5 · 13 com 6 · 27 com 7 · 29 com 8 · 13 com 9. |
| News | 800 | Distribuição: 1 com 2 · 41 com 5 · 9 com 6 · 15 com 7 · 36 com 8 · 16 com 9. |
| Prompt | 596 | 118 ferramentas × 5 + 6 do seed inicial. **Todas as ferramentas com 5+ ✓**. |
| Comparison | 40 | **Meta atingida (40/40).** |
| Ranking | 11 | 7/10 da lista + 4 do seed. **3 ainda travados em "Failed to parse JSON".** |
| **Sitemap** | **1.833 URLs** | https://escoladevideosia.com.br/sitemap.xml |

Pendências reais para 5/ferramenta: **1 tutorial · 1 notícia · 3 rankings**. Todos travados por JSON malformado do fallback `gemini-2.5-flash-lite`.

---

## 2. Infraestrutura

### VPS
- **Host:** AlmaLinux 9 + CyberPanel 2.4 + OpenLiteSpeed + MariaDB 10.11 + Node 22.22 + PM2 7.0
- **SSH:** alias `escolaia-vps` (em `~/.ssh/config` local) → `root@108.174.147.115:22022`
  - Autenticação por chave (`~/.ssh/escolaia_deploy`, ed25519). **Sem senha.**
- **Co-tenant:** `ilovecidades.com.br` roda na mesma VPS, **porta 3000**. Por isso a Escola de IA usa **porta 3001**.

### Caminhos no servidor
| O quê | Onde |
| --- | --- |
| App | `/home/escoladevideosia.com.br/app` |
| Docroot OLS | `/home/escoladevideosia.com.br/public_html` (só `.htaccess` proxy) |
| Logs OLS | `/home/escoladevideosia.com.br/logs/` |
| `.env.local` | `/home/escoladevideosia.com.br/app/.env.local` (chmod 600, owner root) |
| Secrets brutos | `/root/.escolaia/secrets` (DBPASS, SESSION_SECRET, REVALIDATE_TOKEN) |
| Uploads | `/home/escoladevideosia.com.br/app/public/uploads/` |
| SSL Let's Encrypt | `/etc/letsencrypt/live/escoladevideosia.com.br/` |

### Banco MariaDB
- **Database:** `escolaia`
- **Usuário app:** `escolaia_app@localhost` (senha em `/root/.escolaia/secrets`)
- Schema gerenciado via `prisma db push` (sem migrations).

### PM2
- **Process:** `escolaia` (id 1) — rodando como root, modo fork.
- **Listen:** `127.0.0.1:3001`
- Persistido com `pm2 save` + `pm2 startup systemd -u root --hp /root`.

### OpenLiteSpeed (vhost)
- `vhost.conf` em `/usr/local/lsws/conf/vhosts/escoladevideosia.com.br/vhost.conf`
- `extprocessor` e `handler` **chamam-se `escolaia_app`** — **NÃO `nextjs`** (colide com o vhost do ilovecidades). Reapareceu como bug grave durante o setup. Ver §7.
- `.htaccess` em `public_html/`: `RewriteRule ^(.*)$ http://127.0.0.1:3001/$1 [P,L]`.

### Cloudflare
- DNS apontando para o IP, proxy ON (nuvem laranja).
- SSL/TLS modo **Full**.
- Cuidado com cache stale após mudanças no conteúdo — Cloudflare cacheia 404/200 antigos. Purge manual quando muda algo importante.

---

## 3. Stack e arquitetura

### Stack
- Next.js **16.2.6** (App Router, Turbopack) — usa `proxy.ts` (não `middleware.ts`)
- React **19.2.4** / React DOM **19.2.4**
- TypeScript 5.9
- Tailwind v4 (via `@tailwindcss/postcss`, **sem `tailwind.config`** — config em `@theme` no `globals.css`)
- Prisma **6.19.3** + MariaDB
- Gemini SDK `@google/generative-ai` 0.24.1
  - Texto: `gemini-2.5-flash`, fallback `gemini-2.5-flash-lite`
  - Imagem: `imagen-4.0-generate-001` via `:predict`
- React-markdown 10 + **remark-gfm 4.0.1** (tabelas)
- Sharp 0.34.5 (uploads WebP 1200×630)
- Zod 4.4.3

### Estrutura de pastas
```
src/
  app/
    (site)/              # Route group público (Header + Footer)
      page.tsx           # Home
      ferramentas/[slug] # categoria OU tool (merged, único [slug] permitido)
      noticias/, comparativos/, rankings/, alternativas/, precos/,
      tutoriais/, prompts/, glossario/, lancamentos/, sobre/, contato/,
      privacidade/, termos/, cookies/
    admin/
      login/             # Fora do route group panel (sem sidebar)
      (panel)/           # Sidebar dark + auth
        page.tsx         # Dashboard
        novo/            # Seletor de tipo
        [tipo]/          # CRUD genérico (lista, novo, [id])
    api/
      admin/             # login, logout, generate, upload-image, revalidate, [tipo]/...
      news/[id]/view/    # incrementa views
      newsletter/
    uploads/[...path]/   # serve arquivos em runtime (Next 16 não serve `public/` pós-build)
    layout.tsx           # root: <html><body>{children}</body></html>
    globals.css          # @import "tailwindcss" + @theme
    icon.svg             # favicon
    sitemap.ts, robots.ts, manifest.ts, feed.xml/route.ts
  components/            # Header, Footer, Card, Badge, AdSense, Markdown, ...
  components/admin/      # AdminSidebar, AdminForm, AIGenerator, ImageUploader, ...
  lib/
    prisma.ts            # PrismaClient singleton + switch MOCK_DATA
    db.ts                # safeQuery
    gemini.ts            # generateText/JSON/Image + retry/backoff/fallback
    auth.ts              # HMAC-SHA256 cookie (Web Crypto, edge-safe)
    revalidate.ts        # revalidateForType (chamado pelas APIs admin)
    admin.ts             # ADMIN_TYPES (key → route → label → model)
    admin-fields.ts      # Schema dos formulários genéricos
    admin-data.ts        # coercePayload
    constants.ts, utils.ts, url.ts, mock-data.ts, prompts.ts
  proxy.ts               # Protege /admin (auth via cookie HMAC)
scripts/
  lib.ts                 # pool, slugify, revalidate, createWithUniqueSlug
  seed-tools-complete.ts # 117 ferramentas (idempotente)
  generate-tools-content.ts
  generate-tutorials.ts, generate-news.ts, generate-prompts.ts,
  generate-comparisons.ts, generate-rankings.ts
  create-admin.ts, deploy.sh
prisma/
  schema.prisma          # Tool, Category, News, Tutorial, Comparison, Ranking,
                         # Alternative, Price, Prompt (com toolId), GlossaryTerm,
                         # Newsletter
  seed.ts                # 7 categorias + 25 tools + 40 glossário + extras
ecosystem.config.cjs     # PM2 (no servidor a porta é manualmente 3001 via sed)
.env.example, .gitignore, .gitattributes
```

### Decisões importantes
- **`/ferramentas/[categoria]` + `/ferramentas/[slug]`** foram unificados em **um único `[slug]`** que renderiza categoria ou tool conforme o que matchar (App Router não permite 2 segmentos dinâmicos irmãos).
- **Route groups** `(site)` e `admin/(panel)` separam a chrome pública da do admin sem mexer no root layout.
- **`proxy.ts`** em `src/` (não `middleware.ts`) — convenção do Next 16.
- **Auth admin** = cookie HMAC-SHA256 com Web Crypto (sem JWT/bcrypt), edge-safe. `getSession()` faz import dinâmico de `next/headers` para não quebrar o edge runtime do proxy.
- **Cookie `secure`** = `process.env.NODE_ENV === "production"` (não fixo true) — necessário para login funcionar em `http://localhost` durante desenvolvimento.
- **Mock mode** (`MOCK_DATA="true"`) usa `src/lib/mock-data.ts` (cliente Prisma em memória) — útil para dev local sem banco.
- **`safeQuery` wrapper** envolve toda query do Prisma em pages para não derrubar o render se o banco cair.
- **Admin formulário** = genérico via schema (`src/lib/admin-fields.ts`). Adicionar/editar campo = só editar o schema.
- **`revalidatePath`** dispara em todo CRUD admin + endpoint `/api/admin/revalidate` (com Bearer `REVALIDATE_TOKEN`) — para os scripts em lote chamarem.
- **`/uploads/*`** servido por route handler dinâmico (`src/app/uploads/[...path]/route.ts`) porque Next 16 não serve arquivos criados em `public/` após o build.

---

## 4. O que foi construído (cronológico resumido)

1. **Scaffold** — Next 16 + Tailwind v4 + Prisma 6, gemini.ts com parser tolerante a truncamento, ecosystem.config.cjs, deploy.sh.
2. **Schema** — 11 modelos. `prisma db push` (sem migrations).
3. **Layout** — Header sticky, Footer 4-col, Card iOS-style, AdSense lazy (gated por env), CookieBanner.
4. **Páginas públicas** — Home (com JSON-LD WebSite/SearchAction), catálogo de ferramentas com filtros (client), ficha de ferramenta (SoftwareApplication JSON-LD, prós/contras, planos), notícias (lista paginada + artigo 2-col com sidebar sticky, view counter), comparativos (FAQPage JSON-LD), rankings (ItemList JSON-LD), alternativas, preços, tutoriais (HowTo JSON-LD com índice sticky), prompts (modal copy), glossário A-Z (DefinedTerm), lançamentos (timeline).
5. **Admin** — Auth HMAC, `proxy.ts`, painel com sidebar dark, dashboard com métricas e gráfico, gerador IA com Gemini (preenche TODOS os campos do form), upload de imagem com Imagen 4 + sharp, CRUD genérico (1 lista + 1 form para os 9 tipos via schema).
6. **SEO/infra** — sitemap.ts dinâmico, robots.ts, feed.xml RSS, manifest.ts, ícone SVG, páginas institucionais (Sobre/Contato/Privacidade/Termos/Cookies), banner de cookies LGPD, headers de segurança.
7. **Deploy** — VPS via SSH (chave), CyberPanel CLI cria website + SSL Let's Encrypt, MariaDB seed, build, PM2, vhost OLS, `.htaccess`, validação externa.
8. **Bugs resolvidos durante o deploy:**
   - **Extprocessor clash** — copiei o vhost do `ilovecidades` com o mesmo nome `nextjs` no `extprocessor`; OLS roteava 100% do tráfego pro app errado. Renomeado para `escolaia_app`.
   - **`/uploads/*` 404** — Next 16 não serve arquivos criados pós-build em `public/`. Criado route handler `src/app/uploads/[...path]/route.ts`.
   - **`next/image` 400** — `q=85` não permitido; default `q=75` funciona. Adicionado `images.localPatterns` para `/uploads/**`.
   - **Cloudflare cache stale** — purge manual ou cache-buster.
9. **AI Generator** — system prompts por tipo expandidos para preencher todos os campos do form (incluindo selects: toolName, categoryName, difficulty, category, etc.). API resolve `toolName→toolId` e `categoryName→categoryId` consultando o banco. Aplicado `applyGenerated` normaliza tipos.
10. **Retry/fallback Gemini** — `lib/gemini.ts` faz 5 tentativas: 3× no flash com backoff (0/1.5s/4s) → 2× no flash-lite. Mensagem amigável no 503.
11. **revalidação automática** — CRUD admin chama `revalidateForType`; scripts em lote chamam endpoint `/api/admin/revalidate` com Bearer. Pages se publicam imediatamente sem rebuild manual.
12. **Conteúdo em lote** — 4 rodadas (3 generate:all + 1 cleanup). Gerou ~3.000 itens válidos. Gemini deu 503 esporádico (~25% das chamadas mas resolvido em retry); flash-lite ocasionalmente trunca JSON (~64 erros finais).
13. **Schema enriquecido** — `Prompt.toolId` adicionado para idempotência por ferramenta + form admin de Prompt ganhou select de Ferramenta.

---

## 5. Scripts npm disponíveis

```bash
# Dev
npm run dev          # http://localhost:3000 (modo mock por padrão no .env.local local)
npm run build        # build de produção
npm start            # next start -H 127.0.0.1 -p 3000 (no servidor é -p 3001)

# Banco
npm run db:push      # aplica schema (sem migration)
npm run db:generate  # regenera prisma client (roda no postinstall também)
npm run seed         # 7 categorias + 25 tools + 40 glossário + extras
npm run seed:tools   # 117 ferramentas (idempotente, preserva conteúdo já gerado)

# Admin
npm run create-admin # gera linhas ADMIN_USER/ADMIN_PASSWORD/SESSION_SECRET

# Geração em lote (Gemini)
npm run generate:tools        # description/howToUse/pricing/pros/cons/meta para tools com description=""
npm run generate:tutorials    # 5 temas × ferramenta (skip ≥5)
npm run generate:news         # 5 temas × ferramenta (skip ≥5)
npm run generate:prompts      # 5 prompts × ferramenta (skip ≥5)
npm run generate:comparisons  # 40 comparativos pré-definidos (skip se slug existe)
npm run generate:rankings     # 10 rankings pré-definidos (skip se slug existe)
npm run generate:all          # encadeia os 5 acima

# env vars úteis para os generators
CONCURRENCY=3 DELAY_MS=1000 LIMIT=0 npm run generate:tutorials
```

---

## 6. Variáveis de ambiente (.env.local)

```
DATABASE_URL="mysql://escolaia_app:SENHA@localhost:3306/escolaia"
NEXT_PUBLIC_SITE_URL="https://escoladevideosia.com.br"
NEXT_PUBLIC_GA_ID=""                # vazio = GA desligado
NEXT_PUBLIC_ADSENSE_ID=""           # vazio = AdSense desligado
ADMIN_USER="admin"
ADMIN_PASSWORD="..."
SESSION_SECRET="..."                # openssl rand -hex 32
GEMINI_API_KEY="..."
REVALIDATE_TOKEN="..."              # openssl rand -hex 32
MOCK_DATA="false"
```

---

## 7. Pegadinhas (para não tropeçar de novo)

- **Porta 3001**, não 3000. Está hardcoded no `ecosystem.config.cjs` do servidor (`sed -i 's/-p 3000/-p 3001/'` após cada `git pull`). Idealmente refatorar para ler de `process.env.PORT`.
- **vhost OLS** — sempre nome único de `extprocessor`/`handler`. Para Escola de IA: `escolaia_app`. Restart total (`lswsctrl stop && start`), não só graceful.
- **`prisma db push`** após mudança de schema — não esquecer no servidor (rode antes do `npm run build` + `pm2 restart`).
- **Cloudflare cache** — purge após mudança importante de conteúdo ou de assets `/uploads/*`.
- **Gemini API key vincula-se a projeto GCP** com billing. Se fatura atrasa, a key vira `403 Lightning dunning decision is deny` (aconteceu uma vez — ficou bloqueada até o pagamento ser processado).
- **SSH-drop mata processo de foreground**. Para rodar lote longo: `nohup bash -c "..." > /tmp/log 2>&1 < /dev/null &`.
- **Spec de idempotência "skip if ≥5"** — quando uma ferramenta tem 3 itens (de uma rodada parcial), o cleanup gera 5 NOVOS → fica com 8 (3 temas duplicados, conteúdo distinto). Isso aconteceu: ~206 tutoriais e ~211 notícias extras. **Não são cópias byte-a-byte** (SHA1 confirmado), mas 7 pares de tutoriais têm título idêntico. Decidiu-se deixar (volume = bom pra AdSense; risco SEO mínimo).

---

## 8. Pendências

### Pequenas (técnicas)
- [ ] **Melhorar `lib/gemini.ts`**: incorporar `parseJSONLoose` dentro do retry loop + `generationConfig.maxOutputTokens: 8192`. Resolve os 5 itens travados em "Failed to parse JSON" (1 tut, 1 news, 3 rankings).
- [ ] **Refatorar porta para env var** no `ecosystem.config.cjs` (eliminar o `sed` pós-pull).
- [ ] **(Opcional) Renomear 7 títulos duplicados** em Tutorial com `(Parte 2)` para evitar canibalização SEO leve. SQL pronto no histórico.
- [ ] **(Opcional) Trimmar para 5 por ferramenta** — descartado por enquanto.

### Cadastros externos (faça nesta ordem)
- [ ] **Google Search Console** — https://search.google.com/search-console
  - Adicionar propriedade Domain `escoladevideosia.com.br` (via DNS TXT no Cloudflare)
  - Submeter sitemap: `sitemap.xml`
- [ ] **Bing Webmaster Tools** — https://www.bing.com/webmasters
  - "Import from GSC" puxa tudo automaticamente.
- [ ] **Google News Publisher Center** (opcional) — https://publishercenter.google.com/
  - Cadastrar feed `feed.xml`
- [ ] **Google AdSense** — https://www.google.com/adsense/
  - Critérios atendidos (SSL, institucionais, banner cookies, ~1.840 páginas, sitemap)
  - Quando aprovar: setar `NEXT_PUBLIC_ADSENSE_ID="ca-pub-XXXX"` no `.env.local` do servidor + `pm2 restart escolaia --update-env`.

### Segurança (importante)
- [ ] **Trocar senha root SSH** (a senha original foi compartilhada no chat). Login por chave já está ativo, então pode até desabilitar password auth no `sshd_config` (`PasswordAuthentication no`).
- [ ] **Regenerar Gemini API key** em https://aistudio.google.com/app/apikey (a anterior foi compartilhada no chat). Substituir em `/home/escoladevideosia.com.br/app/.env.local` e `pm2 restart`.
- [ ] **(Opcional) Mover uploads para fora do `app/`** para o `npm ci` não apagar entre deploys. Hoje fica em `public/uploads/` — deploy normal não toca, mas se rodar `rm -rf node_modules + npm ci` num caminho equivocado, perde.

### Conteúdo
- [ ] Gerar imagens de capa via Imagen 4 para top-50 ferramentas / top-20 notícias.
- [ ] Configurar `NEXT_PUBLIC_GA_ID` quando criar a propriedade GA4.

---

## 9. Comandos úteis de operação

### Deploy padrão (após push)
```bash
ssh escolaia-vps "cd /home/escoladevideosia.com.br/app && \
  git checkout -- ecosystem.config.cjs && git pull && \
  sed -i 's/-p 3000/-p 3001/' ecosystem.config.cjs && \
  set -a && source .env.local && set +a && \
  npm ci && npx prisma generate && npx prisma db push && \
  npm run build && pm2 restart escolaia --update-env"
```

### Disparar geração em lote (à prova de SSH-drop)
```bash
ssh escolaia-vps "cd /home/escoladevideosia.com.br/app && \
  nohup bash -c 'set -a; source .env.local; set +a; \
    CONCURRENCY=3 DELAY_MS=1000 npm run generate:all' \
    > /tmp/escolaia-generate-$(date +%s).log 2>&1 < /dev/null &"
```

### Monitorar
```bash
ssh escolaia-vps "tail -f /tmp/escolaia-generate-*.log"
ssh escolaia-vps "pm2 logs escolaia --lines 50"
ssh escolaia-vps "pm2 monit"  # interativo
```

### Backup do banco
```bash
ssh escolaia-vps "mysqldump -u escolaia_app -p\$(grep -oP '(?<=:)[^@]+(?=@)' /home/escoladevideosia.com.br/app/.env.local | sed 's/^.*\///' | head -1) escolaia | gzip > /root/backup-escolaia-\$(date +%F).sql.gz"
```

### Restart limpo
```bash
ssh escolaia-vps "pm2 restart escolaia --update-env && \
  /usr/local/lsws/bin/lswsctrl restart"
```

---

## 10. Endpoints úteis

| Endpoint | Método | Notas |
| --- | --- | --- |
| `/api/admin/login` | POST | `{ user, password }` → seta cookie `admin_session` |
| `/api/admin/logout` | POST | limpa cookie |
| `/api/admin/generate` | POST | `{ contentType, instruction, useGrounding }` (sessão admin) |
| `/api/admin/upload-image` | POST | multipart file OR `{ prompt }` para Imagen 4 (sessão admin) |
| `/api/admin/revalidate` | POST | `{ typeKey, slug }` (sessão admin OR Bearer `REVALIDATE_TOKEN`) |
| `/api/admin/[tipo]` | POST | CRUD genérico create (9 tipos) |
| `/api/admin/[tipo]/[id]` | PUT/DELETE | CRUD genérico update/delete |
| `/api/news/[id]/view` | POST | incrementa views |
| `/api/newsletter` | POST | `{ email }` → salva ou 409 |
| `/sitemap.xml` | GET | sitemap dinâmico (1.833 URLs) |
| `/robots.txt` | GET | aponta para o sitemap |
| `/feed.xml` | GET | RSS 2.0 das últimas 100 notícias (Google News) |
| `/manifest.webmanifest` | GET | PWA |
| `/uploads/<path>` | GET | route handler (não estático) — necessário porque Next 16 não serve `public/` pós-build |

---

## 11. Onde os secrets vivem

| Onde | O quê |
| --- | --- |
| `/root/.escolaia/secrets` (chmod 600) | `DBPASS`, `SESSION_SECRET`, `REVALIDATE_TOKEN` |
| `/home/escoladevideosia.com.br/app/.env.local` | tudo do `.env.example` preenchido |
| `~/.ssh/escolaia_deploy` (local) | chave privada ed25519 para SSH |
| `/root/.ssh/authorized_keys` (servidor) | chave pública para autenticar |
| Google AI Studio | Gemini API key (rotacionar) |
| Google Cloud Console | billing do projeto Gemini |

---

## 12. Última coisa: por que `INFORMACOES.md` e não `README.md`

O `README.md` já documenta o **deploy from scratch** (para alguém clonando o repo). Este arquivo documenta o **histórico operacional + estado atual + pendências** — pra ser referência viva durante a operação. Atualize sempre que mexer em infra ou em conteúdo importante.
