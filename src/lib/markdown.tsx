import { Fragment, type ReactNode } from "react";

/**
 * Renderizador "mini-markdown" seguro para o conteúdo do blog.
 * Converte texto puro em elementos React (sem dangerouslySetInnerHTML,
 * portanto sem risco de XSS). Suporta:
 *   ## Título h2      ### Subtítulo h3      - item de lista
 *   **negrito**       linhas em branco separam parágrafos
 */

function inline(text: string, keyBase: string): ReactNode[] {
  // Divide em **negrito** e texto normal.
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={`${keyBase}-b${i}`}>{part}</strong> : <Fragment key={`${keyBase}-t${i}`}>{part}</Fragment>
  );
}

export type MarkdownBlock =
  | { kind: "h2" | "h3" | "p"; text: string }
  | { kind: "ul"; items: string[] };

/** Analisa o texto em blocos estruturados (função pura, testável). */
export function parseMiniMarkdown(source: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let list: string[] | null = null;

  const flush = () => {
    if (list && list.length) blocks.push({ kind: "ul", items: list });
    list = null;
  };

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith("### ")) {
      flush();
      blocks.push({ kind: "h3", text: line.slice(4).trim() });
    } else if (line.startsWith("## ")) {
      flush();
      blocks.push({ kind: "h2", text: line.slice(3).trim() });
    } else if (line.startsWith("- ")) {
      list = list ?? [];
      list.push(line.slice(2).trim());
    } else {
      flush();
      blocks.push({ kind: "p", text: line });
    }
  }
  flush();
  return blocks;
}

/** Componente: renderiza o mini-markdown como JSX estilizado. */
export function MiniMarkdown({ source }: { source: string }) {
  const blocks = parseMiniMarkdown(source);
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "h2":
            return <h2 key={i}>{inline(block.text, `h${i}`)}</h2>;
          case "h3":
            return <h3 key={i}>{inline(block.text, `h${i}`)}</h3>;
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{inline(item, `l${i}-${j}`)}</li>
                ))}
              </ul>
            );
          default:
            return <p key={i}>{inline(block.text, `p${i}`)}</p>;
        }
      })}
    </>
  );
}
