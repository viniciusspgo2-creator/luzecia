"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { SEO_PAGES } from "@/lib/seo";
import { requireAdmin } from "@/lib/auth";

export type SeoState = { ok?: boolean; error?: string };

/** Salva título/descrição/keywords/ogImage por página (vazio → padrão). */
export async function saveSeoAction(
  _prev: SeoState,
  formData: FormData
): Promise<SeoState> {
  await requireAdmin();

  try {
    for (const { key } of SEO_PAGES) {
      const data = {
        title: String(formData.get(`${key}__title`) ?? "").trim() || null,
        description: String(formData.get(`${key}__description`) ?? "").trim() || null,
        keywords: String(formData.get(`${key}__keywords`) ?? "").trim() || null,
        ogImage: String(formData.get(`${key}__ogImage`) ?? "").trim() || null,
      };

      if (!data.title && !data.description && !data.keywords && !data.ogImage) {
        // Tudo vazio → remove override (a página usa os padrões)
        await db.seoPage.delete({ where: { page: key } }).catch(() => {});
        continue;
      }

      await db.seoPage.upsert({
        where: { page: key },
        create: { page: key, ...data },
        update: data,
      });
    }

    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { error: "Não foi possível salvar. Tente novamente." };
  }
}
