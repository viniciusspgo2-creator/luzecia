import type { ReactNode } from "react";
import "@/styles/admin.css";

/**
 * Shell do painel /admin — visual próprio (independente do site público).
 * O admin.css só entra em cena nas rotas /admin.
 */
export const metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
