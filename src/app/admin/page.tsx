import { redirect } from "next/navigation";
import { getAdminSession, needsSetup } from "@/lib/auth";

/** /admin → roteia para o fluxo correto (setup → login → painel). */
export default async function AdminIndexPage() {
  if (await needsSetup()) redirect("/admin/setup");
  if (!(await getAdminSession())) redirect("/admin/login");
  redirect("/admin/painel");
}
