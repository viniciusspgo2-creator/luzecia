"use client";

import { useActionState } from "react";
import { saveSeoAction, type SeoState } from "../../actions/seo";

type SeoEntry = {
  key: string;
  label: string;
  values: { title: string; description: string; keywords: string; ogImage: string };
};

const initial: SeoState = {};

/**
 * Dirty-tracking: no envio, campos inalterados são desabilitados por um
 * instante — assim só o que o administrador realmente editou é gravado,
 * e as demais páginas continuam herdando do bloco "Global".
 */
function handleDirtySubmit(event: React.FormEvent<HTMLFormElement>) {
  const form = event.currentTarget;
  for (const el of Array.from(form.elements)) {
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      if (el.name) el.disabled = el.value === el.defaultValue;
    }
  }
  setTimeout(() => {
    for (const el of Array.from(form.elements)) {
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        el.disabled = false;
      }
    }
  }, 150);
}

export default function SeoForm({ pages }: { pages: SeoEntry[] }) {
  const [state, formAction, pending] = useActionState(saveSeoAction, initial);

  return (
    <form action={formAction} onSubmit={handleDirtySubmit} className="admin-form admin-form-wide">
      {pages.map(({ key, label, values }, index) => (
        <details className="admin-collapse" open={index === 0} key={key}>
          <summary>{label}</summary>
          <div className="admin-collapse-body">
            <label>
              <span>Título (até 60 caracteres)</span>
              <input
                name={`${key}__title`}
                type="text"
                maxLength={80}
                defaultValue={values.title}
                placeholder="Ex.: Luz & Cia | Elétrica, Hidráulica e Iluminação"
              />
            </label>
            <label>
              <span>Descrição (até 155 caracteres)</span>
              <textarea
                name={`${key}__description`}
                rows={2}
                maxLength={200}
                defaultValue={values.description}
                placeholder="Resumo que aparece no resultado de busca do Google."
              />
            </label>
            <label>
              <span>Palavras-chave (separadas por vírgula)</span>
              <input
                name={`${key}__keywords`}
                type="text"
                defaultValue={values.keywords}
                placeholder="elétrica cuiabá, iluminação, hidráulica"
              />
            </label>
            <label>
              <span>Imagem de compartilhamento (URL, opcional)</span>
              <input
                name={`${key}__ogImage`}
                type="url"
                defaultValue={values.ogImage}
                placeholder="https://.../imagem.png"
              />
            </label>
          </div>
        </details>
      ))}

      <div className="admin-savebar">
        {state.ok && <span className="admin-saved">✓ Configurações de SEO salvas</span>}
        {state.error && <span className="admin-form-error">{state.error}</span>}
        <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar configurações"}
        </button>
      </div>
    </form>
  );
}
