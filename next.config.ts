import type { NextConfig } from "next";

/**
 * Redirects permanentes (308) — preservam o SEO das URLs .php indexadas
 * e dos aliases antigos das lojas (regras 24/25/27 do escopo da migração).
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // WebP (fontes do site) + AVIF — o otimizador entrega o melhor formato
    // suportado pelo navegador (imagem menor → melhor LCP/Core Web Vitals).
    formats: ["image/avif", "image/webp"],
    // Larguras intrínsecas das imagens originais (webp) usadas nas páginas,
    // necessárias para o otimizador do Next 16 aceitar os tamanhos solicitados.
    deviceSizes: [
      382, 450, 626, 680, 720, 750, 828, 960, 1080, 1170, 1200, 1280, 1800,
      1920, 2048, 3840,
    ],
    // Tempo de cache das imagens otimizadas (31 dias).
    minimumCacheTTL: 2_678_400,
  },
  async headers() {
    return [
      {
        // Imagens estáticas: cache longo no navegador (revisita mais rápida,
        // Core Web Vitals) + revalidação em segundo plano.
        source: "/img/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Segurança básica em todas as rotas.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Defesa extra: painel e APIs fora do índice (além do robots.txt).
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  redirects: async () => [
    { source: "/index.php", destination: "/", permanent: true },
    { source: "/sobre.php", destination: "/sobre", permanent: true },
    { source: "/unidades.php", destination: "/unidades", permanent: true },
    { source: "/miranda-reis.php", destination: "/miranda-reis", permanent: true },
    { source: "/coxipo.php", destination: "/coxipo", permanent: true },
    { source: "/yellow-week.php", destination: "/yellow-week", permanent: true },
    { source: "/contato.php", destination: "/contato", permanent: true },
    { source: "/loja-miranda-reis.php", destination: "/miranda-reis", permanent: true },
    { source: "/loja-coxipo.php", destination: "/coxipo", permanent: true },
    // Imagens antigas vinculadas por hotlink/cache de buscadores
    { source: "/assets/img/:path*", destination: "/img/:path*", permanent: true },
  ],
};

export default nextConfig;
