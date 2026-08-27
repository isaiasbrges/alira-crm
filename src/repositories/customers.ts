import "server-only";

import type { Prisma } from "@prisma/client";

import { getTenantContext } from "@/lib/tenant/context";
import { getTenantDb, tenantDb } from "@/lib/tenant/db";
import type { Customer, CustomerStatus } from "@/types/customer";

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

  const {
    busca,
    status,
    apenasLojaAtiva = false,
    page = 1,
    perPage = PER_PAGE_PADRAO,
  } = params;

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
        tags: {
          include: { tag: { select: { id: true, label: true, cor: true } } },
        },
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

const STATUS_PARA_TELA: Record<string, CustomerStatus> = {
  ATIVO: "ativo",
  INATIVO: "inativo",
  VIP: "vip",
};

const STATUS_PARA_BANCO: Record<CustomerStatus, "ATIVO" | "INATIVO" | "VIP"> = {
  ativo: "ATIVO",
  inativo: "INATIVO",
  vip: "VIP",
};

function paraArrayDeString(valor: unknown): string[] {
  return Array.isArray(valor)
    ? valor.filter((item): item is string => typeof item === "string")
    : [];
}

function anosDesde(data: Date, referencia: Date): number {
  const anos = (referencia.getTime() - data.getTime()) / (365.25 * 86_400_000);
  return Math.max(anos, 1 / 12);
}

type ClienteComRelacoes = Prisma.CustomerGetPayload<{
  include: {
    seller: { select: { id: true; nome: true } };
    preferences: true;
    tags: { include: { tag: { select: { id: true; label: true } } } };
  };
}>;

function mapearClienteParaTela(
  cliente: ClienteComRelacoes,
  referencia: Date,
): Customer {
  return {
    id: cliente.id,
    nome: cliente.nome,
    whatsapp: cliente.whatsapp,
    email: cliente.email ?? undefined,
    nascimento: cliente.nascimento?.toISOString().slice(0, 10),
    cidade: cliente.cidade ?? "",
    estado: cliente.estado ?? "",
    tamanhos: {
      camiseta: cliente.preferences?.tamanhoCamiseta ?? undefined,
      calca: cliente.preferences?.tamanhoCalca ?? undefined,
      calcado: cliente.preferences?.tamanhoCalcado ?? undefined,
    },
    preferencias: {
      estilo: cliente.preferences?.estilo ?? undefined,
      cores: paraArrayDeString(cliente.preferences?.cores),
      marcas: paraArrayDeString(cliente.preferences?.marcas),
      categorias: paraArrayDeString(cliente.preferences?.categoriasFavoritas),
    },
    vendedorId: cliente.sellerId ?? "",
    vendedorNome: cliente.seller?.nome ?? "—",
    tags: cliente.tags.map(({ tag }) => ({ id: tag.id, label: tag.label })),
    status: STATUS_PARA_TELA[cliente.status] ?? "ativo",
    consentimentoWhatsapp: cliente.consentimentoWhatsapp,
    ultimaCompra: cliente.ultimaCompra?.toISOString().slice(0, 10),
    totalGasto: Number(cliente.totalGasto),
    ticketMedio: Number(cliente.ticketMedio),
    frequenciaCompra: Number(
      (cliente.totalCompras / anosDesde(cliente.createdAt, referencia)).toFixed(
        1,
      ),
    ),
  };
}

/**
 * Carrega tudo que a tela de Clientes precisa num único lugar: a lista já no
 * formato que a UI espera, mais as opções dos filtros — extraídas dos dados
 * reais da loja, não de uma lista fixa.
 *
 * Escopado à loja ativa: cliente pertence a uma loja (schema não permite
 * `storeId` nulo), então listar por organização inteira misturaria bases de
 * lojas diferentes na mesma tabela.
 */
export async function listarClientesTela() {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  const [clientes, vendedores, tags] = await Promise.all([
    db.customer.findMany({
      where: ctx.storeId ? { storeId: ctx.storeId } : undefined,
      include: {
        seller: { select: { id: true, nome: true } },
        preferences: true,
        tags: { include: { tag: { select: { id: true, label: true } } } },
      },
      orderBy: { nome: "asc" },
    }),
    db.seller.findMany({
      where: { ativo: true, ...(ctx.storeId ? { storeId: ctx.storeId } : {}) },
      select: { id: true, nome: true },
      orderBy: { nome: "asc" },
    }),
    db.tag.findMany({
      select: { id: true, label: true },
      orderBy: { label: "asc" },
    }),
  ]);

  const referencia = new Date();
  const mapeados = clientes.map((cliente) =>
    mapearClienteParaTela(cliente, referencia),
  );

  const cidades = [
    ...new Set(mapeados.map((cliente) => cliente.cidade).filter(Boolean)),
  ].sort();
  const categorias = [
    ...new Set(mapeados.flatMap((cliente) => cliente.preferencias.categorias)),
  ].sort();

  return { clientes: mapeados, vendedores, tags, cidades, categorias };
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

/** Move o cliente entre Ativo/Inativo/VIP — usado pelo board em Clientes. */
export async function atualizarStatusCliente(
  clienteId: string,
  status: CustomerStatus,
): Promise<void> {
  const db = await getTenantDb();

  await db.customer.update({
    where: { id: clienteId },
    data: { status: STATUS_PARA_BANCO[status] },
  });
}
