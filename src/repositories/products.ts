import "server-only";

import type { Prisma, ProductStatus as DbProductStatus } from "@prisma/client";

import { getTenantContext } from "@/lib/tenant/context";
import { tenantDb } from "@/lib/tenant/db";
import type { Product, ProductStatus } from "@/types/product";

const STATUS_PARA_TELA: Record<string, ProductStatus> = {
  ATIVO: "ativo",
  INATIVO: "inativo",
  ARQUIVADO: "arquivado",
};

const STATUS_PARA_BANCO: Record<ProductStatus, DbProductStatus> = {
  ativo: "ATIVO",
  inativo: "INATIVO",
  arquivado: "ARQUIVADO",
};

type ProdutoComRelacoes = Prisma.ProductGetPayload<{
  include: { category: { select: { nome: true } }; variants: true };
}>;

function mapearProdutoParaTela(produto: ProdutoComRelacoes): Product {
  return {
    id: produto.id,
    nome: produto.nome,
    sku: produto.sku,
    categoria: produto.category?.nome ?? "Sem categoria",
    colecao: produto.colecao ?? undefined,
    preco: Number(produto.preco),
    status: STATUS_PARA_TELA[produto.status] ?? "ativo",
    variantes: produto.variants.map((variante) => ({
      id: variante.id,
      tamanho: variante.tamanho,
      cor: variante.cor,
      sku: variante.sku,
      estoque: variante.estoque,
    })),
  };
}

/**
 * Lista os produtos da loja ativa já no formato da tela, mais as categorias
 * reais cadastradas na organização (para o filtro).
 */
export async function listarProdutosTela() {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  const [produtos, categorias] = await Promise.all([
    db.product.findMany({
      where: ctx.storeId ? { storeId: ctx.storeId } : undefined,
      include: { category: { select: { nome: true } }, variants: true },
      orderBy: { nome: "asc" },
    }),
    db.category.findMany({
      select: { id: true, nome: true },
      orderBy: { nome: "asc" },
    }),
  ]);

  return {
    produtos: produtos.map(mapearProdutoParaTela),
    categorias: categorias.map((categoria) => categoria.nome),
  };
}

function gerarSlugCategoria(nome: string): string {
  return (
    nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "categoria"
  );
}

export type CriarProdutoInput = {
  nome: string;
  sku: string;
  preco: number;
  categoria?: string | null;
  colecao?: string | null;
};

/**
 * Cria o produto com uma variante única (P/Único, estoque zero) — mesmo
 * comportamento simplificado que a tela já tinha antes de persistir de
 * verdade. Ajustar tamanhos, cores e estoque por variante segue sendo
 * trabalho de uma tela de edição que ainda não existe.
 *
 * A categoria nasce por nome: acha uma existente com esse nome na
 * organização ou cria na hora — evita uma tela separada só para cadastrar
 * categoria antes de conseguir criar o primeiro produto.
 */
export async function criarProduto(input: CriarProdutoInput) {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  if (!ctx.storeId) {
    throw new Error("Nenhuma loja ativa na sessão.");
  }

  let categoryId: string | null = null;
  const nomeCategoria = input.categoria?.trim();
  if (nomeCategoria) {
    const categoria = await db.category.upsert({
      where: {
        organizationId_slug: {
          organizationId: ctx.organizationId,
          slug: gerarSlugCategoria(nomeCategoria),
        },
      },
      update: {},
      create: {
        organizationId: ctx.organizationId,
        nome: nomeCategoria,
        slug: gerarSlugCategoria(nomeCategoria),
      },
      select: { id: true },
    });
    categoryId = categoria.id;
  }

  const produto = await db.product.create({
    data: {
      organizationId: ctx.organizationId,
      storeId: ctx.storeId,
      categoryId,
      nome: input.nome,
      sku: input.sku,
      colecao: input.colecao ?? null,
      preco: input.preco,
      status: STATUS_PARA_BANCO.ativo,
      variants: {
        create: {
          organizationId: ctx.organizationId,
          sku: `${input.sku}-PU`,
          tamanho: "P",
          cor: "Único",
          estoque: 0,
        },
      },
    },
    include: { category: { select: { nome: true } }, variants: true },
  });

  return mapearProdutoParaTela(produto);
}
