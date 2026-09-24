/**
 * Construtores de dados estruturados Schema.org (JSON-LD).
 * ─────────────────────────────────────────────────────────────
 * Funções puras (sem acesso a banco) — cada página injeta o JSON-LD
 * apropriado via componente <JsonLd />. Os nós compartilhados
 * (Organization, WebSite, lojas) usam @id para serem referenciados
 * entre páginas sem duplicação (padrão recomendado pelo Google).
 *
 * Onde usar:
 *   layout (site)  → organizationSchema + websiteSchema (todas as páginas)
 *   home           → localBusinessSchema (2 unidades) + faqSchema
 *   contato        → localBusinessSchema("miranda-reis")
 *   /miranda-reis  → localBusinessSchema("miranda-reis") + breadcrumbSchema
 *   /coxipo        → localBusinessSchema("coxipo") + breadcrumbSchema
 *   /blog          → blogSchema
 *   /blog/[slug]   → articleSchema + breadcrumbSchema
 */
import { SITE_URL, SITE_NAME, PHONE_WA, EMAIL, ADDRESS } from "@/config/site";

/** URL absoluta a partir de um caminho (ou devolve a URL já absoluta). */
function absolute(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

/** Contexto/ids compartilhados do grafo. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Telefone no formato internacional (+55…), derivado do número do WhatsApp. */
const PHONE_INTL = `+${PHONE_WA.replace(/\D/g, "")}`;

/** Imagem Open Graph padrão (1200×630) — usada quando a página não define outra. */
export const DEFAULT_OG_IMAGE = "/img/og-default.png";

/* ────────────────────────── Organization ────────────────────────── */

export function organizationSchema(name: string = SITE_NAME) {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name,
    url: SITE_URL,
    logo: absolute("/img/logo.png"),
    foundingDate: "1991",
    description:
      "Soluções completas em elétrica, hidráulica e iluminação em Cuiabá, com mais de 35 anos de tradição.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: PHONE_INTL,
      email: EMAIL,
      contactType: "customer service",
      areaServed: "Cuiabá e Várzea Grande - MT",
      availableLanguage: "Portuguese",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS,
      addressLocality: "Cuiabá",
      addressRegion: "MT",
      addressCountry: "BR",
    },
  };
}

/* ──────────────────────────── WebSite ───────────────────────────── */

export function websiteSchema(name: string = SITE_NAME) {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name,
    inLanguage: "pt-BR",
    publisher: { "@id": ORG_ID },
  };
}

/* ─────────────────── LocalBusiness (unidades) ───────────────────── */

export type UnitKey = "miranda-reis" | "coxipo";

/** Horários de funcionamento (espelham os defaults editáveis do painel). */
const HOURS_WEEK = [
  { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
  { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "12:00" },
];

export function localBusinessSchema(unit: UnitKey, name: string = SITE_NAME) {
  const isMiranda = unit === "miranda-reis";

  return {
    "@type": "HardwareStore",
    "@id": `${SITE_URL}/#${unit}`,
    name: `${name} — Unidade ${isMiranda ? "Miranda Reis" : "Coxipó"}`,
    url: absolute(isMiranda ? "/miranda-reis" : "/coxipo"),
    image: absolute(isMiranda ? "/img/miranda-fachada.webp" : "/img/coxipo-fachada.webp"),
    telephone: PHONE_INTL,
    email: EMAIL,
    priceRange: "$$",
    currenciesAccepted: "BRL",
    parentOrganization: { "@id": ORG_ID },
    openingHoursSpecification: HOURS_WEEK,
    address: isMiranda
      ? {
          "@type": "PostalAddress",
          streetAddress: "R. Miranda Reis, 161 — Poção",
          addressLocality: "Cuiabá",
          addressRegion: "MT",
          postalCode: "78015-640",
          addressCountry: "BR",
        }
      : // A unidade Coxipó não publica endereço no site original —
        // cidade/UF apenas. Ao publicar, acrescente streetAddress/postalCode aqui.
        {
          "@type": "PostalAddress",
          addressLocality: "Cuiabá",
          addressRegion: "MT",
          addressCountry: "BR",
        },
  };
}

/* ────────────────────────── Breadcrumb ──────────────────────────── */

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(item.url),
    })),
  };
}

/* ───────────────────────────── FAQ ──────────────────────────────── */

/** Espelha as perguntas do bloco FAQ da home (components/faq-list.tsx). */
export const HOME_FAQS: Array<[string, string]> = [
  [
    "Quais produtos a Luz & Cia oferece?",
    "Linhas completas em elétrica, hidráulica e iluminação para reformas, obras residenciais, espaços comerciais e projetos de decoração.",
  ],
  [
    "Vocês oferecem consultoria em iluminação?",
    "Sim. Nossa equipe orienta na escolha de produtos e oferece consultoria luminotécnica de acordo com o ambiente e a necessidade do projeto.",
  ],
  [
    "A Luz & Cia realiza entregas?",
    "Sim. Trabalhamos com entregas em Cuiabá e Várzea Grande, com condições definidas conforme o pedido e a região.",
  ],
  [
    "Como conhecer as duas unidades?",
    "Acesse a página de Unidades para visualizar fotos da Miranda Reis e do Coxipó, além dos atalhos de contato.",
  ],
];

export function faqSchema(faqs: Array<[string, string]> = HOME_FAQS) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

/* ──────────────────────────── Artigo ────────────────────────────── */

export function articleSchema(input: {
  title: string;
  description: string;
  slug: string;
  image?: string | null;
  publishedAt: Date | string;
  updatedAt: Date | string;
  authorName?: string;
}) {
  return {
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: [absolute(input.image || DEFAULT_OG_IMAGE)],
    mainEntityOfPage: { "@type": "WebPage", "@id": absolute(`/blog/${input.slug}`) },
    datePublished: new Date(input.publishedAt).toISOString(),
    dateModified: new Date(input.updatedAt).toISOString(),
    inLanguage: "pt-BR",
    author: {
      "@type": "Organization",
      name: input.authorName || SITE_NAME,
      url: SITE_URL,
    },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": `${SITE_URL}/#blog` },
  };
}

/* ────────────────────────────── Blog ────────────────────────────── */

export function blogSchema(
  posts: Array<{ slug: string; title: string; publishedAt: Date | string }>,
  name: string = SITE_NAME
) {
  return {
    "@type": "Blog",
    "@id": `${SITE_URL}/#blog`,
    url: absolute("/blog"),
    name: `Blog ${name}`,
    inLanguage: "pt-BR",
    publisher: { "@id": ORG_ID },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absolute(`/blog/${p.slug}`),
      datePublished: new Date(p.publishedAt).toISOString(),
      author: { "@type": "Organization", name: SITE_NAME },
    })),
  };
}
