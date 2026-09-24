import { SEO_PAGES, SEO_DEFAULTS, getSeoConfig } from "@/lib/seo";
import SeoForm from "./seo-form";

/** Configuração de SEO — global + por página (títulos, descrições, OG). */
export default async function SeoPage() {
  const cfg = await getSeoConfig();

  const pages = SEO_PAGES.map(({ key, label }) => ({
    key,
    label,
    values: {
      title: cfg[key]?.title ?? SEO_DEFAULTS[key]?.title ?? "",
      description: cfg[key]?.description ?? SEO_DEFAULTS[key]?.description ?? "",
      keywords: cfg[key]?.keywords ?? SEO_DEFAULTS[key]?.keywords ?? "",
      ogImage: cfg[key]?.ogImage ?? "",
    },
  }));

  return (
    <>
      <header className="admin-page-head">
        <div>
          <h1>SEO e Google</h1>
          <p className="admin-sub">
            Títulos, descrições e palavras-chave enviadas ao Google. Cada campo
            segue o padrão recomendado: título com até 60 caracteres e descrição
            com até 155. Deixe vazio para usar o padrão do site.
          </p>
        </div>
      </header>
      <SeoForm pages={pages} />
    </>
  );
}
