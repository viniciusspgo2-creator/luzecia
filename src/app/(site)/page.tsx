import Image from "next/image";
import Link from "next/link";
import FaqList from "@/components/faq-list";
import JsonLd from "@/components/json-ld";
import { getSiteContent } from "@/lib/content";
import { buildWa } from "@/lib/site-utils";
import { pageMetadata } from "@/lib/seo";
import { localBusinessSchema, faqSchema } from "@/lib/schema";

/**
 * Página inicial — tradução 1:1 de index.php.
 * Estrutura, ordem de seções, classes CSS e imagens aprovadas preservadas.
 * Os textos agora vêm do banco e podem ser alterados em /admin/conteudo.
 */
export async function generateMetadata() {
  return pageMetadata("home");
}

export default async function HomePage() {
  const c = await getSiteContent();
  const waHero = buildWa(c["geral.whatsapp"], "Olá! Quero ajuda para escolher materiais para minha obra ou projeto.");
  const waCard = buildWa(c["geral.whatsapp"], "Olá! Gostaria de uma orientação especializada para meu projeto.");
  const waCategorias = buildWa(c["geral.whatsapp"], "Olá! Quero orientação técnica para escolher produtos para meu projeto.");
  const waOrcamento = buildWa(c["geral.whatsapp"], "Olá! Quero solicitar um orçamento para minha obra.");

  const partners: Array<[string, string]> = [
    ["nordecor.png", "Nordecor"],
    ["lo1.png", "Lorenzetti"],
    ["tramontina.png", "Tramontina"],
    ["doc.png", "Docol"],
    ["soprano.png", "Soprano"],
    ["fewgf.png", "Itamonte"],
  ];

  return (
    <>
      {/* Dados estruturados: as duas lojas (rich result de local) + FAQ da home */}
      <JsonLd
        data={[
          localBusinessSchema("miranda-reis", c["geral.nome_site"]),
          localBusinessSchema("coxipo", c["geral.nome_site"]),
          faqSchema(),
        ]}
      />

      <section className="home-hero">
        <div className="hero-shade"></div>
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="kicker">{c["home.hero_kicker"]}</span>
            <h1>{c["home.hero_titulo"]}</h1>
            <p>{c["home.hero_texto"]}</p>
            <div className="button-row">
              <a className="btn" href={waHero} target="_blank" rel="noopener">
                {c["home.hero_cta1"]}
              </a>
              <a className="btn btn-ghost" href="#solucoes">
                {c["home.hero_cta2"]}
              </a>
            </div>
            <div className="hero-trust">
              <span>
                <b>35+</b> anos de mercado
              </span>
              <span>
                <b>2</b> unidades em Cuiabá
              </span>
              <span>
                <b>Consultoria</b> luminotécnica
              </span>
            </div>
          </div>
          <aside className="hero-card">
            <span className="hero-card-label">{c["home.card_label"]}</span>
            <h3>{c["home.card_titulo"]}</h3>
            <p>{c["home.card_texto"]}</p>
            <a href={waCard} target="_blank" rel="noopener">
              Receber orientação <b>↗</b>
            </a>
          </aside>
        </div>
      </section>

      <section className="confidence-strip" aria-label="Diferenciais Luz & Cia">
        <div className="container confidence-grid">
          <div>
            <span>01</span>
            <b>Curadoria de produtos</b>
            <small>Qualidade e variedade para cada etapa.</small>
          </div>
          <div>
            <span>02</span>
            <b>Atendimento próximo</b>
            <small>Orientação clara para comprar melhor.</small>
          </div>
          <div>
            <span>03</span>
            <b>Entrega ágil</b>
            <small>Cuiabá e Várzea Grande.</small>
          </div>
          <div>
            <span>04</span>
            <b>Soluções completas</b>
            <small>Elétrica, hidráulica e iluminação.</small>
          </div>
        </div>
      </section>

      <section className="section intro-section" id="solucoes">
        <div className="container split-editorial">
          <div className="editorial-media">
            <Image
              className="editorial-main"
              src="/img/miranda-2.webp"
              alt="Interior da Luz & Cia com materiais elétricos e iluminação"
              width={1280}
              height={818}
            />
            <Image
              className="editorial-float"
              src="/img/consultoria.webp"
              alt="Consultoria especializada em iluminação"
              width={450}
              height={300}
            />
            <div className="experience-badge">
              <b>Desde 1991</b>
              <span>experiência que orienta escolhas</span>
            </div>
          </div>
          <div className="editorial-copy">
            <span className="kicker dark-kicker">{c["home.sobre_kicker"]}</span>
            <h2>{c["home.sobre_titulo"]}</h2>
            <p>{c["home.sobre_texto"]}</p>
            <div className="service-points">
              <article>
                <i>✦</i>
                <div>
                  <h3>Consultoria em iluminação</h3>
                  <p>Projetos luminotécnicos e escolhas que valorizam cada espaço.</p>
                </div>
              </article>
              <article>
                <i>◌</i>
                <div>
                  <h3>Atendimento personalizado</h3>
                  <p>Orientação prática para evitar dúvidas, desperdícios e compras erradas.</p>
                </div>
              </article>
              <article>
                <i>↗</i>
                <div>
                  <h3>Entrega rápida</h3>
                  <p>Agilidade em Cuiabá e Várzea Grande, direto na sua obra.</p>
                </div>
              </article>
            </div>
            <Link className="text-link" href="/sobre">
              Conhecer nossa história <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section categories-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="kicker dark-kicker">{c["home.categorias_kicker"]}</span>
            <h2>{c["home.categorias_titulo"]}</h2>
            <p>{c["home.categorias_texto"]}</p>
          </div>
          <div className="category-grid">
            <article className="category-card category-large">
              <Image
                src="/img/decoracao.webp"
                alt="Iluminação decorativa na Luz & Cia"
                width={1800}
                height={843}
              />
              <div className="category-overlay">
                <span>Iluminação</span>
                <h3>Peças que criam atmosfera e personalidade.</h3>
                <p>Pendentes, plafons, arandelas, perfis e luminárias.</p>
              </div>
            </article>
            <article className="category-card">
              <Image
                src="/img/coxipo-4.webp"
                alt="Materiais elétricos na Luz & Cia"
                width={1800}
                height={832}
              />
              <div className="category-overlay">
                <span>Elétrica</span>
                <h3>Segurança e eficiência em cada instalação.</h3>
                <p>Cabos, disjuntores, tomadas e quadros.</p>
              </div>
            </article>
            <article className="category-card">
              <Image
                src="/img/hidraulica.webp"
                alt="Materiais hidráulicos na Luz & Cia"
                width={382}
                height={510}
              />
              <div className="category-overlay">
                <span>Hidráulica</span>
                <h3>Soluções confiáveis para sua obra.</h3>
                <p>Conexões, torneiras e acessórios.</p>
              </div>
            </article>
            <article className="category-card category-consult">
              <div>
                <span>Consultoria</span>
                <h3>Seu projeto pede uma escolha mais técnica?</h3>
                <p>Converse com nossa equipe e receba orientação especializada.</p>
              </div>
              <a href={waCategorias} target="_blank" rel="noopener">
                Falar agora ↗
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="section dark-showcase">
        <div className="container showcase-grid">
          <div className="showcase-copy">
            <span className="kicker">{c["home.showcase_kicker"]}</span>
            <h2>{c["home.showcase_titulo"]}</h2>
            <p>{c["home.showcase_texto"]}</p>
            <div className="showcase-stats">
              <div>
                <b>35+</b>
                <span>anos de experiência</span>
              </div>
              <div>
                <b>2</b>
                <span>lojas em Cuiabá</span>
              </div>
              <div>
                <b>3</b>
                <span>segmentos completos</span>
              </div>
            </div>
            <a className="btn" href={waOrcamento} target="_blank" rel="noopener">
              Solicitar orçamento
            </a>
          </div>
          <div className="showcase-gallery">
            <Image
              className="sg-one"
              src="/img/ambiente.webp"
              alt="Fachada de unidade Luz & Cia"
              width={680}
              height={510}
            />
            <Image
              className="sg-two"
              src="/img/about-2.webp"
              alt="Espaço de atendimento Luz & Cia"
              width={720}
              height={1280}
            />
            <Image
              className="sg-three"
              src="/img/about-3.webp"
              alt="Produtos de iluminação e materiais elétricos"
              width={450}
              height={300}
            />
          </div>
        </div>
      </section>

      <section className="section units-home">
        <div className="container">
          <div className="section-heading units-heading">
            <div>
              <span className="kicker dark-kicker">Nossas unidades</span>
              <h2>{c["home.unidades_titulo"]}</h2>
            </div>
            <p>{c["home.unidades_texto"]}</p>
          </div>
          <div className="unit-grid-new">
            <Link className="unit-card-new" href="/miranda-reis">
              <Image
                src="/img/miranda-3.webp"
                alt="Fachada da unidade Miranda Reis"
                width={1280}
                height={960}
              />
              <div className="unit-card-content">
                <span>Unidade Centro</span>
                <h3>Miranda Reis</h3>
                <p>
                  Loja ampla, moderna e preparada para uma experiência de compra
                  completa.
                </p>
                <b>Ver fotos da unidade →</b>
              </div>
            </Link>
            <Link className="unit-card-new" href="/coxipo">
              <Image
                src="/img/coxipo-fachada.webp"
                alt="Fachada da unidade Coxipó"
                width={720}
                height={1280}
              />
              <div className="unit-card-content">
                <span>Unidade Coxipó</span>
                <h3>Coxipó</h3>
                <p>Tradição, variedade e atendimento especializado para a região.</p>
                <b>Ver fotos da unidade →</b>
              </div>
            </Link>
          </div>
          <div className="units-shortcuts">
            <Link href="/unidades">Comparar unidades</Link>
            <Link href="/contato">Ver endereço e contato</Link>
          </div>
        </div>
      </section>

      <section className="partners-section">
        <div className="container partners-shell">
          <div className="partners-copy">
            <span className="kicker">Marcas parceiras</span>
            <h2>{c["home.marcas_titulo"]}</h2>
            <p>{c["home.marcas_texto"]}</p>
          </div>
          <div className="partners-grid">
            {partners.map(([file, name]) => (
              <div className="partner-logo" key={file}>
                <img src={`/img/partners/${file}`} alt={name} />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section yellow-teaser">
        <div className="container yellow-grid">
          <div className="yellow-image">
            <Image
              src="/img/social.webp"
              alt="Projeto social Yellow Week Luz & Cia"
              width={1200}
              height={1200}
              style={{ width: "100%", height: "auto" }}
            />
            <span>Projeto social Luz & Cia</span>
          </div>
          <div className="yellow-copy">
            <span className="kicker dark-kicker">Yellow Week</span>
            <h2>{c["home.yellow_titulo"]}</h2>
            <p>{c["home.yellow_texto"]}</p>
            <Link className="btn btn-dark" href="/yellow-week">
              Conhecer o projeto
            </Link>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container faq-layout">
          <div className="faq-title">
            <span className="kicker dark-kicker">Dúvidas frequentes</span>
            <h2>{c["home.faq_titulo"]}</h2>
            <p>{c["home.faq_texto"]}</p>
            <Link className="text-link" href="/contato">
              Ainda tem dúvidas? Fale conosco →
            </Link>
          </div>
          <FaqList />
        </div>
      </section>
    </>
  );
}
