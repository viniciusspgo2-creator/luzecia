import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

/**
 * Autenticação do painel /admin — SEM dependências externas.
 * - Senha: scrypt (node:crypto) com salt aleatório → "salt:hash"
 * - Sessão: cookie httpOnly assinado com HMAC-SHA256 (AUTH_SECRET)
 */

const COOKIE_NAME = "lc_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias
const KEY_LEN = 64;

function secret(): string {
  return process.env.AUTH_SECRET?.trim() || "luz-cia-local-dev-secret-troque-em-producao-9f2c1a";
}

/* ── Senhas ─────────────────────────────────────────────── */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LEN).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, KEY_LEN);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

/* ── Token de sessão (payload.signature, base64url) ────── */

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function createToken(adminId: string): string {
  const body = JSON.stringify({
    sub: adminId,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });
  const payload = Buffer.from(body).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function readToken(token: string): { sub: string } | null {
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      sub?: string;
      exp?: number;
    };
    if (!data.sub || !data.exp || data.exp < Math.floor(Date.now() / 1000)) return null;
    return { sub: data.sub };
  } catch {
    return null;
  }
}

/* ── API de sessão ──────────────────────────────────────── */

export async function startSession(adminId: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, createToken(adminId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export type AdminSession = { id: string; name: string; email: string };

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const data = readToken(token);
  if (!data) return null;
  const admin = await db.adminUser.findUnique({
    where: { id: data.sub },
    select: { id: true, name: true, email: true },
  });
  return admin;
}

/** Guarda de páginas protegidas: redireciona ao login se não autenticado. */
export async function requireAdmin(): Promise<AdminSession> {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** True quando ainda não existe nenhum usuário admin (fluxo de 1º acesso). */
export async function needsSetup(): Promise<boolean> {
  return (await db.adminUser.count()) === 0;
}
