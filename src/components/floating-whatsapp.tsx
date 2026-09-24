import { buildWa } from "@/lib/site-utils";

/** Botão flutuante de WhatsApp — presente em todas as páginas (footer.php original). */
export default function FloatingWhatsapp({ whatsapp }: { whatsapp: string }) {
  return (
    <a
      className="floating-wa"
      href={buildWa(whatsapp, "Olá! Gostaria de falar com a equipe da Luz & Cia.")}
      target="_blank"
      rel="noopener"
      aria-label="Abrir WhatsApp"
    >
      <span>WhatsApp</span>
      <b>↗</b>
    </a>
  );
}
