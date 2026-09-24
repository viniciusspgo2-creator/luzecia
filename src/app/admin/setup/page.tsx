import { redirect } from "next/navigation";
import { needsSetup } from "@/lib/auth";
import SetupForm from "./setup-form";

/**
 * PRIMEIRO ACESSO — criação da senha do painel.
 * Depois que o admin existe, esta tela é bloqueada permanentemente.
 */
export default async function SetupPage() {
  if (!(await needsSetup())) redirect("/admin/login");

  return (
    <div className="admin-gate">
      <div className="admin-gate-card">
        <span className="admin-gate-badge">Luz &amp; Cia · Painel</span>
        <h1>Crie o acesso do painel</h1>
        <p>
          Este é o primeiro acesso. Defina abaixo o usuário administrador e a
          senha que você usará para gerenciar o site. Esta tela aparece uma
          única vez.
        </p>
        <SetupForm />
        <a className="admin-gate-back" href="/">
          ← Voltar ao site
        </a>
      </div>
    </div>
  );
}
