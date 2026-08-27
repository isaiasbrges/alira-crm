"use server";

import { desbloquearPdv } from "@/lib/auth/pdv-lock";
import { getTenantContext } from "@/lib/tenant/context";
import { conferirSenhaPdv } from "@/repositories/pdv-lock";
import { criarVenda, type CriarVendaInput } from "@/repositories/sales";
import type { Sale } from "@/types/sale";

export type FinalizarVendaResult = {
  erro?: string;
  venda?: Sale;
};

export type DesbloquearPdvState = {
  erro?: string;
  sucesso?: boolean;
};

export async function desbloquearPdvAction(
  _prevState: DesbloquearPdvState,
  formData: FormData,
): Promise<DesbloquearPdvState> {
  const senha = String(formData.get("senha") ?? "");
  if (!senha) return { erro: "Informe a senha." };

  const ok = await conferirSenhaPdv(senha);
  if (!ok) return { erro: "Senha incorreta." };

  const ctx = await getTenantContext();
  if (!ctx.storeId) return { erro: "Nenhuma loja ativa na sessão." };

  await desbloquearPdv(ctx.storeId);
  return { sucesso: true };
}

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
