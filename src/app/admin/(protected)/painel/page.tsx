import Link from "next/link";
import { getVisitStats } from "@/lib/visits";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/site-utils";
import { requireAdmin } from "@/lib/auth";

/** Painel inicial — contador de visitas e resumo do site. */
export default async function PainelPage() {
  const [admin, stats, posts] = await Promise.all([
    requireAdmin(),
    getVisitStats(),
    db.blogPost.findMany({ orderBy: { updatedAt: "desc" }, take: 4 }),
  ]);

  const peak = Math.max(1, ...stats.daily.map((d) => d.views));
  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Cuiaba",
  }).format(new Date());

  return (
    <>
      <header className="admin-page-head">
        <div>
          <h1>Olá, {admin.name.split(" ")[0]} 👋</h1>
          <p className="admin-sub">{today} — aqui está o resumo do site.</p>
        </div>
        <Link className="admin-btn admin-btn-primary" href="/admin/conteudo">
          Editar textos do site
        </Link>
      </header>

      {/* Contador de visitas */}
      <section className="stat-grid" aria-label="Contador de visitas">
        <div className="stat-card">
          <span>Visitas hoje</span>
          <b>{stats.today}</b>
        </div>
        <div className="stat-card">
          <span>Ontem</span>
          <b>{stats.yesterday}</b>
        </div>
        <div className="stat-card">
          <span>Últimos 7 dias</span>
          <b>{stats.last7}</b>
        </div>
        <div className="stat-card stat-card-accent">
          <span>Total de visitas</span>
          <b>{stats.total}</b>
        </div>
      </section>

      {/* Gráfico dos últimos 14 dias */}
      <section className="admin-panel">
        <div className="admin-panel-head">
          <h2>Visitas por dia</h2>
          <small>Últimos 14 dias</small>
        </div>
        <div className="bar-chart" role="img" aria-label="Gráfico de visitas por dia">
          {stats.daily.map((d) => (
            <div className="bar-col" key={d.day} title={`${d.day}: ${d.views} visita(s)`}>
              <div
                className="bar"
                style={{ height: `${Math.max(4, Math.round((d.views / peak) * 82))}%` }}
              />
              <small>{d.day.slice(8)}</small>
            </div>
          ))}
        </div>
      </section>

      <div className="admin-two-col">
        {/* Páginas mais visitadas */}
        <section className="admin-panel">
          <div className="admin-panel-head">
            <h2>Páginas mais visitadas</h2>
            <small>{stats.uniquePaths} rotas distintas</small>
          </div>
          {stats.topPages.length === 0 ? (
            <p className="admin-empty">
              Nenhuma visita registrada ainda. Os acessos aparecem aqui assim que
              o site começa a receber visitantes.
            </p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Página</th>
                  <th>Visitas</th>
                </tr>
              </thead>
              <tbody>
                {stats.topPages.map((row) => (
                  <tr key={row.path}>
                    <td>
                      <Link href={row.path} target="_blank" rel="noopener">
                        {row.path}
                      </Link>
                    </td>
                    <td>{row.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Últimos artigos */}
        <section className="admin-panel">
          <div className="admin-panel-head">
            <h2>Blog</h2>
            <Link href="/admin/blog">Gerenciar →</Link>
          </div>
          <ul className="admin-list">
            {posts.map((post) => (
              <li key={post.id}>
                <div>
                  <Link href={`/admin/blog/${post.id}`}>{post.title}</Link>
                  <small>Atualizado em {formatDate(post.updatedAt)}</small>
                </div>
                <span className={`badge ${post.published ? "badge-on" : "badge-off"}`}>
                  {post.published ? "Publicado" : "Rascunho"}
                </span>
              </li>
            ))}
            {posts.length === 0 && (
              <li className="admin-empty">
                Nenhum artigo ainda.{" "}
                <Link href="/admin/blog/novo">Criar o primeiro artigo →</Link>
              </li>
            )}
          </ul>
        </section>
      </div>
    </>
  );
}
