"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export type PostState = { error?: string };

function readPostForm(formData: FormData) {
  // slugInput é separado — não é coluna do banco (vira "slug" após slugify).
  const { "slug": slugRaw, ...rest } = Object.fromEntries(formData.entries());
  const str = (v: unknown) => String(v ?? "").trim();
  return {
    slugInput: str(slugRaw),
    post: {
      title: str(rest.title),
      excerpt: str(rest.excerpt),
      content: str(rest.content),
      metaTitle: str(rest.metaTitle) || null,
      metaDescription: str(rest.metaDescription) || null,
      keywords: str(rest.keywords) || null,
      coverImage: str(rest.coverImage) || null,
      published: rest.published === "on",
    },
  };
}

/** Cria um artigo. */
export async function createPostAction(
  _prev: PostState,
  formData: FormData
): Promise<PostState> {
  await requireAdmin();
  const { slugInput, post } = readPostForm(formData);

  if (post.title.length < 5) return { error: "Informe um título com pelo menos 5 caracteres." };
  if (post.excerpt.length < 10) return { error: "Escreva um resumo (aparece na listagem e no Google)." };
  if (post.content.length < 50) return { error: "O artigo está muito curto (mínimo 50 caracteres)." };

  let slug = slugify(slugInput || post.title);
  if (await db.blogPost.findUnique({ where: { slug } })) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  const created = await db.blogPost.create({
    data: { ...post, slug, publishedAt: new Date() },
  });

  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  redirect(`/admin/blog/${created.id}?created=1`);
}

/** Atualiza um artigo existente. */
export async function updatePostAction(
  _prev: PostState,
  formData: FormData
): Promise<PostState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { slugInput, post } = readPostForm(formData);

  const current = await db.blogPost.findUnique({ where: { id } });
  if (!current) return { error: "Artigo não encontrado." };

  if (post.title.length < 5) return { error: "Informe um título com pelo menos 5 caracteres." };
  if (post.excerpt.length < 10) return { error: "Escreva um resumo (aparece na listagem e no Google)." };
  if (post.content.length < 50) return { error: "O artigo está muito curto (mínimo 50 caracteres)." };

  let slug = slugify(slugInput || post.title);
  const clash = await db.blogPost.findUnique({ where: { slug } });
  if (clash && clash.id !== id) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  await db.blogPost.update({ where: { id }, data: { ...post, slug } });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  redirect(`/admin/blog?saved=1`);
}

/** Publica / despublica (usado na listagem). */
export async function togglePostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const post = await db.blogPost.findUnique({ where: { id } });
  if (post) {
    await db.blogPost.update({
      where: { id },
      data: { published: !post.published },
    });
    revalidatePath("/blog");
  }
  redirect("/admin/blog");
}

/** Exclui o artigo. */
export async function deletePostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await db.blogPost.delete({ where: { id } }).catch(() => {});
  revalidatePath("/blog");
  redirect("/admin/blog?deleted=1");
}
