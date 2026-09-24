import Link from "next/link";
import PostForm from "../post-form";

/** Criação de artigo. */
export default function NovoPostPage() {
  return (
    <>
      <header className="admin-page-head">
        <div>
          <Link className="admin-back" href="/admin/blog">
            ← Voltar ao blog
          </Link>
          <h1>Novo artigo</h1>
          <p className="admin-sub">
            Escreva o artigo e clique em criar. Ele já entra no sitemap do Google
            quando publicado.
          </p>
        </div>
      </header>
      <div className="admin-panel">
        <PostForm />
      </div>
    </>
  );
}
