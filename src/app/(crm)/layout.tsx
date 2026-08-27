import { AppShell } from "@/components/layout/app-shell";
import { carregarWorkspace } from "@/lib/tenant/workspace";

export default async function CrmLayout({ children }: LayoutProps<"/">) {
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
