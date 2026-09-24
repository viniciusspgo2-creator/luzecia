/**
 * Utilitários compartilhados entre Server e Client Components.
 * Sem acesso a banco e sem "server-only" — seguros para import em qualquer lado.
 */

export type SiteChrome = {
  name: string;
  topbar: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: string;
  hoursWeekday: string;
  hoursSaturday: string;
  footerText: string;
  footerTagline: string;
};

/** Link de WhatsApp montado a partir do número (só dígitos, com DDI). */
export function buildWa(number: string, msg: string): string {
  return `https://wa.me/${(number || "").replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
}

/** Link tel: a partir do telefone exibido (ex.: "(65) 99319-3625"). */
export function buildTel(phoneDisplay: string): string {
  const digits = (phoneDisplay || "").replace(/\D/g, "");
  const full = digits.length > 11 || digits.startsWith("55") ? digits : `55${digits}`;
  return `tel:+${full}`;
}

/** Data em português (ex.: "4 de agosto de 2026") no fuso do site. */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Cuiaba",
  }).format(d);
}
