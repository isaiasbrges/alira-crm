import "server-only";

import { prisma } from "@/lib/prisma";
import { getTenantContext, isPlatformAdmin } from "@/lib/tenant/context";
import { getTenantDb } from "@/lib/tenant/db";

/**
 * Organização e lojas.
 *
 * `Organization` é o único modelo fora do guard de tenancy — ele é o próprio
 * tenant, não tem `organizationId`. Por isso as funções daqui filtram na mão
 * pelo id da sessão, e a única que enxerga várias organizações exige
 * SUPER_ADMIN de forma explícita.
 */

export async function organizacaoAtual() {
  const ctx = await getTenantContext();

  return prisma.organization.findUnique({
    where: { id: ctx.organizationId },
    select: { id: true, nome: true, slug: true, status: true, plano: true },
  });
}

/** Lojas da organização da sessão. Escopo garantido pelo guard. */
export async function lojasDaOrganizacao() {
  const db = await getTenantDb();

  return db.store.findMany({
    where: { ativa: true },
    select: { id: true, nome: true, slug: true },
    orderBy: { nome: "asc" },
  });
}

/**
 * Listagem cross-tenant do painel master.
 *
 * É a única função do sistema que atravessa organizações. Fica isolada aqui,
 * com a checagem de papel na entrada, para que esse privilégio seja visível em
 * um lugar só — em vez de espalhado por queries sem filtro.
 *
 * O painel `/admin` que consome isso ainda não existe; a função está aqui para
 * que ele nasça sobre um caminho auditado e não sobre `prisma` cru.
 */
export async function listarOrganizacoesComoAdmin() {
  const ctx = await getTenantContext();

  if (!isPlatformAdmin(ctx)) {
    throw new Error("Acesso restrito ao painel master.");
  }

  return prisma.organization.findMany({
    where: { interna: false },
    select: {
      id: true,
      nome: true,
      slug: true,
      status: true,
      plano: true,
      createdAt: true,
      _count: { select: { stores: true, users: true, customers: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
