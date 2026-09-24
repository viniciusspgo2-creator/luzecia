import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("unidades", "Unidades");
}

/** Página central das unidades — tradução 1:1 de unidades.php. */
export default async function UnidadesPage() {
  return (
    <>
      <section className="page-hero page-hero-units">
        <div className="container">
          <span className="kicker">Nossas unidades</span>
          <h1>Escolha a Luz & Cia mais perto de você.</h1>
          <p>
            Duas lojas em Cuiabá, com variedade, atendimento especializado e a
            mesma confiança.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="unit-grid-new unit-grid-page">
            <Link className="unit-card-new" href="/miranda-reis">
              <Image
                src="/img/miranda-3.webp"
                alt="Unidade Miranda Reis"
                width={1280}
                height={960}
              />
              <div className="unit-card-content">
                <span>Unidade Centro</span>
                <h3>Miranda Reis</h3>
                <p>Rua Miranda Reis, 161 — Poção, Cuiabá.</p>
                <b>Acessar página e fotos →</b>
              </div>
            </Link>
            <Link className="unit-card-new" href="/coxipo">
              <Image
                src="/img/coxipo-fachada.webp"
                alt="Unidade Coxipó"
                width={720}
                height={1280}
              />
              <div className="unit-card-content">
                <span>Unidade Coxipó</span>
                <h3>Coxipó</h3>
                <p>Linha completa em elétrica, hidráulica e iluminação.</p>
                <b>Acessar página e fotos →</b>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
