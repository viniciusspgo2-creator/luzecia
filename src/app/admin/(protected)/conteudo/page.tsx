import { CONTENT_FIELDS, CONTENT_GROUPS, getSiteContent } from "@/lib/content";
import ContentForm from "./content-form";

/** Editor de textos do site — agrupado por seção. */
export default async function ConteudoPage() {
  const content = await getSiteContent();

  const fieldsByGroup = CONTENT_GROUPS.map((group) => ({
    group,
    fields: CONTENT_FIELDS.filter((f) => f.group === group),
  })).filter((g) => g.fields.length > 0);

  return (
    <>
      <header className="admin-page-head">
        <div>
          <h1>Textos do site</h1>
          <p className="admin-sub">
            Altere os textos das páginas públicas. Deixe um campo vazio para
            voltar ao texto padrão do site. As mudanças aparecem no site na hora.
          </p>
        </div>
      </header>
      <ContentForm fieldsByGroup={fieldsByGroup} values={content} />
    </>
  );
}
