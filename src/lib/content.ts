import "server-only";
import { db } from "@/lib/db";

/**
 * Registro central dos textos editáveis do site.
 * Os defaults são os textos aprovados da migração (o site continua idêntico
 * até que o administrador altere algo no painel). O banco guarda APENAS
 * as chaves efetivamente alteradas — assim novos campos nunca quebram nada.
 */

export type FieldType = "text" | "textarea";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  group: string;
};

export const CONTENT_FIELDS: FieldDef[] = [
  /* ── Geral (topbar, contato, rodapé) ─────────────────── */
  { key: "geral.nome_site", label: "Nome do site (usado nos títulos)", type: "text", group: "Geral" },
  { key: "geral.topbar", label: "Frase da barra superior", type: "text", group: "Geral" },
  { key: "geral.telefone", label: "Telefone exibido (ex.: (65) 99999-0000)", type: "text", group: "Geral" },
  { key: "geral.whatsapp", label: "Número do WhatsApp (só dígitos, com DDI+DDD)", type: "text", group: "Geral" },
  { key: "geral.email", label: "E-mail de atendimento", type: "text", group: "Geral" },
  { key: "geral.endereco", label: "Endereço exibido no contato", type: "text", group: "Geral" },
  { key: "geral.horario_semana", label: "Horário — segunda a sexta", type: "text", group: "Geral" },
  { key: "geral.horario_sabado", label: "Horário — sábado", type: "text", group: "Geral" },
  { key: "geral.rodape_texto", label: "Texto do rodapé (sobre a empresa)", type: "textarea", group: "Geral" },
  { key: "geral.rodape_tagline", label: "Rodapé — linha de segmentos", type: "text", group: "Geral" },

  /* ── Página inicial ──────────────────────────────────── */
  { key: "home.hero_kicker", label: "Hero — etiqueta (kicker)", type: "text", group: "Página inicial" },
  { key: "home.hero_titulo", label: "Hero — título principal (H1)", type: "text", group: "Página inicial" },
  { key: "home.hero_texto", label: "Hero — parágrafo de apoio", type: "textarea", group: "Página inicial" },
  { key: "home.hero_cta1", label: "Hero — botão 1 (WhatsApp)", type: "text", group: "Página inicial" },
  { key: "home.hero_cta2", label: "Hero — botão 2 (soluções)", type: "text", group: "Página inicial" },
  { key: "home.card_label", label: "Card lateral — etiqueta", type: "text", group: "Página inicial" },
  { key: "home.card_titulo", label: "Card lateral — título", type: "text", group: "Página inicial" },
  { key: "home.card_texto", label: "Card lateral — texto", type: "textarea", group: "Página inicial" },
  { key: "home.sobre_kicker", label: "Seção \"Mais que produtos\" — etiqueta", type: "text", group: "Página inicial" },
  { key: "home.sobre_titulo", label: "Seção \"Mais que produtos\" — título", type: "text", group: "Página inicial" },
  { key: "home.sobre_texto", label: "Seção \"Mais que produtos\" — texto", type: "textarea", group: "Página inicial" },
  { key: "home.categorias_kicker", label: "Seção categorias — etiqueta", type: "text", group: "Página inicial" },
  { key: "home.categorias_titulo", label: "Seção categorias — título", type: "text", group: "Página inicial" },
  { key: "home.categorias_texto", label: "Seção categorias — texto", type: "textarea", group: "Página inicial" },
  { key: "home.showcase_kicker", label: "Seção escura \"Projetos\" — etiqueta", type: "text", group: "Página inicial" },
  { key: "home.showcase_titulo", label: "Seção escura \"Projetos\" — título", type: "text", group: "Página inicial" },
  { key: "home.showcase_texto", label: "Seção escura \"Projetos\" — texto", type: "textarea", group: "Página inicial" },
  { key: "home.unidades_titulo", label: "Seção unidades — título", type: "text", group: "Página inicial" },
  { key: "home.unidades_texto", label: "Seção unidades — texto", type: "textarea", group: "Página inicial" },
  { key: "home.marcas_titulo", label: "Seção marcas — título", type: "text", group: "Página inicial" },
  { key: "home.marcas_texto", label: "Seção marcas — texto", type: "textarea", group: "Página inicial" },
  { key: "home.yellow_titulo", label: "Teaser Yellow Week — título", type: "text", group: "Página inicial" },
  { key: "home.yellow_texto", label: "Teaser Yellow Week — texto", type: "textarea", group: "Página inicial" },
  { key: "home.faq_titulo", label: "Seção FAQ — título", type: "text", group: "Página inicial" },
  { key: "home.faq_texto", label: "Seção FAQ — texto", type: "textarea", group: "Página inicial" },

  /* ── Sobre ───────────────────────────────────────────── */
  { key: "sobre.banner_titulo", label: "Banner — título (H1)", type: "text", group: "Sobre" },
  { key: "sobre.historia_titulo", label: "Nossa história — título", type: "text", group: "Sobre" },
  { key: "sobre.historia_texto1", label: "Nossa história — parágrafo 1", type: "textarea", group: "Sobre" },
  { key: "sobre.historia_texto2", label: "Nossa história — parágrafo 2", type: "textarea", group: "Sobre" },

  /* ── Contato ─────────────────────────────────────────── */
  { key: "contato.banner_titulo", label: "Banner — título (H1)", type: "text", group: "Contato" },
  { key: "contato.card_texto", label: "Card de atendimento — texto", type: "textarea", group: "Contato" },
];

