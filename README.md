# Luz & Cia — Site Institucional + Painel Administrável

Site oficial da **Luz & Cia** (elétrica, hidráulica e iluminação em Cuiabá/MT), migrado de **PHP legado para Next.js 16 + TypeScript**, com o design aprovado preservado (regra dos 90%) e **painel de administração completo**.

> 📄 O relatório completo da migração (preservado / migrado / corrigido / aprimorado) está em [`MIGRACAO.md`](./MIGRACAO.md).

---

## O que o painel `/admin` faz

| Recurso | Onde | Detalhes |
|---|---|---|
| **Primeiro acesso** | `/admin` | No 1º acesso, o próprio painel pede nome, e‑mail e a criação da **senha**. Depois disso a tela de criação é bloqueada. |
| **Login/logout** | `/admin/login` | Sessão por cookie `httpOnly` assinado (HMAC‑SHA256) + senha com **scrypt** (`node:crypto` — zero dependências extras). |
| **Contador de visitas** | `/admin/painel` | Visitas de hoje, ontem, 7 dias e total; gráfico dos últimos 14 dias; ranking de páginas mais visitadas. Fuso: `America/Cuiaba`. |
| **Textos do site** | `/admin/conteudo` | Edição de ~40 textos (hero, seções da home, sobre, contato, rodapé, telefone, WhatsApp, e‑mail, endereço, horários). Campo vazio volta ao texto padrão. |
| **Blog** | `/admin/blog` | CRUD completo com mini‑markdown (`## título`, `- lista`, `**negrito**`), rascunho/publicado, slug automático e SEO por artigo. Vem com **6 artigos estratégicos de SEO** já publicados. |
| **SEO e Google** | `/admin/seo` | Título, descrição, palavras‑chave e imagem de compartilhamento — globais e por página, com herança (página → global → padrão). |
| **Analytics** | Variáveis de ambiente | GA4 (`NEXT_PUBLIC_GA_ID`), GTM (`NEXT_PUBLIC_GTM_ID`) e verificação do Search Console (`GOOGLE_SITE_VERIFICATION`) — ver seção *SEO Técnico* abaixo. |

O site público reflete as alterações **imediatamente** (páginas dinâmicas + `revalidatePath`).

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | **Next.js 16** (App Router, Server Components, Server Actions) |
| Linguagem | **TypeScript 5** |
| Estilo | CSS original preservado (`style.css`) + `admin.css` próprio do painel |
| Banco | **Prisma ORM** (SQLite local · Postgres serverless na Vercel) |
| Auth | Sessão HMAC + scrypt nativos de `node:crypto` |
| Imagens | `next/image` com otimização |

## Estrutura

```text
prisma/schema.prisma        # AdminUser, SiteContent, BlogPost, SeoPage, VisitDay, VisitPath
src/app/(site)/             # site público (/, /sobre, /unidades, /miranda-reis, /coxipo,
                            #   /yellow-week, /blog, /blog/[slug], /contato)
src/app/admin/              # painel (setup 1º acesso, login, painel, conteúdo, blog, SEO)
src/app/api/visit/          # beacon do contador de visitas
src/app/sitemap.ts          # sitemap.xml dinâmico (páginas + artigos publicados)
src/app/robots.ts           # robots.txt (/admin e /api fora do índice)
src/lib/seo.ts              # metadata dinâmica (title, description, canonical, OG, Twitter)
src/lib/schema.ts           # JSON‑LD (LocalBusiness, FAQ, Article, Breadcrumb, Organization)
src/components/json-ld.tsx  # renderizador de dados estruturados Schema.org
src/components/analytics.tsx# GA4 + GTM (env‑driven) + eventos de WhatsApp/tel/mail
src/components/lite-youtube.tsx # facade do YouTube (Core Web Vitals)
src/lib/                    # db, auth, content, seo, markdown, visits, site-utils
src/components/             # chrome do site + components/admin
scripts/seed.ts             # 6 artigos estratégicos de SEO (npm run db:seed)
public/img/og-default.png   # imagem Open Graph padrão (1200×630) — scripts/gen_og_image.py
public/img/                 # imagens originais (preservadas)
```

## Rodando localmente

```bash
npm install          # instala deps e roda "prisma generate" (postinstall)
npm run db:push      # cria o banco SQLite (db/custom.db)
npm run db:seed      # semeia os 6 artigos do blog (opcional — já vem semeados no sandbox)
npm run dev          # desenvolvimento → http://localhost:3000
```

Acesse `http://localhost:3000/admin` — o painel pedirá a criação de senha no primeiro acesso.

## Variáveis de ambiente (copie `.env.example` → `.env`)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | **Sim** | Local: `file:../db/custom.db`. Vercel: string de conexão do Postgres (Neon/Supabase/Vercel Postgres), ex. `postgresql://user:pass@host/db?sslmode=require`. |
| `AUTH_SECRET` | **Sim** (produção) | Segredo HMAC das sessões do painel. Gere com `openssl rand -hex 32`. |
| `NEXT_PUBLIC_SITE_URL` | Não (opcional) | Domínio público para canonical/OG/sitemap. Default: `https://www.luzecia.net`. |
| `GOOGLE_SITE_VERIFICATION` | Não | Código da verificação por tag HTML do **Search Console** (só o valor do `content=`). Vazio = verificação por DNS. |
| `NEXT_PUBLIC_GA_ID` | Não | ID de medição do **Google Analytics 4** (`G-XXXXXXXXXX`). Vazio = nenhum script carregado. |
| `NEXT_PUBLIC_GTM_ID` | Não | ID do contêiner do **Google Tag Manager** (`GTM-XXXXXXX`). Se usar GTM, instale o GA4 por dentro dele. |

