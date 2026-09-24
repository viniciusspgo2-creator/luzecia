"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Contador de visitas — beacon leve no client.
 * - Ignora rotas /admin e /api
 * - Deduplica a mesma rota por 30 min (sessionStorage) para não
 *   inflar o contador em navegações repetidas da mesma sessão.
 */
const DEDUPE_MS = 30 * 60 * 1000;

export default function VisitTracker() {
  const pathname = usePathname();
  const lastRecorded = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    // Evita registro duplicado no mesmo pathname já contabilizado.
    if (lastRecorded.current === pathname) return;

    const key = `lc_v:${pathname}`;
    const now = Date.now();
    try {
      const previous = Number(sessionStorage.getItem(key) ?? 0);
      if (previous && now - previous < DEDUPE_MS) return;
      sessionStorage.setItem(key, String(now));
    } catch {
      // sessionStorage indisponível — segue sem dedupe.
    }

    lastRecorded.current = pathname;
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {
      // Falha silenciosa: contador nunca deve atrapalhar a navegação.
    });
  }, [pathname]);

  return null;
}
