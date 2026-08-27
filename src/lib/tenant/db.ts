import "server-only";

import { prisma } from "@/lib/prisma";
import { getTenantContext, type TenantContext } from "@/lib/tenant/context";
import { aplicarEscopoTenant, TENANT_MODELS } from "@/lib/tenant/scope";

/**
 * Cliente Prisma restrito a uma organização.
 *
 * Toda query passa por aqui com `organizationId` aplicado, o que torna
 * `db.customer.findMany()` — sem where nenhum — uma consulta segura: devolve
 * apenas os clientes da organização da sessão. O objetivo é que esquecer o
 * filtro deixe de ser possível, em vez de depender de disciplina.
 *
 * Duas coisas que este guard NÃO cobre, por limitação do mecanismo:
 *
 * - `$queryRaw` / `$executeRaw`: SQL cru não passa por extensões do Prisma. Se
 *   um dia for necessário, o filtro precisa estar escrito na própria query.
 * - escritas aninhadas: o carimbo se aplica ao registro de topo. Nos filhos,
 *   `organizationId` é obrigatório no schema e o TypeScript cobra na compilação.
 */
export function tenantDb(ctx: TenantContext) {
  return prisma.$extends({
    name: "tenant-guard",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const escopado = aplicarEscopoTenant(model, operation, args, ctx.organizationId);

          // A transformação preserva a forma dos argumentos: só acrescenta o
          // organizationId ao where ou aos dados.
          return query(escopado as typeof args);
        },
      },
    },
  });
}

export type TenantDb = ReturnType<typeof tenantDb>;

/**
 * Atalho para o caminho comum: pega o contexto da sessão e devolve o cliente já
 * restrito. Use este em server actions, loaders e route handlers.
 */
export async function getTenantDb(): Promise<TenantDb> {
  return tenantDb(await getTenantContext());
}

/** Exposto para diagnóstico: quais modelos o guard cobre. */
export function listarModelosComTenant(): string[] {
  return [...TENANT_MODELS].sort();
}
