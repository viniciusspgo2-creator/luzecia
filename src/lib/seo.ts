import "server-only";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getSiteContent } from "@/lib/content";
import { DEFAULT_OG_IMAGE } from "@/lib/schema";
import { SITE_URL } from "@/config/site";

/**
 * SEO configurável — defaults preservados do site original e
 * overrides por página gravados pelo painel (/admin/seo).
 */

export const SEO_PAGES: Array<{ key: string; label: string }> = [
  { key: "global", label: "Global (padrão de todas as páginas)" },
  { key: "home", label: "Página inicial (/)" },
  { key: "sobre", label: "Sobre nós (/sobre)" },
  { key: "unidades", label: "Unidades (/unidades)" },
  { key: "miranda-reis", label: "Unidade Miranda Reis (/miranda-reis)" },
  { key: "coxipo", label: "Unidade Coxipó (/coxipo)" },
  { key: "yellow-week", label: "Yellow Week (/yellow-week)" },
  { key: "blog", label: "Blog (/blog)" },
  { key: "contato", label: "Contato (/contato)" },
];

export const SEO_DEFAULTS: Record<string, { title?: string; description?: string; keywords?: string }> = {
  global: {
    title: "Luz & Cia | Elétrica, Hidráulica e Iluminação",
    description:
      "Soluções completas em elétrica, hidráulica e iluminação em Cuiabá. Mais de 35 anos de tradição, consultoria especializada e variedade.",
    keywords:
      "elétrica cuiabá, hidráulica cuiabá, iluminação cuiabá, materiais elétricos, lâmpadas, luz e cia",
  },
  home: {
    title: "Luz & Cia | Elétrica, Hidráulica e Iluminação",
    description:
      "Elétrica, hidráulica e iluminação em Cuiabá com curadoria de produtos e consultoria especializada. Duas unidades prontas para atender sua obra.",
    keywords: "materiais elétricos cuiabá, iluminação cuiabá, hidráulica, consultoria luminotécnica",
  },
  sobre: {
    title: "Sobre nós",
    description:
      "Mais de 35 anos de história: da Eletrofone à Luz & Cia, referência em soluções completas para obras, reformas e decoração em Cuiabá.",
    keywords: "história luz e cia, eletrofone, loja de elétrica cuiabá",
  },
  unidades: {
    title: "Nossas unidades",
    description:
      "Conheça as duas unidades da Luz & Cia em Cuiabá: Miranda Reis (Centro) e Coxipó. Fotos, endereços e diferenciais de cada loja.",
    keywords: "loja elétrica cuiabá, luz e cia unidades, miranda reis, coxipó",
  },
  "miranda-reis": {
    title: "Unidade Miranda Reis",
    description:
      "Unidade Centro da Luz & Cia na Rua Miranda Reis, 161 — loja ampla e moderna para uma experiência de compra completa.",
    keywords: "luz e cia miranda reis, loja centro cuiabá",
  },
  coxipo: {
    title: "Unidade Coxipó",
    description:
      "Unidade Coxipó da Luz & Cia — tradição, variedade e atendimento especializado para a região.",
    keywords: "luz e cia coxipó, loja coxipó cuiabá",
  },
  "yellow-week": {
    title: "Yellow Week",
    description:
      "Yellow Week Luz & Cia: condições especiais em iluminação e materiais com responsabilidade social. Conheça o projeto.",
    keywords: "yellow week, promoção materiais elétricos, descontos iluminação",
  },
  blog: {
    title: "Blog",
    description:
      "Dicas de iluminação, elétrica e hidráulica para sua obra ou reforma: guias práticos, comparativos e economia de energia no blog da Luz & Cia.",
    keywords: "dicas de iluminação, blog luz e cia, economia de energia, dicas elétrica",
  },
  contato: {
    title: "Contato",
    description:
      "Fale com a Luz & Cia: WhatsApp, telefone, e-mail e endereços das unidades em Cuiabá. Atendimento de segunda a sábado.",
    keywords: "contato luz e cia, whatsapp luz e cia, endereço loja cuiabá",
  },
};

