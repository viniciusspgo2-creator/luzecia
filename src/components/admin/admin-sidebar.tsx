"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions/auth";

const NAV = [
  { href: "/admin/painel", label: "Visão geral", icon: "◧" },
  { href: "/admin/conteudo", label: "Textos do site", icon: "✎" },
  { href: "/admin/blog", label: "Blog", icon: "✦" },
  { href: "/admin/seo", label: "SEO e Google", icon: "◎" },
];

/** Navegação lateral do painel (client para destacar a rota ativa). */
export default function AdminSidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (href !== "/admin/painel" && pathname.startsWith(href));

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <img src="/img/logo.png" alt="Luz & Cia" width={914} height={290} />
        <span>Painel do site</span>
      </div>

      <nav aria-label="Navegação do painel">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-link${isActive(item.href) ? " active" : ""}`}
          >
            <i aria-hidden="true">{item.icon}</i>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="admin-user">
        <b>{name}</b>
        <small>{email}</small>
        <form action={logoutAction}>
          <button className="admin-btn admin-btn-ghost" type="submit">
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
