import type { Metadata } from "next";
import Image from "next/image";
import { getSiteContent } from "@/lib/content";
import { buildWa } from "@/lib/site-utils";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("sobre", "Sobre nós");
}

/** Página Sobre — estrutura 1:1 de sobre.php; textos gerenciáveis no painel. */
export default async function SobrePage() {
  const c = await getSiteContent();

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">Quem somos</span>
          <h1>{c["sobre.banner_titulo"]}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <div className="reveal">
            <span className="eyebrow">Nossa história</span>
            <h2>{c["sobre.historia_titulo"]}</h2>
            <p>{c["sobre.historia_texto1"]}</p>
            <p>{c["sobre.historia_texto2"]}</p>
            <a
              className="btn"
              href={buildWa(c["geral.whatsapp"], "Olá! Quero conhecer melhor as soluções da Luz & Cia.")}
              target="_blank"
              rel="noopener"
            >
              Fale com nossa equipe
            </a>
          </div>
          <div className="media-stack reveal">
            <Image
              src="/img/about-1.webp"
              alt="Loja Luz e Cia"
              width={450}
              height={300}
            />
            <Image
              src="/img/about-2.webp"
              alt="Iluminação decorativa"
              width={720}
              height={1280}
            />
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Essência da marca</span>
              <h2>O que orienta cada atendimento</h2>
            </div>
          </div>
          <div className="cards">
            <article className="card">
              <h3>Nossa Visão</h3>
              <p>
                Ser a principal escolha em elétrica, hidráulica e iluminação,
                unindo inovação, segurança e excelência.
              </p>
            </article>
            <article className="card">
              <h3>Nossa Missão</h3>
              <p>
                Oferecer materiais e soluções confiáveis com atendimento
                especializado e consultoria.
              </p>
            </article>
            <article className="card">
              <h3>Nossos Valores</h3>
              <p>
                Qualidade, respeito, ética, confiança e dedicação em cada
                negociação.
              </p>
            </article>
            <article className="card">
              <h3>Nossa Experiência</h3>
              <p>
                Uma jornada construída com evolução, proximidade e compromisso
                com cada projeto.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="section dark">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Serviços e produtos</span>
              <h2>Especialistas em soluções completas para sua obra</h2>
            </div>
          </div>
          <div className="cards">
            <article className="card">
              <h3>Materiais Elétricos</h3>
              <p>Cabos, disjuntores, tomadas e soluções seguras.</p>
            </article>
            <article className="card">
              <h3>Hidráulica</h3>
              <p>Conectores, torneiras e acessórios confiáveis.</p>
            </article>
            <article className="card">
              <h3>Iluminação Decorativa</h3>
              <p>Pendentes, arandelas e luminárias que valorizam ambientes.</p>
            </article>
            <article className="card">
              <h3>Projetos Luminotécnicos</h3>
              <p>Consultoria para ambientes funcionais e inspiradores.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
