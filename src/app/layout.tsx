import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "@/styles/style.css";
import { getSeoConfig } from "@/lib/seo";
import { getSiteContent } from "@/lib/content";
import { SITE_URL } from "@/config/site";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const dynamic = "force-dynamic";

/** Metadados globais — controlados pelo painel (/admin/seo → "Global"). */
export async function generateMetadata(): Promise<Metadata> {
  const [cfg, content] = await Promise.all([getSeoConfig(), getSiteContent()]);

  const siteName = content["geral.nome_site"] || "Luz & Cia";
  const global_ = cfg.global ?? {};
  const title = global_.title ?? `${siteName} | Elétrica, Hidráulica e Iluminação`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description: global_.description,
    keywords: global_.keywords
      ?.split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    icons: { icon: "/img/logo-symbol.png" },
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
    openGraph: {
      title,
      description: global_.description,
      url: "/",
      siteName,
      locale: "pt_BR",
      type: "website",
      ...(global_.ogImage ? { images: [{ url: global_.ogImage }] } : {}),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#171714",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${playfair.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
