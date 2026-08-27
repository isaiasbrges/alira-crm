"use server";

import { Prisma } from "@prisma/client";

import { criarProduto } from "@/repositories/products";

export type CriarProdutoState = {
  erro?: string;
};

export async function criarProdutoAction(
  _prevState: CriarProdutoState,
  formData: FormData,
): Promise<CriarProdutoState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const sku = String(formData.get("sku") ?? "")
    .trim()
    .toUpperCase();
  const precoBruto = String(formData.get("preco") ?? "").replace(",", ".");
  const preco = Number(precoBruto);
  const categoria = String(formData.get("categoria") ?? "").trim();

  if (!nome) return { erro: "Informe o nome do produto." };
  if (!sku) return { erro: "Informe o SKU do produto." };
  if (!precoBruto || Number.isNaN(preco) || preco < 0) {
    return { erro: "Informe um preço válido." };
  }

  try {
    await criarProduto({ nome, sku, preco, categoria: categoria || null });
  } catch (erro) {
    if (
      erro instanceof Prisma.PrismaClientKnownRequestError &&
      erro.code === "P2002"
    ) {
      return { erro: "Já existe um produto com esse SKU." };
    }
    throw erro;
  }

  return {};
}