/** Valores padrão — extraídos 1:1 do site aprovado na migração. */
export const CONTENT_DEFAULTS: Record<string, string> = {
  "geral.nome_site": "Luz & Cia",
  "geral.topbar": "Mais de 35 anos iluminando projetos",
  "geral.telefone": "(65) 99319-3625",
  "geral.whatsapp": "5565993193625",
  "geral.email": "gerencia1@luzecia.net",
  "geral.endereco": "R. Miranda Reis, 161 - Poção, Cuiabá - MT, 78015-640",
  "geral.horario_semana": "Segunda a sexta: 08h às 18h",
  "geral.horario_sabado": "Sábado: 08h às 12h",
  "geral.rodape_texto":
    "Elétrica, hidráulica e iluminação com variedade, orientação especializada e confiança em cada projeto.",
  "geral.rodape_tagline": "Elétrica · Hidráulica · Iluminação",

  "home.hero_kicker": "Produtos e consultoria para obra, reforma e decoração",
  "home.hero_titulo": "Iluminação e materiais que elevam cada projeto.",
  "home.hero_texto":
    "Elétrica, hidráulica e iluminação em um só lugar, com curadoria de produtos, orientação especializada e entrega ágil para sua obra.",
  "home.hero_cta1": "Falar com especialista",
  "home.hero_cta2": "Explorar soluções",
  "home.card_label": "Atendimento especializado",
  "home.card_titulo": "Da escolha técnica ao acabamento final.",
  "home.card_texto":
    "Nossa equipe ajuda você a comparar opções, evitar erros e comprar com mais segurança.",
  "home.sobre_kicker": "Especialistas em soluções completas",
  "home.sobre_titulo": "Mais que produtos: orientação para sua obra acontecer melhor.",
  "home.sobre_texto":
    "Na Luz & Cia, variedade vem acompanhada de conhecimento. Ajudamos clientes, profissionais e empresas a encontrar soluções seguras, funcionais e coerentes com cada ambiente.",
  "home.categorias_kicker": "Produtos e segmentos",
  "home.categorias_titulo":
    "Tudo o que seu projeto precisa, organizado para você escolher melhor.",
  "home.categorias_texto":
    "Linhas técnicas e decorativas para obras residenciais, comerciais e projetos especiais.",
  "home.showcase_kicker": "Projetos que inspiram",
  "home.showcase_titulo": "Soluções que transformam ambientes e simplificam decisões.",
  "home.showcase_texto":
    "Da parte técnica ao detalhe decorativo, reunimos marcas, produtos e orientação para deixar o processo mais seguro e o resultado mais bonito.",
  "home.unidades_titulo": "Duas lojas. A mesma confiança.",
  "home.unidades_texto":
    "Conheça os espaços, veja as fotos de cada unidade e escolha a mais conveniente para sua obra.",
  "home.marcas_titulo": "Qualidade reconhecida em cada escolha.",
  "home.marcas_texto":
    "Trabalhamos com fabricantes consolidados para oferecer segurança, desempenho e excelente acabamento.",
  "home.yellow_titulo": "Descontos que brilham. Impacto que permanece.",
  "home.yellow_texto":
    "Uma campanha que combina condições especiais com responsabilidade social, destinando parte da renda a instituições alinhadas aos nossos valores.",
  "home.faq_titulo": "Informação clara antes da compra.",
  "home.faq_texto":
    "Respostas rápidas para ajudar você a planejar sua visita e seu projeto.",

  "sobre.banner_titulo": "Mais de 35 anos iluminando e conectando projetos.",
  "sobre.historia_titulo": "Da Eletrofone à Luz & Cia",
  "sobre.historia_texto1":
    "Fundada em 1991 como Eletrofone, especializada em elétrica e telefonia, a empresa evoluiu para atender também hidráulica e iluminação. Com a transformação do mercado, nasceu a Luz & Cia: uma referência em soluções completas para obras, reformas e decoração.",
  "sobre.historia_texto2":
    "Em 2012, inauguramos nossa segunda unidade. Em 2025, a loja do centro foi transferida para a Rua Miranda Reis, ampliando acessibilidade, conforto e experiência de compra.",

  "contato.banner_titulo": "Conte com a Luz & Cia no seu próximo projeto.",
  "contato.card_texto":
    "Receba orientação para escolher materiais, consultar produtos ou planejar sua iluminação.",
};

/** Metadados de exibição por grupo (ordem do painel). */
export const CONTENT_GROUPS = [
  "Geral",
  "Página inicial",
  "Sobre",
  "Contato",
] as const;

/** Lê o conteúdo do banco mesclado sobre os defaults. */
export async function getSiteContent(): Promise<Record<string, string>> {
  const merged = { ...CONTENT_DEFAULTS };
  try {
    const rows = await db.siteContent.findMany();
    for (const row of rows) merged[row.key] = row.value;
  } catch {
    // Banco indisponível → mantém defaults (o site nunca quebra).
  }
  return merged;
}
