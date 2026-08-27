import "server-only";

import type { Prisma } from "@prisma/client";

import { getTenantContext } from "@/lib/tenant/context";
import { getTenantDb, tenantDb } from "@/lib/tenant/db";

/**
 * Repositório de clientes — referência de como os demais devem ser escritos.
 *
 * Nenhuma query aqui menciona `organizationId`: o guard de tenancy aplica o
 * filtro. O que aparece nos `where` é só a regra de negócio.
 */

export type ListarClientesParams = {
  busca?: string;
  status?: Prisma.EnumCustomerStatusFilter | undefined;
  /** Restringe à loja ativa. Sem isso, lista a organização inteira. */
  apenasLojaAtiva?: boolean;
  page?: number;
  perPage?: number;
};

const PER_PAGE_PADRAO = 8;

export async function listarClientes(params: ListarClientesParams = {}) {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  const { busca, status, apenasLojaAtiva = false, page = 1, perPage = PER_PAGE_PADRAO } = params;

  const where: Prisma.CustomerWhereInput = {
    ...(apenasLojaAtiva && ctx.storeId ? { storeId: ctx.storeId } : {}),
    ...(status ? { status } : {}),
    ...(busca
      ? {
          OR: [
            { nome: { contains: busca } },
            { whatsapp: { contains: busca } },
            { email: { contains: busca } },
            { cidade: { contains: busca } },
          ],
        }
      : {}),
  };

  const [itens, total] = await Promise.all([
    db.customer.findMany({
      where,
      include: {
        seller: { select: { id: true, nome: true } },
        tags: { include: { tag: { select: { id: true, label: true, cor: true } } } },
      },
      orderBy: { ultimaCompra: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.customer.count({ where }),
  ]);

  return { itens, total, page, perPage };
}

export async function buscarClientePorId(id: string) {
  const db = await getTenantDb();

  // findUnique com id de outra organização devolve null: o guard soma
  // organizationId ao where, e a linha simplesmente não corresponde.
  return db.customer.findUnique({
    where: { id },
    include: {
      seller: { select: { id: true, nome: true } },
      preferences: true,
      tags: { include: { tag: true } },
      sales: { orderBy: { concluidaEm: "desc" }, take: 10 },
    },
  });
}

export async function contarClientesPorStatus() {
  const db = await getTenantDb();

  const [total, ativos, inativos, vip, comWhatsapp] = await Promise.all([
    db.customer.count(),
    db.customer.count({ where: { status: "ATIVO" } }),
    db.customer.count({ where: { status: "INATIVO" } }),
    db.customer.count({ where: { status: "VIP" } }),
    db.customer.count({ where: { consentimentoWhatsapp: true } }),
  ]);

  return { total, ativos, inativos, vip, comWhatsapp };
}

export type CriarClienteInput = {
  nome: string;
  whatsapp: string;
  email?: string | null;
  cidade?: string | null;
  estado?: string | null;
  sellerId?: string | null;
};

export async function criarCliente(input: CriarClienteInput) {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  if (!ctx.storeId) {
    throw new Error("Nenhuma loja ativa na sessão.");
  }

  // organizationId é exigido pelo tipo, mas quem manda é o guard: o valor
  // gravado vem do contexto, não do que foi passado aqui.
  return db.customer.create({
    data: {
      organizationId: ctx.organizationId,
      storeId: ctx.storeId,
      nome: input.nome,
      whatsapp: input.whatsapp,
      email: input.email ?? null,
      cidade: input.cidade ?? null,
      estado: input.estado ?? null,
      sellerId: input.sellerId ?? null,
    },
  });
}
