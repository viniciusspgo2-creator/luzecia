import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/site-utils";
import { pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/json-ld";
import { blogSchema } from "@/lib/schema";
import { getSiteContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("blog", "Blog");
}

/** Blog — listagem dos artigos publicados (design tokens do site original). */
export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  const [featured, ...rest] = posts;
  const c = await getSiteContent();

  return (
    <>
      {/* Schema do blog com a lista de artigos publicados */}
      <JsonLd
        data={blogSchema(
          posts.map((p) => ({ slug: p.slug, title: p.title, publishedAt: p.publishedAt })),
          c["geral.nome_site"]
        )}
      />

      <section className="page-banner blog-banner">
        <div className="container">
          <span className="eyebrow">Blog da Luz & Cia</span>
          <h1>Dicas de iluminação, elétrica e economia de energia.</h1>
          <p>
            Guias práticos e comparativos escritos por quem atende obra e reforma
            todos os dias — para você decidir com mais segurança.
          </p>
        </div>
      </section>

      {featured && (
        <section className="section blog-section">
          <div className="container">
            <Link className="post-feature" href={`/blog/${featured.slug}`}>
              <span className="post-chip">Artigo em destaque</span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <b>Ler artigo completo →</b>
            </Link>

            {rest.length > 0 && (
              <div className="post-grid">
                {rest.map((post) => (
                  <Link className="post-card" href={`/blog/${post.slug}`} key={post.id}>
                    <time dateTime={post.publishedAt.toISOString()}>
                      {formatDate(post.publishedAt)}
                    </time>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <span className="post-more">Ler artigo →</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <section className="section blog-section">
          <div className="container">
            <p className="blog-empty">
              Em breve, novos artigos. Enquanto isso, fale com nossa equipe pelo
              WhatsApp para tirar dúvidas sobre o seu projeto.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
