import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/site-utils";
import { togglePostAction, deletePostAction } from "../../actions/posts";

/** Listagem de artigos do blog. */
export default async function BlogAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const posts = await db.blogPost.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <>
      <header className="admin-page-head">
        <div>
          <h1>Blog</h1>
          <p className="admin-sub">
            {posts.length} artigo(s) — os artigos publicados aparecem no site em
            /blog e no sitemap do Google.
          </p>
        </div>
        <Link className="admin-btn admin-btn-primary" href="/admin/blog/novo">
          + Novo artigo
        </Link>
      </header>

      {saved && <p className="admin-alert admin-alert-ok">✓ Artigo salvo com sucesso.</p>}
      {deleted && <p className="admin-alert">Artigo excluído.</p>}

      <div className="admin-panel">
        <table className="admin-table admin-table-posts">
          <thead>
            <tr>
              <th>Artigo</th>
              <th>Status</th>
              <th>Publicado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <Link className="post-title-link" href={`/admin/blog/${post.id}`}>
                    {post.title}
                  </Link>
                  <small>/blog/{post.slug}</small>
                </td>
                <td>
                  <span className={`badge ${post.published ? "badge-on" : "badge-off"}`}>
                    {post.published ? "Publicado" : "Rascunho"}
                  </span>
                </td>
                <td>{formatDate(post.publishedAt)}</td>
                <td>
                  <div className="row-actions">
                    <Link className="admin-btn admin-btn-small" href={`/admin/blog/${post.id}`}>
                      Editar
                    </Link>
                    <form action={togglePostAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <button className="admin-btn admin-btn-small" type="submit">
                        {post.published ? "Despublicar" : "Publicar"}
                      </button>
                    </form>
                    <form action={deletePostAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <button className="admin-btn admin-btn-small admin-btn-danger" type="submit">
                        Excluir
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="admin-empty">
                  Nenhum artigo ainda — crie o primeiro em “+ Novo artigo”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
