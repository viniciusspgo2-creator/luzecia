import type { ReactNode } from "react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import FloatingWhatsapp from "@/components/floating-whatsapp";
import MobileBar from "@/components/mobile-bar";
import VisitTracker from "@/components/visit-tracker";
import Analytics from "@/components/analytics";
import JsonLd from "@/components/json-ld";
import { getSiteContent } from "@/lib/content";
import { organizationSchema, websiteSchema } from "@/lib/schema";

/**
 * Layout de todas as páginas públicas (grupo "(site)") — mesmo chrome
 * do site aprovado (header, footer, WhatsApp flutuante, barra mobile),
 * agora alimentado pelos textos gerenciáveis do painel.
 *
 * force-dynamic: as páginas leem textos/SEO do banco — as alterações
 * feitas no /admin aparecem imediatamente no site.
 */
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const content = await getSiteContent();

  const site = {
    name: content["geral.nome_site"],
    topbar: content["geral.topbar"],
    phoneDisplay: content["geral.telefone"],
    whatsapp: content["geral.whatsapp"],
    email: content["geral.email"],
    address: content["geral.endereco"],
    hoursWeekday: content["geral.horario_semana"],
    hoursSaturday: content["geral.horario_sabado"],
    footerText: content["geral.rodape_texto"],
    footerTagline: content["geral.rodape_tagline"],
  };

  return (
    <>
      {/* Dados estruturados globais — Organization + WebSite (todas as páginas públicas) */}
      <JsonLd data={[organizationSchema(site.name), websiteSchema(site.name)]} />

      <SiteHeader site={site} />
      <main>{children}</main>
      <SiteFooter site={site} />
      <FloatingWhatsapp whatsapp={site.whatsapp} />
      <MobileBar phoneDisplay={site.phoneDisplay} whatsapp={site.whatsapp} />
      <VisitTracker />
      {/* GA4 / GTM — ativados por variável de ambiente; nunca rastreiam /admin */}
      <Analytics />
    </>
  );
}
