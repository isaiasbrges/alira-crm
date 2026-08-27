import "server-only";

import { getTenantContext } from "@/lib/tenant/context";
import { tenantDb } from "@/lib/tenant/db";
import type { TeamMember } from "@/types/team";

/** Usuários com acesso à organização (não escopado por loja — conta é da empresa toda). */
export async function listarUsuariosTela(): Promise<TeamMember[]> {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  const usuarios = await db.user.findMany({
    orderBy: { nome: "asc" },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      ativo: true,
      storeAccess: { select: { storeId: true } },
    },
  });

  return usuarios.map((usuario) => ({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role,
    ativo: usuario.ativo,
    // OWNER nunca é restringível, mesmo que existam linhas antigas.
    storeAccessIds:
      usuario.role === "OWNER" || usuario.storeAccess.length === 0
        ? null
        : usuario.storeAccess.map((acesso) => acesso.storeId),
  }));
}
