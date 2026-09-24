import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import PostForm from "../post-form";

/** Edição de artigo. */
export default async function EditarPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <>
      <header className="admin-page-head">
        <div>
          <Link className="admin-back" href="/admin/blog">
            ← Voltar ao blog
          </Link>
          <h1>Editar artigo</h1>
          <p className="admin-sub">
            {post.published ? (
              <>
                Publicado em <code>/blog/{post.slug}</code> —{" "}
                <Link href={`/blog/${post.slug}`} target="_blank" rel="noopener">
                  ver no site ↗
                </Link>
              </>
            ) : (
              "Este artigo está como rascunho — marque “Publicar no site” para exibi-lo."
            )}
          </p>
        </div>
      </header>

      {created && (
        <p className="admin-alert admin-alert-ok">
          ✓ Artigo criado com sucesso. Continue editando se quiser ajustar algo.
        </p>
      )}

      <div className="admin-panel">
        <PostForm post={post} />
      </div>
    </>
  );
}
