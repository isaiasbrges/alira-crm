"use server";

import { criarVenda, type CriarVendaInput } from "@/repositories/sales";
import type { Sale } from "@/types/sale";

export type FinalizarVendaResult = {
  erro?: string;
  venda?: Sale;
};

/**
 * Chamada direto do cliente (não é um form action) — o carrinho é uma lista
 * de itens, o que não dá pra carregar limpo num FormData.
 */
export async function finalizarVendaAction(
  input: CriarVendaInput,
): Promise<FinalizarVendaResult> {
  try {
    const venda = await criarVenda(input);
    return { venda };
  } catch (erro) {
    if (erro instanceof Error) return { erro: erro.message };
    throw erro;
  }
}
