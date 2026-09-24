import Link from "next/link";
import { buildTel, buildWa, type SiteChrome } from "@/lib/site-utils";

/**
 * Rodapé — tradução 1:1 de includes/footer.php (Server Component).
 * Textos e contatos agora alimentados pelo painel de administração.
 */
export default function SiteFooter({ site }: { site: SiteChrome }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <img src="/img/logo.png" alt="Luz & Cia" width={914} height={290} />
          <p>{site.footerText}</p>
          <a
            className="footer-wa"
            href={buildWa(site.whatsapp, "Olá! Quero atendimento da Luz & Cia.")}
            target="_blank"
            rel="noopener"
          >
            Conversar no WhatsApp →
          </a>
        </div>
        <div>
          <h4>Navegação</h4>
          <Link href="/">Início</Link>
          <Link href="/sobre">Sobre nós</Link>
          <Link href="/unidades">Nossas unidades</Link>
          <Link href="/yellow-week">Yellow Week</Link>
          <Link href="/blog">Blog</Link>
        </div>
        <div>
          <h4>Unidades</h4>
          <Link href="/miranda-reis">Miranda Reis</Link>
          <Link href="/coxipo">Coxipó</Link>
          <Link href="/contato">Como chegar</Link>
        </div>
        <div>
          <h4>Atendimento</h4>
          <a href={buildTel(site.phoneDisplay)}>{site.phoneDisplay}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <p>
            {site.hoursWeekday}
            <br />
            {site.hoursSaturday}
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {year} {site.name}. Todos os direitos reservados.
        </span>
        <span>{site.footerTagline}</span>
      </div>
    </footer>
  );
}
