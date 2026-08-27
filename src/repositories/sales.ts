import "server-only";

import type { Prisma, PaymentMethod as DbPaymentMethod } from "@prisma/client";

import { getTenantContext } from "@/lib/tenant/context";
import { tenantDb } from "@/lib/tenant/db";
import { listarProdutosTela } from "@/repositories/products";
import type { PaymentMethod, Sale, SaleStatus } from "@/types/sale";

const PAGAMENTO_PARA_TELA: Record<string, PaymentMethod> = {
  DINHEIRO: "dinheiro",
  PIX: "pix",
  DEBITO: "debito",
  CREDITO: "credito",
  CREDIARIO: "crediario",
  OUTRO: "dinheiro",
};

const PAGAMENTO_PARA_BANCO: Record<PaymentMethod, DbPaymentMethod> = {
  dinheiro: "DINHEIRO",
  pix: "PIX",
  debito: "DEBITO",
  credito: "CREDITO",
  crediario: "CREDIARIO",
};

const STATUS_PARA_TELA: Record<string, SaleStatus> = {
  CONCLUIDA: "concluida",
  CANCELADA: "cancelada",
};

type VendaComRelacoes = Prisma.SaleGetPayload<{
  include: {
    customer: { select: { nome: true } };
    seller: { select: { nome: true } };
    items: {
      include: {
        variant: { include: { product: { select: { nome: true } } } };
      };
    };
  };
}>;

function mapearVendaParaTela(venda: VendaComRelacoes): Sale {
  return {
    id: venda.id,
    numero: venda.numero,
    clienteId: venda.customerId ?? undefined,
    clienteNome: venda.customer?.nome,
    vendedorId: venda.sellerId ?? "",
    vendedorNome: venda.seller?.nome ?? "",
    itens: venda.items.map((item) => ({
      variantId: item.variantId,
      produtoNome: item.variant.product.nome,
      tamanho: item.variant.tamanho,
      cor: item.variant.cor,
      quantidade: item.quantidade,
      precoUnitario: Number(item.precoUnitario),
      total: Number(item.total),
    })),
    subtotal: Number(venda.subtotal),
    desconto: Number(venda.desconto),
    total: Number(venda.total),
    formaPagamento: venda.formaPagamento
      ? PAGAMENTO_PARA_TELA[venda.formaPagamento]
      : "dinheiro",
    status: STATUS_PARA_TELA[venda.status] ?? "concluida",
    observacao: venda.observacao ?? undefined,
    concluidaEm: (venda.concluidaEm ?? venda.createdAt).toISOString(),
  };
}

/** Vendedores ativos da loja ativa, para os seletores de Vendas e do PDV. */
export async function listarVendedoresTela() {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  return db.seller.findMany({
    where: { ativo: true, storeId: ctx.storeId ?? undefined },
    select: { id: true, nome: true },
    orderBy: { nome: "asc" },
  });
}

/** Histórico de vendas da loja ativa, mais recentes primeiro. */
export async function listarVendasTela(): Promise<Sale[]> {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  const vendas = await db.sale.findMany({
    where: { storeId: ctx.storeId ?? undefined, status: { not: "RASCUNHO" } },
    include: {
      customer: { select: { nome: true } },
      seller: { select: { nome: true } },
      items: {
        include: {
          variant: { include: { product: { select: { nome: true } } } },
        },
      },
    },
    orderBy: { numero: "desc" },
  });

  return vendas.map(mapearVendaParaTela);
}

/** Tudo que o PDV precisa: catálogo com estoque, clientes e vendedores da loja ativa. */
export async function listarOpcoesPdv() {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  const [{ produtos }, clientes, vendedores] = await Promise.all([
    listarProdutosTela(),
    db.customer.findMany({
      where: { storeId: ctx.storeId ?? undefined },
      select: { id: true, nome: true },
      orderBy: { nome: "asc" },
    }),
    listarVendedoresTela(),
  ]);

  return { produtos, clientes, vendedores };
}

export type CriarVendaInput = {
  clienteId?: string | null;
  vendedorId: string;
  itens: { variantId: string; quantidade: number; precoUnitario: number }[];
  desconto: number;
  formaPagamento: PaymentMethod;
  observacao?: string | null;
};

/**
 * Finaliza a venda: baixa o estoque de cada variante, grava a venda concluída
 * e atualiza os agregados do cliente (última compra, total gasto, ticket
 * médio). Tudo numa transação — se faltar estoque de qualquer item, nada é
 * gravado.
 */
export async function criarVenda(input: CriarVendaInput): Promise<Sale> {
  const ctx = await getTenantContext();

  if (!ctx.storeId) {
    throw new Error("Nenhuma loja ativa na sessão.");
  }
  if (input.itens.length === 0) {
    throw new Error("O carrinho está vazio.");
  }

  const storeId = ctx.storeId;
  const subtotal = input.itens.reduce(
    (soma, item) => soma + item.precoUnitario * item.quantidade,
    0,
  );
  const total = Math.max(0, subtotal - input.desconto);
  const agora = new Date();

  const vendaId = await tenantDb(ctx).$transaction(async (tx) => {
    for (const item of input.itens) {
      const variante = await tx.productVariant.findUniqueOrThrow({
        where: { id: item.variantId },
        select: {
          estoque: true,
          tamanho: true,
          cor: true,
          product: { select: { nome: true } },
        },
      });
      if (variante.estoque < item.quantidade) {
        throw new Error(
          `Estoque insuficiente de ${variante.product.nome} (${variante.tamanho}/${variante.cor}): restam ${variante.estoque}.`,
        );
      }
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { estoque: { decrement: item.quantidade } },
      });
    }

    const ultimoNumero = await tx.sale.aggregate({
      where: { storeId },
      _max: { numero: true },
    });
    const numero = (ultimoNumero._max.numero ?? 0) + 1;

    const venda = await tx.sale.create({
      data: {
        organizationId: ctx.organizationId,
        storeId,
        customerId: input.clienteId ?? null,
        sellerId: input.vendedorId,
        numero,
        status: "CONCLUIDA",
        subtotal,
        desconto: input.desconto,
        total,
        formaPagamento: PAGAMENTO_PARA_BANCO[input.formaPagamento],
        observacao: input.observacao ?? null,
        concluidaEm: agora,
        items: {
          create: input.itens.map((item) => ({
            organizationId: ctx.organizationId,
            variantId: item.variantId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            total: item.precoUnitario * item.quantidade,
          })),
        },
      },
      select: { id: true },
    });

    if (input.clienteId) {
      const cliente = await tx.customer.update({
        where: { id: input.clienteId },
        data: {
          totalCompras: { increment: 1 },
          totalGasto: { increment: total },
          ultimaCompra: agora,
        },
        select: { totalGasto: true, totalCompras: true },
      });
      await tx.customer.update({
        where: { id: input.clienteId },
        data: {
          ticketMedio: Number(cliente.totalGasto) / cliente.totalCompras,
        },
      });
    }

    return venda.id;
  });

  const vendaCompleta = await tenantDb(ctx).sale.findUniqueOrThrow({
    where: { id: vendaId },
    include: {
      customer: { select: { nome: true } },
      seller: { select: { nome: true } },
      items: {
        include: {
          variant: { include: { product: { select: { nome: true } } } },
        },
      },
    },
  });

  return mapearVendaParaTela(vendaCompleta);
}
