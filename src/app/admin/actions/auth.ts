"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  endSession,
  hashPassword,
  needsSetup,
  startSession,
  verifyPassword,
} from "@/lib/auth";

export type AuthState = { error?: string };

/** Criação da senha no PRIMEIRO acesso (bloqueada se já existir admin). */
export async function setupAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!(await needsSetup())) {
    return { error: "O acesso já foi configurado. Faça login com a sua senha." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (name.length < 2) return { error: "Informe seu nome." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Informe um e-mail válido." };
  }
  if (password.length < 8) {
    return { error: "A senha deve ter pelo menos 8 caracteres." };
  }
  if (password !== confirm) return { error: "As senhas não conferem." };

  const existing = await db.adminUser.findUnique({ where: { email } });
  if (existing) {
    return { error: "Este e-mail já está em uso." };
  }

  const admin = await db.adminUser.create({
    data: { name, email, passwordHash: hashPassword(password) },
  });

  await startSession(admin.id);
  redirect("/admin/painel");
}

/** Login com e-mail + senha. */
export async function loginAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Informe e-mail e senha." };

  const admin = await db.adminUser.findUnique({ where: { email } });
  if (!admin || !verifyPassword(password, admin.passwordHash)) {
    return { error: "E-mail ou senha incorretos." };
  }

  await startSession(admin.id);
  redirect("/admin/painel");
}

/** Logout. */
export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}
