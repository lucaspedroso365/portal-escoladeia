# Escola de IA

Portal de conteúdo sobre inteligência artificial (escoladevideosia.com.br) — ferramentas,
notícias, tutoriais, comparativos, rankings, alternativas, preços, prompts e glossário.

Stack: **Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind v4** ·
**Prisma 6 + MariaDB** · **Gemini 2.5 Flash / Imagen 4** · **PM2 + OpenLiteSpeed (CyberPanel)**.

---

## Desenvolvimento local

```bash
npm install          # instala deps + roda prisma generate (postinstall)
cp .env.example .env.local
# defina MOCK_DATA="true" para rodar sem banco (dados em memória)
npm run dev
```

Com `MOCK_DATA="true"` o app usa `src/lib/mock-data.ts` (sem MariaDB).
Com `MOCK_DATA="false"` ele usa o banco real via Prisma.

### Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build e produção (`start` usa `-H 127.0.0.1 -p 3000`) |
| `npm run db:push` | Aplica o schema no banco (`prisma db push`) |
| `npm run db:generate` | Gera o Prisma Client |
| `npm run seed` | Popula categorias, ferramentas, glossário e conteúdo inicial |
| `npm run create-admin` | Gera as linhas `ADMIN_USER/ADMIN_PASSWORD/SESSION_SECRET` |
| `npm run generate:tools` | Gera conteúdo (IA) das ferramentas sem conteúdo |
| `npm run generate:news [n]` | Gera N notícias com IA |

### Variáveis de ambiente (`.env.local`)

```
DATABASE_URL="mysql://escolaia_app:SENHA@localhost:3306/escolaia"
NEXT_PUBLIC_SITE_URL="https://escoladevideosia.com.br"
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_ADSENSE_ID=""
ADMIN_USER="admin"
ADMIN_PASSWORD=""
SESSION_SECRET=""        # use: npm run create-admin
GEMINI_API_KEY=""
MOCK_DATA="false"
```

---

## Deploy (AlmaLinux 9 + CyberPanel + Node 22 + PM2)

> Espelha o modelo do ilovecidades.

### 1. Pré-requisitos no servidor

- AlmaLinux 9 com CyberPanel (OpenLiteSpeed)
- Node.js 22 (`nvm install 22`)
- PM2 (`npm i -g pm2`)

### 2. Criar o website no CyberPanel

CyberPanel → **Websites → Create Website** para `escoladevideosia.com.br`.

### 3. Criar o banco MariaDB

```sql
CREATE DATABASE escolaia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'escolaia_app'@'localhost' IDENTIFIED BY 'SENHA_FORTE';
GRANT ALL PRIVILEGES ON escolaia.* TO 'escolaia_app'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Clonar e configurar

```bash
cd /home/escoladevideosia.com.br
git clone <repo> app && cd app
npm ci
cp .env.example .env.local   # edite com os dados reais (MOCK_DATA="false")
npm run create-admin         # gere ADMIN_*/SESSION_SECRET e cole no .env.local
npx prisma db push
npm run seed
npm run build
```

### 5. Subir com PM2

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup     # siga a instrução exibida
```

A app sobe em `127.0.0.1:3000`.

### 6. Proxy no OpenLiteSpeed

No `vhost.conf` do site (CyberPanel → Manage → vHost Conf):

```
extprocessor escolaia {
  type                    proxy
  address                 127.0.0.1:3000
  maxConns                100
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}

context / {
  type                    proxy
  handler                 escolaia
  addDefaultCharset       off
}
```

E um `.htaccess` na docroot (fallback):

```apache
RewriteEngine On
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
```

Reinicie o OpenLiteSpeed após salvar.

### 7. Cloudflare

- DNS apontando para o IP do servidor (proxy **ON**, nuvem laranja).
- SSL/TLS: **Full** (ou Full Strict com certificado válido no OLS).

O `src/lib/url.ts` (`publicOrigin`) trata `X-Forwarded-Proto/Host` duplicados do OLS + Cloudflare.

### Deploy contínuo

```bash
./scripts/deploy.sh   # git pull, npm ci, prisma generate, db push, build, pm2 restart
```

---

## Conteúdo (painel admin)

1. Acesse `/admin/login` e entre com `ADMIN_USER` / `ADMIN_PASSWORD`.
2. Em **Novo conteúdo**, escolha o tipo e use o **Gerar com IA** (Gemini 2.5 Flash)
   para preencher o formulário. Imagens via upload ou **Imagen 4**.
3. Para popular em lote: `npm run generate:tools` e `npm run generate:news 20`.

---

## Checklist Google AdSense

- [x] Domínio próprio com SSL
- [x] Páginas Sobre, Contato, Privacidade, Termos e Cookies
- [ ] Mínimo de 30–50 artigos publicados (gere via `/admin` ou scripts)
- [x] Navegação clara em todas as páginas
- [x] Banner de cookies funcionando
- [x] Sem conteúdo proibido
- [x] `sitemap.xml` e `robots.txt` acessíveis (+ `feed.xml` para Google News)
- [ ] Lighthouse SEO 100, Performance 85+

Defina `NEXT_PUBLIC_ADSENSE_ID` para ativar o script do AdSense e os blocos de anúncio.
```
