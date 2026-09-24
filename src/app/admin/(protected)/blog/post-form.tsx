"use client";

import { useActionState } from "react";
import type { BlogPost } from "@prisma/client";
import { createPostAction, updatePostAction, type PostState } from "../../actions/posts";
import { slugify } from "@/lib/slug";

const initial: PostState = {};

/**
 * Formulário de artigo (novo/edição) com mini-markdown:
 *   ## Título · ### Subtítulo · - lista · **negrito**
 */
export default function PostForm({ post }: { post?: BlogPost }) {
  const isEdit = Boolean(post);
  const [state, formAction, pending] = useActionState(
    isEdit ? updatePostAction : createPostAction,
    initial
  );

  return (
    <form action={formAction} className="admin-form admin-form-wide">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="admin-grid-2">
        <label>
          Título do artigo
          <input
            name="title"
            type="text"
            required
            defaultValue={post?.title ?? ""}
            placeholder="Ex.: Como escolher a iluminação da sua sala"
          />
        </label>
        <label>
          Link (slug) — deixe vazio para gerar do título
          <input
            name="slug"
            type="text"
            defaultValue={post?.slug ?? ""}
            onChange={(e) => {
              // Normaliza visualmente; normalização final acontece no servidor.
              e.target.value = slugify(e.target.value);
            }}
            placeholder="como-escolher-a-iluminacao-da-sua-sala"
          />
        </label>
      </div>

      <label>
        Resumo — aparece na listagem e no Google (até ~160 caracteres)
        <textarea
          name="excerpt"
          rows={2}
          required
          defaultValue={post?.excerpt ?? ""}
          placeholder="Explique em 1 ou 2 frases o que o leitor vai aprender."
        />
      </label>

      <label>
        Conteúdo do artigo
        <textarea
          name="content"
          rows={16}
          required
          defaultValue={post?.content ?? ""}
          className="admin-mono"
          placeholder={"## Primeira seção do artigo\n\nEscreva aqui o texto...\n\n- item de lista\n- outro item\n\n**Dica:** use negrito para destacar."}
        />
        <small className="admin-hint">
          Formatação: <code>## Título</code> · <code>### Subtítulo</code> ·{" "}
          <code>- item de lista</code> · <code>**negrito**</code> — linha em branco
          separa parágrafos.
        </small>
      </label>

      <details className="admin-collapse">
        <summary>SEO do artigo (opcional)</summary>
        <div className="admin-collapse-body">
          <div className="admin-grid-2">
            <label>
              Título no Google (se diferente do título)
              <input
                name="metaTitle"
                type="text"
                maxLength={80}
                defaultValue={post?.metaTitle ?? ""}
                placeholder="Até 60 caracteres"
              />
            </label>
            <label>
              Palavras-chave (separadas por vírgula)
              <input
                name="keywords"
                type="text"
                defaultValue={post?.keywords ?? ""}
                placeholder="iluminação, led, sala"
              />
            </label>
          </div>
          <label>
            Descrição no Google (se diferente do resumo)
            <textarea
              name="metaDescription"
              rows={2}
              maxLength={200}
              defaultValue={post?.metaDescription ?? ""}
              placeholder="Até 155 caracteres"
            />
          </label>
          <label>
            Imagem de capa (URL opcional)
            <input
              name="coverImage"
              type="url"
              defaultValue={post?.coverImage ?? ""}
              placeholder="https://..."
            />
          </label>
        </div>
      </details>

      <label className="admin-checkbox">
        <input
          name="published"
          type="checkbox"
          defaultChecked={isEdit ? post?.published : true}
        />
        Publicar no site (desmarcado = fica como rascunho)
      </label>

      {state.error && <p className="admin-form-error">{state.error}</p>}

      <div className="admin-savebar">
        <button className="admin-btn admin-btn-primary" type="submit" disabled={pending}>
          {pending
            ? "Salvando..."
            : isEdit
              ? "Salvar alterações"
              : "Criar artigo"}
        </button>
      </div>
    </form>
  );
}
