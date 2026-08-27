import "server-only";

import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";

import { getSession } from "@/lib/auth/session";
import type { CurrentUser, Workspace } from "@/types/navigation";

const ROTULO_PAPEL: Record<UserRole, string> = {
  SUPER_ADMIN: "Equipe Alira",
  OWNER: "Proprietário",
  MANAGER: "Gerente",
  SELLER: "Vendedor",
};

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).slice(0, 2);
  return partes.map((parte) => parte[0]?.toUpperCase() ?? "").join("");
}

/**
 * Traduz a sessão no que a interface precisa exibir.
 *
 * Roda no servidor. A sidebar e o header recebem isso por props, o que evita
 * que o cliente tenha qualquer palavra sobre qual organização está aberta.
 *
 * Sem sessão válida, redireciona para o login em vez de lançar erro — esta
 * função só é chamada de layouts e páginas, onde um redirect é o
 * comportamento certo.
 */
export async function carregarWorkspace(): Promise<{
  workspace: Workspace;
  user: CurrentUser;
}> {
  const session = await getSession();
  if (!session) redirect("/login");

  const stores = session.stores.map((store) => ({ id: store.id, nome: store.nome }));
  const ativa = stores.find((store) => store.id === session.activeStoreId) ?? stores[0];

  return {
    workspace: {
      organization: { id: session.organization.id, nome: session.organization.nome },
      store: ativa,
      stores,
    },
    user: {
      nome: session.user.nome,
      funcao: ROTULO_PAPEL[session.user.role],
      email: session.user.email,
      iniciais: iniciais(session.user.nome),
    },
  };
}
