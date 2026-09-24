"use client";

/**
 * Cabeçalho — tradução 1:1 de includes/header.php + menu mobile de assets/js/app.js.
 * Client Component apenas pela interação do menu (regra 12): todo o resto do site
 * permanece Server Components. Os textos agora vêm do painel (props do layout).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildTel, buildWa, type SiteChrome } from "@/lib/site-utils";

const UNIT_PATHS = ["/unidades", "/miranda-reis", "/coxipo"];

export default function SiteHeader({ site }: { site: SiteChrome }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Equivalente a body.classList.toggle('menu-open') do app.js original
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  const isUnit = UNIT_PATHS.includes(pathname);
  const isActive = (href: string) => (pathname === href ? "active" : "");
  const closeMenu = () => setOpen(false);

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span>{site.topbar}</span>
          <div>
            <a href={buildTel(site.phoneDisplay)}>{site.phoneDisplay}</a>
            <i></i>
            <span>Cuiabá · MT</span>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav-shell">
          <Link
            className="brand"
            href="/"
            aria-label="Luz & Cia - Página inicial"
            onClick={closeMenu}
          >
            <img src="/img/logo.png" alt="Luz & Cia" width={914} height={290} />
          </Link>
          <nav id="main-nav" aria-label="Navegação principal">
            <Link className={isActive("/")} href="/" onClick={closeMenu}>
              Início
            </Link>
            <Link className={isActive("/sobre")} href="/sobre" onClick={closeMenu}>
              Sobre nós
            </Link>
            <Link
              className={isUnit ? "active" : ""}
              href="/unidades"
              onClick={closeMenu}
            >
              Unidades
            </Link>
            <Link
              className={isActive("/yellow-week")}
              href="/yellow-week"
              onClick={closeMenu}
            >
              Yellow Week
            </Link>
            <Link
              className={
                pathname === "/blog" || pathname.startsWith("/blog/") ? "active" : ""
              }
              href="/blog"
              onClick={closeMenu}
            >
              Blog
            </Link>
            <Link className={isActive("/contato")} href="/contato" onClick={closeMenu}>
              Contato
            </Link>
          </nav>
          <a
            className="btn btn-small header-cta"
            href={buildWa(site.whatsapp, "Olá! Quero falar com um especialista da Luz & Cia.")}
            target="_blank"
            rel="noopener"
          >
            Fale conosco
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-controls="main-nav"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
    </>
  );
}
