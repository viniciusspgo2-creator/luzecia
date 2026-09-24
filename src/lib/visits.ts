import "server-only";
import { db } from "@/lib/db";

/** Fuso do site (Cuiabá-MT) para agregar visitas por dia local. */
const TZ = "America/Cuiaba";

/** Data local no formato YYYY-MM-DD. */
export function localDay(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(date); // en-CA → yyyy-mm-dd
}

/** Registra uma visualização (agregado por dia + por rota). */
export async function recordVisit(path: string): Promise<void> {
  const day = localDay();
  await db.$transaction([
    db.visitDay.upsert({
      where: { day },
      create: { day, views: 1 },
      update: { views: { increment: 1 } },
    }),
    db.visitPath.upsert({
      where: { path },
      create: { path, views: 1 },
      update: { views: { increment: 1 }, lastView: new Date() },
    }),
  ]);
}

export type VisitStats = {
  total: number;
  today: number;
  yesterday: number;
  last7: number;
  daily: Array<{ day: string; views: number }>; // últimos 14 dias (preenchidos)
  topPages: Array<{ path: string; views: number }>;
  uniquePaths: number;
};

/** Estatísticas para o painel. */
export async function getVisitStats(): Promise<VisitStats> {
  const today = localDay();
  const yesterday = localDay(new Date(Date.now() - 24 * 60 * 60 * 1000));

  const [allDays, topRows] = await Promise.all([
    db.visitDay.findMany({ orderBy: { day: "asc" } }),
    db.visitPath.findMany({ orderBy: { views: "desc" }, take: 8 }),
  ]);

  const byDay = new Map(allDays.map((r) => [r.day, r.views]));
  const total = allDays.reduce((sum, r) => sum + r.views, 0);

  // Últimos 14 dias sempre preenchidos (para o gráfico).
  const daily: Array<{ day: string; views: number }> = [];
  for (let i = 13; i >= 0; i--) {
    const d = localDay(new Date(Date.now() - i * 24 * 60 * 60 * 1000));
    daily.push({ day: d, views: byDay.get(d) ?? 0 });
  }

  const last7 = daily.slice(-7).reduce((sum, d) => sum + d.views, 0);

  return {
    total,
    today: byDay.get(today) ?? 0,
    yesterday: byDay.get(yesterday) ?? 0,
    last7,
    daily,
    topPages: topRows.map((r) => ({ path: r.path, views: r.views })),
    uniquePaths: await db.visitPath.count(),
  };
}
