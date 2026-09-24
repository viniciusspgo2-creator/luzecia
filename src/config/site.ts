/**
 * Configuração central do site — equivalente direto de includes/config.php.
 * Único ponto de verdade para contatos, WhatsApp e metadados globais.
 */

export const SITE_NAME = "Luz & Cia";

export const PHONE_DISPLAY = "(65) 99319-3625";
export const PHONE_WA = "5565993193625";
export const EMAIL = "gerencia1@luzecia.net";
export const ADDRESS = "R. Miranda Reis, 161 - Poção, Cuiabá - MT, 78015-640";

/**
 * URL base usada em metadados (canonical, Open Graph, sitemap, robots).
 * Opcional: defina NEXT_PUBLIC_SITE_URL na Vercel com o domínio real de produção.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.luzecia.net";

/** Equivalente à função wa() do PHP — monta link do WhatsApp com mensagem pré-preenchida. */
export function wa(
  msg = "Olá! Gostaria de falar com a equipe da Luz & Cia."
): string {
  return `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(msg)}`;
}

/** Equivalente à função pageTitle() do PHP. */
export function pageTitle(title = ""): string {
  return title ? `${title} | ${SITE_NAME}` : "Luz & Cia | Elétrica, Hidráulica e Iluminação";
}

/** Descrição global (a mesma do <head> original, preservada para SEO). */
export const SITE_DESCRIPTION =
  "Soluções completas em elétrica, hidráulica e iluminação em Cuiabá. Mais de 35 anos de tradição, consultoria especializada e variedade.";
