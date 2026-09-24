/**
 * Renderizador de dados estruturados Schema.org (JSON-LD).
 * Aceita um objeto ou uma lista — listas são empacotadas em @graph
 * com um único @context (padrão recomendado pelo Google).
 *
 * Uso (Server Component — qualquer página/layout):
 *   <JsonLd data={faqSchema()} />
 *   <JsonLd data={[localBusinessSchema("miranda-reis"), breadcrumbSchema(items)]} />
 *
 * O `<` é escapado para evitar quebra do JSON e injeção de tags no script.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const json = Array.isArray(data)
    ? JSON.stringify({ "@context": "https://schema.org", "@graph": data })
    : JSON.stringify({ "@context": "https://schema.org", ...data });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
    />
  );
}
