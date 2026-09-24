import Script from "next/script";

/**
 * Google Analytics 4 + Google Tag Manager — "Ready" por variáveis de ambiente.
 * ─────────────────────────────────────────────────────────────────────────
 * • NEXT_PUBLIC_GA_ID   (ex.: "G-XXXXXXXXXX")  → carrega gtag.js (GA4)
 * • NEXT_PUBLIC_GTM_ID  (ex.: "GTM-XXXXXXX")   → carrega gtm.js
 * Sem as variáveis nada é carregado (zero custo de performance).
 *
 * O componente só é renderizado no layout público ((site)) — o painel
 * /admin nunca é rastreado.
 *
 * Também instala rastreio automático de conversões do site:
 *   whatsapp_click · phone_click · email_click
 * (visível em GA4 → Engajamento → Eventos e no GTM como eventos dataLayer).
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  if (!gaId && !gtmId) return null;

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {gtmId && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);w.gtmLoaded=true;})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              aria-hidden="true"
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}

      <Script id="lc-eventos-conversao" strategy="afterInteractive">
        {`(function(){function send(ev,label){var p={event:ev,event_label:label};window.dataLayer=window.dataLayer||[];window.dataLayer.push(p);if(!window.gtmLoaded&&typeof window.gtag==='function'){window.gtag('event',ev,{event_label:label});}}document.addEventListener('click',function(e){var t=e.target;if(!(t&&t.closest))return;var a=t.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'';if(h.indexOf('https://wa.me/')===0||h.indexOf('https://api.whatsapp.com/')===0){send('whatsapp_click',a.textContent||'');}else if(h.indexOf('tel:')===0){send('phone_click',h.replace('tel:',''));}else if(h.indexOf('mailto:')===0){send('email_click',h.replace('mailto:',''));}},{passive:true});})();`}
      </Script>
    </>
  );
}
