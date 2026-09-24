"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { CONTENT_FIELDS } from "@/lib/content";
import { requireAdmin } from "@/lib/auth";

export type SaveState = { ok?: boolean; error?: string };

/** Salva os textos editáveis (só as chaves alteradas). */
export async function saveContentAction(
  _prev: SaveState,
  formData: FormData
): Promise<SaveState> {
  await requireAdmin();

  try {
    const updates: Array<{ key: string; value: string }> = [];
    for (const field of CONTENT_FIELDS) {
      const raw = formData.get(field.key);
      if (raw === null) continue;
      const value = String(raw).trim();
      if (value === "") continue; // vazio → volta ao padrão do site
      updates.push({ key: field.key, value });
    }

    for (const { key, value } of updates) {
      await db.siteContent.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      });
    }

    // Remove overrides que voltaram para o vazio (usar o padrão do site)
    const providedKeys = CONTENT_FIELDS.map((f) => f.key);
    const updatedKeys = new Set(updates.map((u) => u.key));
    const stale = await db.siteContent.findMany({
      where: { key: { in: providedKeys } },
    });
    for (const row of stale) {
      if (!updatedKeys.has(row.key)) {
        await db.siteContent.delete({ where: { key: row.key } }).catch(() => {});
      }
    }

    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { error: "Não foi possível salvar. Tente novamente." };
  }
}
