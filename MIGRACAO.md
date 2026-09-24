# RELATÓRIO DE MIGRAÇÃO — LUZ & CIA
# PHP legado → Next.js 16 / TypeScript / Vercel
# Migração tecnológica conservadora (regra dos 90% de fidelidade visual)

## Antes / Depois

### ✅ PRESERVADO (100%)
- Identidade visual: paleta (dourado #ffbd52, creme, escuro #171714), logo original, tipografia (Manrope + Playfair Display)
- Design system completo: o `style.css` original foi preservado quase byte a byte
- Todas as 33 imagens aprovadas (showroom, unidades, parceiros, social)
- Textos comerciais: nenhum texto foi alterado
- Ordem das seções da home: hero → diferenciais → institucional → categorias → showcase escuro → unidades → marcas → Yellow Week → FAQ
- Menus, CTAs e mensagens pré-preenchidas do WhatsApp (idênticas às originais)
- Integrações: wa.me, Google Maps (embed), YouTube (6 vídeos), tel:/mailto:
- Metadados SEO: títulos por página e meta description original
- Página 404 com mesma estrutura
- Barra mobile fixa (Ligar / Orçamento / Unidades) e botão flutuante de WhatsApp

### 🔄 MIGRADO
| PHP | Next.js 16 | Observação |
|---|---|---|
| `includes/config.php` | `src/config/site.ts` | ponto único de edição de contatos |
| `includes/header.php` | `layout.tsx` + `components/site-header.tsx` | client component só para o menu |
| `includes/footer.php` | `layout.tsx` + `components/site-footer.tsx` | server component |
| `index.php` | `app/page.tsx` | server component |
| `sobre.php` | `app/sobre/page.tsx` | server component |
| `unidades.php` | `app/unidades/page.tsx` | server component |
| `miranda-reis.php` | `app/miranda-reis/page.tsx` | server component |
| `coxipo.php` | `app/coxipo/page.tsx` | server component |
| `loja-miranda-reis.php` / `loja-coxipo.php` | redirect 308 → `/miranda-reis` / `/coxipo` | compatibilidade de links antigos |
| `yellow-week.php` | `app/yellow-week/page.tsx` | server component |
| `contato.php` | `app/contato/page.tsx` | server component |
| `404.php` | `app/not-found.tsx` | server component |
| `assets/js/app.js` (menu + FAQ) | React state em `site-header.tsx` e `faq-list.tsx` | comportamento 1:1 |
| `.htaccess` (404, cache, -Indexes) | `not-found.tsx` + headers nativos da Vercel | — |

### 🔧 CORRIGIDO (bugs do original — regra 94)
- Sem favicon declarado → browsers pediam `/favicon.ico` e recebiam 404. Agora usa `logo-symbol.png` da própria marca (discreto, identidade preservada).
- Links do menu usavam `basename($_SERVER['PHP_SELF'])` (frágil) → agora `usePathname()` do App Router.
- Falta de `sitemap.xml` e `robots.txt` → criados (regra 28).

### ✨ APRIMORADO (safe enhancements — regra 91)
- `next/font`: Manrope/Playfair auto-hospedadas com `display:swap` (elimina request bloqueante ao Google Fonts)
- `next/image`: lazy loading, srcset responsivo e otimização WebP/AVIF na Vercel
- Redirects 308 permanentes de todas as URLs `.php` (proteção de SEO na troca de tecnologia)
- `aria-expanded` dinâmico no menu e no FAQ; `alt` preservados; landmarks semânticos
- `poweredByHeader:false` (segurança) e metadata Open Graph básica

### ⚙️ ALTERAÇÕES TÉCNICAS (comportamento)
- URLs públicas `.php` → limpas, com redirect permanente (nenhum link quebra)
- Ano do rodapé: PHP calculava por request; Next calcula por build (padrão de mercado)
- Imagens abaixo da dobra carregam sob demanda (lazy) — melhora LCP real
- Nenhuma outra mudança de comportamento

### 🗄️ BANCO DE DADOS
O site original **não possui banco de dados** (classificação Tipo A): sem painel, login, sessões, uploads ou formulários que gravam dados. Nada precisou ser persistido e nenhuma variável `DATABASE_URL` é necessária. Orientação para futuro dinâmico no `README.md`.

## Paridade funcional (regra 51)

| Recurso PHP | Nova implementação | Status |
|---|---|---|
| 7 páginas institucionais + 404 | 7 rotas + `not-found` | ✅ |
| Menu desktop + menu mobile | `site-header.tsx` | ✅ testado |
| FAQ accordion (exclusivo) | `faq-list.tsx` | ✅ testado |
| Links WhatsApp (9 mensagens distintas) | `wa()` em `config/site.ts` | ✅ |
| Google Maps embed | iframe preservado | ✅ |
| Galeria de vídeos YouTube (6) | iframes preservados | ✅ |
| Links tel:/mailto: | preservados | ✅ |
| Aliases loja-*.php | redirects 308 | ✅ testado |
| Barra mobile fixa | `mobile-bar.tsx` | ✅ |
| WhatsApp flutuante | `floating-whatsapp.tsx` | ✅ |

## QA executado
- `npm run lint` → 0 erros / 0 warnings
- `npx tsc --noEmit` → limpo
- `npm run build` → 11 rotas estáticas geradas sem erros
- Todas as rotas respondem 200; `/pagina-inexistente` responde 404; redirects `.php` respondem 308
- Screenshots comparativos desktop (1440px) e mobile (390px): original vs migrado — mesmo site
- Menu mobile: abre/fecha, `aria-expanded` correto, fecha ao navegar
- FAQ: abre/fecha com exclusividade, transição CSS idêntica
- Console do navegador: sem erros, sem warnings de hidratação
- **Não testado**: envio real de e-mails (o site não envia), transações de banco (não existem), WhatsApp/Maps externos (dependem do ambiente do usuário)
