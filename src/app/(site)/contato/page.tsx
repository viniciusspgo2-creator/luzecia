import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { buildTel, buildWa } from "@/lib/site-utils";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/json-ld";
import { localBusinessSchema } from "@/lib/schema";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("contato", "Contato");
}

/** Contato — estrutura 1:1 de contato.php; dados de contato gerenciáveis no painel. */
export default async function ContatoPage() {
  const c = await getSiteContent();

  return (
    <>
      {/* LocalBusiness (unidade central) — reforça endereço/telefone/horário no Google */}
      <JsonLd data={localBusinessSchema("miranda-reis", c["geral.nome_site"])} />

      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">Vamos conversar</span>
          <h1>{c["contato.banner_titulo"]}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-card">
            <span className="eyebrow">Atendimento</span>
            <h2>Fale com nossa equipe</h2>
            <p>{c["contato.card_texto"]}</p>
            <a href={buildTel(c["geral.telefone"])}>{c["geral.telefone"]}</a>
            <a href={`mailto:${c["geral.email"]}`}>{c["geral.email"]}</a>
            <p>{c["geral.endereco"]}</p>
            <a
              className="btn"
              href={buildWa(c["geral.whatsapp"], "Olá! Quero atendimento da Luz & Cia.")}
              target="_blank"
              rel="noopener"
            >
              Abrir WhatsApp
            </a>
          </div>
          <iframe
            className="map"
            loading="lazy"
            src="https://www.google.com/maps?q=R.%20Miranda%20Reis%20161%20Cuiaba%20MT&output=embed"
            title="Mapa - Luz & Cia Miranda Reis"
          ></iframe>
        </div>
      </section>
    </>
  );
}
