import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { MiniMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/site-utils";
import { buildWa } from "@/lib/site-utils";
import { getSiteContent } from "@/lib/content";
import { getSeoConfig } from "@/lib/seo";
import { SITE_URL } from "@/config/site";
import { DEFAULT_OG_IMAGE, articleSchema, breadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/json-ld";

const ROBOTS_ARTICLE = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
} as const;

type Props = { params: Promise<{ slug: string }> };

/** Metadata do artigo (campos configurados no painel do blog). */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) {
    return { title: "Artigo não encontrado", robots: { index: false, follow: false } };
  }
  const cfg = await getSeoConfig();
  const siteName = "Luz & Cia";
  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt;
  // Imagem do artigo → imagem global do painel → imagem padrão da marca
  const ogImage = post.coverImage ?? cfg.global?.ogImage ?? DEFAULT_OG_IMAGE;
  const imageUrl = new URL(ogImage, SITE_URL).toString();

  return {
    title: title.replace(new RegExp(`\\s*\\|\\s*${siteName}$`), ""),
    description,
    keywords: post.keywords
      ?.split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    alternates: { canonical: `/blog/${post.slug}` },
    robots: ROBOTS_ARTICLE,
    openGraph: {
      title,
      description,
      siteName,
      locale: "pt_BR",
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [siteName],
      images: [{ url: imageUrl, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

/** Artigo do blog — conteúdo em mini-markdown seguro (React, sem innerHTML). */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const [content, related] = await Promise.all([
    getSiteContent(),
    db.blogPost.findMany({
      where: { published: true, id: { not: post.id } },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  const keywords = post.keywords
    ?.split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return (
    <>
      {/* Article Schema + Breadcrumb (rich result de artigo no Google) */}
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.metaDescription ?? post.excerpt,
            slug: post.slug,
            image: post.coverImage,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
          }),
          breadcrumbSchema([
            { name: "Início", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <article className="post-article">
        <div className="container post-article-shell">
          <nav className="post-breadcrumb" aria-label="Trilha de navegação">
            <Link href="/">Início</Link>
            <i>/</i>
            <Link href="/blog">Blog</Link>
            <i>/</i>
            <span>{post.title}</span>
          </nav>

          <header className="post-header">
            <time dateTime={post.publishedAt.toISOString()}>
              {formatDate(post.publishedAt)}
            </time>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
          </header>

          {post.coverImage && (
            <div className="post-cover">
              {/* Imagem externa configurada no painel — otimizada com layout fixo */}
              <Image
                src={post.coverImage}
                alt={post.title}
                width={1240}
                height={620}
                unoptimized
                style={{ width: "100%", height: "auto", borderRadius: "22px" }}
              />
            </div>
          )}

          <div className="post-content">
            <MiniMarkdown source={post.content} />
          </div>

          {keywords && keywords.length > 0 && (
            <div className="post-tags" aria-label="Palavras-chave">
              {keywords.map((kw) => (
                <span key={kw}>{kw}</span>
              ))}
            </div>
          )}

          <aside className="post-cta">
            <div>
              <b>Ficou com alguma dúvida sobre o seu projeto?</b>
              <p>
                Nossa equipe responde pelo WhatsApp e ajuda você a escolher os
                materiais certos — com a orientação de sempre.
              </p>
            </div>
            <a
              className="btn"
              href={buildWa(
                content["geral.whatsapp"],
                `Olá! Li o artigo "${post.title}" no site e gostaria de uma orientação.`
              )}
              target="_blank"
              rel="noopener"
            >
              Falar com especialista
            </a>
          </aside>

          {related.length > 0 && (
            <div className="post-related">
              <h2>Continue lendo</h2>
              <div className="post-grid">
                {related.map((rel) => (
                  <Link className="post-card" href={`/blog/${rel.slug}`} key={rel.id}>
                    <time dateTime={rel.publishedAt.toISOString()}>
                      {formatDate(rel.publishedAt)}
                    </time>
                    <h3>{rel.title}</h3>
                    <p>{rel.excerpt}</p>
                    <span className="post-more">Ler artigo →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
