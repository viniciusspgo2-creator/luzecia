import { redirect } from "next/navigation";
import { needsSetup } from "@/lib/auth";
import LoginForm from "./login-form";

/** Login do painel (aparece após o primeiro acesso configurado). */
export default async function LoginPage() {
  if (await needsSetup()) redirect("/admin/setup");

  return (
    <div className="admin-gate">
      <div className="admin-gate-card">
        <span className="admin-gate-badge">Luz &amp; Cia · Painel</span>
        <h1>Acessar o painel</h1>
        <p>Entre com o e-mail e a senha cadastrados no primeiro acesso.</p>
        <LoginForm />
        <a className="admin-gate-back" href="/">
          ← Voltar ao site
        </a>
      </div>
    </div>
  );
}