## Deploy (GitHub → Vercel) com banco persistente

O SQLite funciona no desenvolvimento local, mas o **filesystem da Vercel é efêmero** — para produção, use Postgres serverless:

1. Crie um banco gratuito em [Neon](https://neon.tech), [Supabase](https://supabase.com) ou Vercel Postgres e copie a connection string.
2. No `prisma/schema.prisma`, troque o provider:
   ```prisma
   datasource db {
     provider = "postgresql"      // antes: "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. Gere e aplique as migrations apontando para o banco novo:
   ```bash
   npx prisma migrate dev --name init     # cria prisma/migrations (commit!)
   npm run db:seed                        # popula os artigos do blog (DATABASE_URL do Postgres no .env)
   ```
4. Na Vercel (**Project → Settings → Environment Variables**) configure:
   - `DATABASE_URL` = connection string do Postgres (+ `?sslmode=require` no Neon)
   - `AUTH_SECRET` = valor gerado por `openssl rand -hex 32`
   - `NEXT_PUBLIC_SITE_URL` = domínio de produção (opcional)
5. O build da Vercel usa o script do `package.json` — já correto:
   ```json
   "build": "prisma generate && next build"
   ```
   (se criou migrations no passo 3, use `"prisma migrate deploy && prisma generate && next build"`.)
6. Importe o repositório na Vercel (Add New → Project) e faça o deploy. O painel ficará em `https://seu-dominio/admin`.

> ⚠️ A senha do painel **não migra** junto — crie-a no primeiro acesso ao `/admin` já em produção (ou replique o usuário via seed). Cada ambiente tem seu próprio `AdminUser`.

## Validação antes do deploy

```bash
npm run lint     # ESLint → 0 erros
npx tsc --noEmit # TypeScript → limpo
npm run build    # build de produção → 22 rotas ✓
```

### Redirects de SEO (já configurados no `next.config.ts`)

Todas as URLs antigas `.php` redirecionam com **308 permanente** para as novas URLs limpas (`/index.php` → `/`, `/sobre.php` → `/sobre`, etc.), preservando o SEO indexado.

## SEO Técnico (implementado)

| Recurso | Onde | Como funciona |
|---|---|---|
| **Sitemap.xml automático** | `src/app/sitemap.ts` | Páginas institucionais + artigos publicados no blog, gerados em `/sitemap.xml` e referenciados no `robots.txt`. |
| **Robots.txt** | `src/app/robots.ts` | Permite o site inteiro; bloqueia `/admin` e `/api`; aponta o sitemap. |
| **Meta tags + Canonical** | `src/lib/seo.ts` | Título, descrição e keywords gerenciáveis no painel (herança página → global → padrão); `rel=canonical` em todas as páginas. |
| **Open Graph + Twitter Cards** | `src/lib/seo.ts` | `og:title/description/url/image/siteName/locale` + `twitter:card summary_large_image`; unidades usam a foto da fachada. |
| **Imagem OG padrão** | `public/img/og-default.png` | 1200×630 com a identidade da marca (gerada por `scripts/gen_og_image.py`). |
| **Schema.org JSON‑LD** | `src/lib/schema.ts` + `src/components/json-ld.tsx` | `Organization` e `WebSite` em todas as páginas; `LocalBusiness` (HardwareStore) das duas unidades (home, contato e páginas das lojas); `FAQPage` na home; `Article` + `BreadcrumbList` nos artigos; `Blog` na listagem. Valide em [validator.schema.org](https://validator.schema.org). |
| **H1/H2/H3** | todas as páginas | Um único `h1` por página; seções em `h2`; cards/subtítulos em `h3`. |
| **URLs amigáveis + redirects** | `next.config.ts` | Rotas limpas + 308 permanente de todas as URLs `.php` e `/assets/img/*`. |
| **Core Web Vitals** | `lite-youtube.tsx`, `next.config.ts` | Facade do YouTube (iframe só carrega ao clicar), imagens AVIF/WebP, `next/font` com `display: swap`, cache longo em `/img/*`. |
| **Lazy loading** | `next/image` + facade | Padrão no Next para imagens; YouTube só carrega no clique; Maps com `loading="lazy"`. |
| **Google Search Console** | `GOOGLE_SITE_VERIFICATION` | Tag meta `google-site-verification` injetada automaticamente quando a variável existir. |
| **GA4 / GTM** | `src/components/analytics.tsx` | Carregados somente com as variáveis definidas; eventos automáticos `whatsapp_click`, `phone_click` e `email_click`; nunca rastreiam `/admin`. |

> 💡 Após publicar em produção: cadastre o domínio no Search Console, envie o `sitemap.xml`, confirme a verificação e conecte o GA4/GTM pelas variáveis na Vercel. Não é preciso mexer em código.

## Integrações preservadas

- **WhatsApp** (wa.me) — todos os CTAs com mensagens pré-preenchidas (número agora editável no painel)
- **Google Maps** — embed na página Contato
- **YouTube** — 6 vídeos da galeria Yellow Week (agora com facade de performance)
- **Telefonia/e-mail** — links `tel:` e `mailto:` (números editáveis no painel)

## Segurança

- Painel fora da indexação (`robots.txt` → `Disallow: /admin`) e `noindex`
- Rotas protegidas por sessão assinada; cookies `httpOnly` + `SameSite=Lax` (+ `Secure` em produção)
- Senhas com scrypt + salt aleatório; comparação em tempo constante
- APIs públicas validam entrada; contador ignora rotas `/admin` e `/api`
