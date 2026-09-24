import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/admin/admin-sidebar";

/** Layout das rotas protegidas — valida a sessão e monta a navegação. */
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="admin-frame">
      <AdminSidebar name={admin.name} email={admin.email} />
      <div className="admin-main">
        <header className="admin-topbar">
          <span className="admin-topbar-title">Gerenciar site</span>
          <a className="admin-topbar-link" href="/" target="_blank" rel="noopener">
            Ver site ↗
          </a>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
