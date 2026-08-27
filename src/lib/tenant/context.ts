import "server-only";

import type { UserRole } from "@prisma/client";

import { requireSession } from "@/lib/auth/session";

/**
 * Escopo de tenancy de uma requisição.
 *
 * Construído sempre a partir da sessão — nunca de parâmetros de rota, body ou
 * props. É o que o guard de banco usa para filtrar as queries.
 */
export type TenantContext = {
  organizationId: string;
  /** Loja ativa. Nulo quando a operação vale para a organização inteira. */
  storeId: string | null;
  userId: string;
  role: UserRole;
};

export async function getTenantContext(): Promise<TenantContext> {
  const session = await requireSession();

  return {
    organizationId: session.organization.id,
    storeId: session.activeStoreId,
    userId: session.user.id,
    role: session.user.role,
  };
}

/**
 * Confere que um identificador recebido de fora pertence à organização atual.
 *
 * O guard de banco já impede ler dados de outra organização, então o resultado
 * prático de um id forjado é "não encontrado". Este helper existe para os casos
 * em que se quer falhar explicitamente em vez de tratar como inexistente.
 */
export function assertSameOrganization(
  ctx: TenantContext,
  registro: { organizationId: string } | null | undefined
): void {
  if (!registro || registro.organizationId !== ctx.organizationId) {
    throw new Error("Registro fora da organização da sessão.");
  }
}

/** Papéis que enxergam o painel master do time Alira. */
export function isPlatformAdmin(ctx: TenantContext): boolean {
  return ctx.role === "SUPER_ADMIN";
}
