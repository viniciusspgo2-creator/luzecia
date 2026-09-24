import Link from "next/link";

/**
 * Página 404 — tradução 1:1 de 404.php (mesma estrutura de banner e CTA).
 */
export default function NotFound() {
  return (
    <section className="page-banner">
      <div className="container">
        <span className="eyebrow">Erro 404</span>
        <h1>Esta página não foi encontrada.</h1>
        <Link className="btn" href="/">
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
