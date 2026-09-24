/**
 * Helper de eventos de conversão — funciona com GA4 (gtag.js) e GTM.
 *
 * Regras:
 *  - Com GTM ativo: empurra para `window.dataLayer` (padrão GTM; o GA4
 *    dentro do GTM recebe o evento conforme a tag configurada).
 *  - Sem GTM (GA4 direto): dispara `gtag('event', …)`.
 *
 * Uso em Client Components:
 *   import { trackEvent } from "@/lib/track-event";
 *   <button onClick={() => trackEvent("clique_orcamento", { local: "home" })}>…
 */
export function trackEvent(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  const w = window as unknown as {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    gtmLoaded?: boolean;
  };

  // GTM (ou GA4 carregado via GTM)
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...params });

  // GA4 carregado diretamente (sem GTM no ar)
  if (!w.gtmLoaded && typeof w.gtag === "function") {
    w.gtag("event", event, params);
  }
}
