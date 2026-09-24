import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import LiteYouTube from "@/components/lite-youtube";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("yellow-week", "Yellow Week");
}

const VIDEO_IDS = [
  "IfKtxpfxl_Q",
  "mJF24X_WRIk",
  "Pvima9uc_Zg",
  "v8ztywYi-84",
  "Ig4zdm1MhaE",
  "99R2U7tCKkk",
];

/** Yellow Week — tradução 1:1 de yellow-week.php (galeria de 6 vídeos preservada). */
export default function YellowWeekPage() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">Projeto social</span>
          <h1>Yellow Week Luz & Cia</h1>
          <p>Descontos que brilham. Impacto que permanece.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <div>
            <span className="eyebrow">Compra com propósito</span>
            <h2>Uma campanha que transforma espaços e realidades.</h2>
            <p>
              Durante novembro, alguns produtos ganham condições especiais. Parte
              da renda arrecadada é destinada a uma instituição alinhada aos
              nossos valores: cuidado com as pessoas, responsabilidade social e
              compromisso de iluminar caminhos.
            </p>
            <p>
              A cada edição, apoiamos uma causa que precisa de atenção, porque
              acreditamos que luz também transforma realidades.
            </p>
          </div>
          <Image
            style={{
              borderRadius: 26,
              boxShadow: "var(--shadow)",
              width: "100%",
              height: "auto",
            }}
            src="/img/social.webp"
            alt="Yellow Week Luz e Cia"
            width={1200}
            height={1200}
          />
        </div>
      </section>
      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Galeria de vídeos</span>
              <h2>Histórias e impacto em movimento</h2>
            </div>
          </div>
          <div className="video-grid">
            {VIDEO_IDS.map((id) => (
              <div className="video" key={id}>
                {/* Facade: iframe só carrega ao clicar (Core Web Vitals) */}
                <LiteYouTube id={id} title="Yellow Week Luz e Cia" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
