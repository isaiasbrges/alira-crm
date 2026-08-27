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
    select: { id: true, nome: true, email: true, role: true, ativo: true },
  });

  return usuarios;
}
