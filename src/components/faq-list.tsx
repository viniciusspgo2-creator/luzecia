"use client";

/**
 * FAQ — tradução 1:1 do bloco de index.php + comportamento de assets/js/app.js
 * (apenas um item aberto por vez, mesma classe .open e mesma transição CSS).
 */
import { useState } from "react";

const FAQS: Array<[string, string]> = [
  [
    "Quais produtos a Luz & Cia oferece?",
    "Linhas completas em elétrica, hidráulica e iluminação para reformas, obras residenciais, espaços comerciais e projetos de decoração.",
  ],
  [
    "Vocês oferecem consultoria em iluminação?",
    "Sim. Nossa equipe orienta na escolha de produtos e oferece consultoria luminotécnica de acordo com o ambiente e a necessidade do projeto.",
  ],
  [
    "A Luz & Cia realiza entregas?",
    "Sim. Trabalhamos com entregas em Cuiabá e Várzea Grande, com condições definidas conforme o pedido e a região.",
  ],
  [
    "Como conhecer as duas unidades?",
    "Acesse a página de Unidades para visualizar fotos da Miranda Reis e do Coxipó, além dos atalhos de contato.",
  ],
];

export default function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {FAQS.map(([question, answer], index) => {
        const open = openIndex === index;
        return (
          <article className={`faq-item${open ? " open" : ""}`} key={question}>
            <button
              className="faq-question"
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span>{question}</span>
              <b>+</b>
            </button>
            <div className="faq-answer">
              <p>{answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
