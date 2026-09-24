import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL } from "@/config/site";

/**
 * Sitemap dinâmico: páginas institucionais + blog (artigos publicados
 * são adicionados automaticamente ao serem criados no painel).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/sobre",
    "/unidades",
    "/miranda-reis",
    "/coxipo",
    "/yellow-week",
    "/blog",
    "/contato",
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : route === "/blog" ? 0.9 : 0.8,
  }));

  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
      select: { slug: true, updatedAt: true },
    });
    postEntries = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Sem banco → sitemap só com rotas estáticas.
  }

  return [...staticEntries, ...postEntries];
}
