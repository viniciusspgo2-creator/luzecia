"use client";

import { useActionState } from "react";
import { saveContentAction, type SaveState } from "../../actions/content";
import type { FieldDef } from "@/lib/content";

type Grouped = { group: string; fields: FieldDef[] }[];

const initial: SaveState = {};

export default function ContentForm({
  fieldsByGroup,
  values,
}: {
  fieldsByGroup: Grouped;
  values: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(saveContentAction, initial);

  return (
    <form action={formAction} className="admin-form admin-form-wide">
      {fieldsByGroup.map(({ group, fields }) => (
        <details className="admin-collapse" open={group === "Página inicial"} key={group}>
          <summary>{group}</summary>
          <div className="admin-collapse-body">
            {fields.map((field) => (
              <label key={field.key}>
                <span>{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea name={field.key} rows={3} defaultValue={values[field.key] ?? ""} />
                ) : (
                  <input name={field.key} type="text" defaultValue={values[field.key] ?? ""} />
                )}
              </label>
            ))}
          </div>
        </details>
      ))}

      <div className="admin-savebar">
        {state.ok && <span className="admin-saved">✓ Alterações salvas e publicadas no site</span>}
        {state.error && <span className="admin-form-error">{state.error}</span>}
        <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}
