import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { carregarWorkspace } from "@/lib/tenant/workspace";
import { AppShell } from "@/components/layout/app-shell";

export default async function CrmLayout({ children }: LayoutProps<"/">) {
  // SUPER_ADMIN não é dono de loja — não tem workspace pra montar aqui.
  // O painel dele é o /admin, à parte do resto do CRM.
  const session = await getSession();
  if (session?.user.role === "SUPER_ADMIN") redirect("/admin");

  // A organização vem da sessão, no servidor. É por isso que as rotas seguem
  // simples (/clientes, não /empresa-x/clientes): o tenant não trafega pela
  // URL, onde poderia ser trocado à mão.
  const { workspace, user } = await carregarWorkspace();

  return (
    <AppShell workspace={workspace} user={user}>
      {children}
    </AppShell>
  );
}
