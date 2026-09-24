import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import JsonLd from "@/components/json-ld";
import { localBusinessSchema, breadcrumbSchema } from "@/lib/schema";
import { getSiteContent } from "@/lib/content";
import { buildWa } from "@/lib/site-utils";

export async function generateMetadata(): Promise<Metadata> {
  // Fachada da unidade como imagem de compartilhamento (Open Graph/Twitter)
  return pageMetadata("miranda-reis", "Unidade Miranda Reis", {
    ogImage: "/img/miranda-fachada.webp",
  });
}

const GALLERY: Array<[string, string]> = [
  ["/img/miranda-1.webp", "Unidade Miranda Reis - foto 1"],
  ["/img/miranda-2.webp", "Unidade Miranda Reis - foto 2"],
  ["/img/miranda-3.webp", "Unidade Miranda Reis - foto 3"],
  ["/img/miranda-4.webp", "Unidade Miranda Reis - foto 4"],
  ["/img/miranda-5.webp", "Unidade Miranda Reis - foto 5"],
  ["/img/miranda-fachada.webp", "Fachada da unidade Miranda Reis"],
];

const GALLERY_DIMS: Record<string, { width: number; height: number }> = {
  "miranda-1": { width: 960, height: 1280 },
  "miranda-2": { width: 1280, height: 818 },
  "miranda-3": { width: 1280, height: 960 },
  "miranda-4": { width: 1280, height: 1066 },
  "miranda-5": { width: 626, height: 417 },
  "miranda-fachada": { width: 1170, height: 1280 },
};

/** Unidade Miranda Reis — tradução 1:1 de miranda-reis.php (galeria de 6 fotos). */
export default async function MirandaReisPage() {
  const c = await getSiteContent();
  return (
    <>
      {/* LocalBusiness da unidade + trilha Início › Unidades › Miranda Reis */}
      <JsonLd
        data={[
          localBusinessSchema("miranda-reis", c["geral.nome_site"]),
          breadcrumbSchema([
            { name: "Início", url: "/" },
            { name: "Unidades", url: "/unidades" },
            { name: "Unidade Miranda Reis", url: "/miranda-reis" },
          ]),
        ]}
      />
      <section className="unit-page-hero miranda-hero">
        <div className="container">
          <span className="kicker">Nossa Unidade Centro</span>
          <h1>Loja Miranda Reis</h1>
          <p>
            Mais espaço, acessibilidade e uma experiência completa em elétrica,
            hidráulica e iluminação.
          </p>
          <div className="button-row">
            <a
              className="btn"
              href={buildWa(c["geral.whatsapp"], "Olá! Quero falar com a unidade Miranda Reis.")}
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
          <div className="editorial-copy">
            <span className="kicker dark-kicker">Unidade renovada</span>
            <h2>Uma loja preparada para você escolher com mais conforto.</h2>
            <p>
              Em 2025, nossa unidade do Centro passou a atender na Rua Miranda
              Reis. O novo espaço amplia a variedade exposta, facilita a
              comparação de produtos e oferece uma jornada de compra mais
              confortável.
            </p>
            <div className="service-points compact">
              <article>
                <i>✦</i>
                <div>
                  <h3>Showroom de iluminação</h3>
                  <p>Veja peças acesas e compare estilos.</p>
                </div>
              </article>
              <article>
                <i>◌</i>
                <div>
                  <h3>Atendimento especializado</h3>
                  <p>Orientação para obras e projetos.</p>
                </div>
              </article>
            </div>
          </div>
          <div className="editorial-media unit-media">
            <Image
              className="editorial-main"
              src="/img/miranda-2.webp"
              alt="Interior da unidade Miranda Reis"
              width={1280}
              height={818}
            />
            <Image
              className="editorial-float"
              src="/img/miranda-5.webp"
              alt="Produtos da unidade Miranda Reis"
              width={626}
              height={417}
            />
          </div>
        </div>
      </section>
      <section className="section soft-section" id="galeria">
        <div className="container">
          <div className="section-heading centered">
            <span className="kicker dark-kicker">Galeria da unidade</span>
            <h2>Conheça a Miranda Reis por dentro.</h2>
          </div>
          <div className="gallery-modern">
            {GALLERY.map(([src, alt]) => {
              const dims =
                GALLERY_DIMS[src.split("/img/")[1].replace(".webp", "")] ??
                GALLERY_DIMS["miranda-1"];
              return (
                <Image
                  key={src}
                  src={src}
                  alt={alt}
                  width={dims.width}
                  height={dims.height}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
