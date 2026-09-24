import { buildTel, buildWa } from "@/lib/site-utils";

/** Barra fixa inferior mobile — tradução 1:1 do footer.php original. */
export default function MobileBar({
  phoneDisplay,
  whatsapp,
}: {
  phoneDisplay: string;
  whatsapp: string;
}) {
  return (
    <div className="mobile-bar">
      <a href={buildTel(phoneDisplay)}>Ligar</a>
      <a
        href={buildWa(whatsapp, "Olá! Quero solicitar um orçamento.")}
        target="_blank"
        rel="noopener"
      >
        Orçamento
      </a>
      <a href="/unidades">Unidades</a>
    </div>
  );
}