type SeoRow = { title?: string; description?: string; keywords?: string; ogImage?: string };

/** Lê as configurações salvas (por página) mescladas com os defaults. */
export async function getSeoConfig(): Promise<Record<string, SeoRow>> {
  const rows: Record<string, SeoRow> = {};
  try {
    const dbRows = await db.seoPage.findMany();
    for (const row of dbRows) {
      rows[row.page] = {
        title: row.title || undefined,
        description: row.description || undefined,
        keywords: row.keywords || undefined,
        ogImage: row.ogImage || undefined,
      };
    }
  } catch {
    // Banco indisponível → usa apenas os defaults.
  }

  // Cadeia de prioridade por campo:
  //   valor salvo da página → valor salvo do Global → padrão da página → padrão global
  const globalRow = rows.global ?? {};
  const globalDefault = SEO_DEFAULTS.global;
  const effective: Record<string, SeoRow> = {};

  for (const [key, pageDefault] of Object.entries(SEO_DEFAULTS)) {
    if (key === "global") continue;
    const pageRow = rows[key] ?? {};
    effective[key] = {
      title: pageRow.title ?? globalRow.title ?? pageDefault.title,
      description: pageRow.description ?? globalRow.description ?? pageDefault.description,
      keywords: pageRow.keywords ?? globalRow.keywords ?? pageDefault.keywords,
      ogImage: pageRow.ogImage ?? globalRow.ogImage,
    };
  }

  effective.global = {
    title: globalRow.title ?? globalDefault.title,
    description: globalRow.description ?? globalDefault.description,
    keywords: globalRow.keywords ?? globalDefault.keywords,
    ogImage: globalRow.ogImage,
  };

  return effective;
}

/** Chaves de keywords aceitas pelo Next Metadata. */
function parseKeywords(raw?: string | null): string[] | undefined {
  const list = (raw ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
}

/** Diretivas robots generosas para rich results (aplicadas a todas as páginas públicas). */
const ROBOTS_INDEX = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
} as const;

/**
 * Monta o Metadata de uma página pública usando: override da página →
 * default da página → default global. Sempre chamado dentro de
 * generateMetadata (rotas dinâmicas — o painel atualiza na hora).
 *
 * Inclui: canonical, Open Graph (com og:url e imagem padrão),
 * Twitter Cards e diretivas robots para rich results.
 */
export async function pageMetadata(
  page: string,
  titleSuffix?: string,
  opts?: { ogImage?: string }
): Promise<Metadata> {
  const cfg = await getSeoConfig();
  const global_ = cfg.global ?? {};
  const local = cfg[page] ?? {};
  const content = await getSiteContent();
  const siteName = content["geral.nome_site"] || "Luz & Cia";
  const title = local.title ?? global_.title ?? siteName;
  const description = local.description ?? global_.description;
  const ogImage = opts?.ogImage ?? local.ogImage ?? global_.ogImage ?? DEFAULT_OG_IMAGE;
  const canonical = page === "home" ? "/" : `/${page}`;
  const isHome = page === "home";
  const imageUrl = new URL(ogImage, SITE_URL).toString();

  // Título completo para redes sociais (não duplica a marca se o cadastro já a traz).
  const fullTitle = isHome || title.includes(siteName) ? title : `${title} | ${siteName}`;

  // Home: título completo absoluto (não recebe sufixo do template).
  // Demais páginas: usa o template "%s | Site" do layout raiz.
  return {
    title: isHome ? { absolute: title } : titleSuffix ?? title,
    description,
    keywords: parseKeywords(local.keywords ?? global_.keywords),
    alternates: { canonical },
    robots: ROBOTS_INDEX,
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName,
      locale: "pt_BR",
      type: "website",
      images: [
        ogImage === DEFAULT_OG_IMAGE
          ? { url: imageUrl, width: 1200, height: 630, alt: fullTitle }
          : { url: imageUrl, alt: fullTitle },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}
