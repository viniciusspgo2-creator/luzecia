"use client";

import { useActionState } from "react";
import { setupAction, type AuthState } from "../actions/auth";

const initial: AuthState = {};

export default function SetupForm() {
  const [state, formAction, pending] = useActionState(setupAction, initial);

  return (
    <form action={formAction} className="admin-form">
      <label>
        Seu nome
        <input name="name" type="text" required autoComplete="name" placeholder="Ex.: Maria Silva" />
      </label>
      <label>
        E-mail (será seu login)
        <input name="email" type="email" required autoComplete="email" placeholder="voce@empresa.com.br" />
      </label>
      <label>
        Senha (mínimo 8 caracteres)
        <input name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="••••••••" />
      </label>
      <label>
        Confirmar senha
        <input name="confirm" type="password" required minLength={8} autoComplete="new-password" placeholder="••••••••" />
      </label>

      {state.error && <p className="admin-form-error">{state.error}</p>}

      <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>
        {pending ? "Criando acesso..." : "Criar acesso e entrar"}
      </button>
    </form>
  );
}
