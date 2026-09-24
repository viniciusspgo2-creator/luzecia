"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "../actions/auth";

const initial: AuthState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className="admin-form">
      <label>
        E-mail
        <input name="email" type="email" required autoComplete="email" placeholder="voce@empresa.com.br" />
      </label>
      <label>
        Senha
        <input name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
      </label>

      {state.error && <p className="admin-form-error">{state.error}</p>}

      <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
