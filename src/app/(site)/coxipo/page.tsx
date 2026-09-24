import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import JsonLd from "@/components/json-ld";
import { localBusinessSchema, breadcrumbSchema } from "@/lib/schema";
import { getSiteContent } from "@/lib/content";
import { buildWa } from "@/lib/site-utils";

export async function generateMetadata(): Promise<Metadata> {
  // Fachada da unidade como imagem de compartilhamento (Open Graph/Twitter)
  return pageMetadata("coxipo", "Unidade Coxipó", {
    ogImage: "/img/coxipo-fachada.webp",
  });
}

const GALLERY: Array<[string, string, number, number]> = [
  ["/img/coxipo-1.webp", "Unidade Coxipó - foto 1", 720, 1280],
  ["/img/coxipo-2.webp", "Unidade Coxipó - foto 2", 720, 1280],
  ["/img/coxipo-3.webp", "Unidade Coxipó - foto 3", 800, 1202],
  ["/img/coxipo-4.webp", "Unidade Coxipó - foto 4", 1800, 832],
  ["/img/coxipo-5.webp", "Unidade Coxipó - foto 5", 1800, 837],
  ["/img/coxipo-fachada.webp", "Fachada da unidade Coxipó", 720, 1280],
];

/** Unidade Coxipó — tradução 1:1 de coxipo.php (galeria de 6 fotos). */
export default async function CoxipoPage() {
  const c = await getSiteContent();
  return (
    <>
      {/* LocalBusiness da unidade + trilha Início › Unidades › Coxipó */}
      <JsonLd
        data={[
          localBusinessSchema("coxipo", c["geral.nome_site"]),
          breadcrumbSchema([
            { name: "Início", url: "/" },
            { name: "Unidades", url: "/unidades" },
            { name: "Unidade Coxipó", url: "/coxipo" },
          ]),
        ]}
      />
      <section className="unit-page-hero coxipo-hero">
        <div className="container">
          <span className="kicker">Nossa Unidade Coxipó</span>
          <h1>Loja Coxipó</h1>
          <p>
            Tradição, variedade e soluções completas para obras, reformas e
            iluminação na região.
          </p>
          <div className="button-row">
            <a
              className="btn"
              href={buildWa(c["geral.whatsapp"], "Olá! Quero falar com a unidade Coxipó.")}
              target="_blank"
              rel="noopener"
            >
              Falar com a unidade
            </a>
            <a className="btn btn-ghost" href="#galeria">
              Ver fotos
            </a>
          </div>
        </div>
      </section>
      <section className="section unit-intro">
        <div className="container split-editorial">
          <div className="editorial-media unit-media">
            <Image
              className="editorial-main"
              src="/img/coxipo-4.webp"
              alt="Interior da unidade Coxipó"
              width={1800}
              height={832}
            />
            <Image
              className="editorial-float"
              src="/img/coxipo-5.webp"
              alt="Atendimento na unidade Coxipó"
              width={1800}
              height={837}
            />
          </div>
          <div className="editorial-copy">
            <span className="kicker dark-kicker">Referência na região</span>
            <h2>Variedade e atendimento para cada etapa da sua obra.</h2>
            <p>
              A unidade Coxipó reúne materiais elétricos, hidráulicos e
              iluminação com a experiência que tornou a Luz & Cia referência em
              Cuiabá.
            </p>
            <div className="service-points compact">
              <article>
                <i>✦</i>
                <div>
                  <h3>Linha completa</h3>
                  <p>Produtos técnicos e decorativos.</p>
                </div>
              </article>
              <article>
                <i>◌</i>
                <div>
                  <h3>Compra orientada</h3>
                  <p>Equipe preparada para ajudar.</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
      <section className="section soft-section" id="galeria">
        <div className="container">
          <div className="section-heading centered">
            <span className="kicker dark-kicker">Galeria da unidade</span>
            <h2>Conheça a Coxipó por dentro.</h2>
          </div>
          <div className="gallery-modern">
            {GALLERY.map(([src, alt, width, height]) => (
              <Image key={src} src={src} alt={alt} width={width} height={height} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
