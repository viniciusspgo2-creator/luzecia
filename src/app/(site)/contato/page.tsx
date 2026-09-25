import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { buildWa } from "@/lib/site-utils";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("contato", "Contato");
}

/** Página de Contato — tradução 1:1 de contato.php */
export default async function ContatoPage() {
  const c = await getSiteContent();

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">Fale conosco</span>
          <h1>{c["contato.banner_titulo"] || "Entre em contato"}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div>
            <span className="eyebrow">Informações</span>
            <h2>{c["contato.info_titulo"] || "Onde nos encontrar"}</h2>

            <div className="contact-info">
              <p>
                <strong>WhatsApp:</strong><br />
                <a href={buildWa(c["geral.whatsapp"], "Olá! Quero falar com a Luz & Cia.")}
                   target="_blank" rel="noopener">
                  {c["geral.whatsapp"] || "(65) 3023-2323"}
                </a>
              </p>
              <p>
                <strong>Telefone:</strong><br />
                {c["geral.telefone"] || "(65) 3023-2323"}
              </p>
              <p>
                <strong>E-mail:</strong><br />
                {c["geral.email"] || "contato@luzecia.com.br"}
              </p>
              <p>
                <strong>Endereço (Centro):</strong><br />
                {c["geral.endereco_centro"] || "Rua Miranda Reis, 161 — Poção, Cuiabá"}
              </p>
              <p>
                <strong>Endereço (Coxipó):</strong><br />
                {c["geral.endereco_coxipo"] || "Av. São Sebastião, 200 — Coxipó, Cuiabá"}
              </p>
              <p>
                <strong>Horário de funcionamento:</strong><br />
                {c["geral.horario"] || "Seg–Sex: 07h–18h | Sáb: 07h–12h"}
              </p>
            </div>
          </div>

          <div className="contact-map">
            <span className="eyebrow">Localização</span>
            <h2>Matriz Centro</h2>
            <p>Rua Miranda Reis, 161 — Poção, Cuiabá, MT</p>
            <iframe
              src="https://www.google.com/maps/embed?pb=..."
              width="600"
              height="450"
              style={{ border: 0, width: "100%" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa da loja Centro"
            />
          </div>
        </div>
      </section>
    </>
  );
}