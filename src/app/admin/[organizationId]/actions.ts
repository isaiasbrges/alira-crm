"use server";

import type { OrganizationStatus } from "@prisma/client";

import {
  alternarAcessoLojaComoAdmin,
  atualizarOrganizacaoComoAdmin,
} from "@/repositories/organizations";

export type AtualizarOrganizacaoState = {
  erro?: string;
  sucesso?: boolean;
};

const STATUS_VALIDOS = new Set<OrganizationStatus>([
  "ATIVA",
  "SUSPENSA",
  "CANCELADA",
]);

export async function atualizarOrganizacaoAction(
  _prevState: AtualizarOrganizacaoState,
  formData: FormData,
): Promise<AtualizarOrganizacaoState> {
  const organizationId = String(formData.get("organizationId") ?? "");
  const status = String(formData.get("status") ?? "") as OrganizationStatus;
  const plano = String(formData.get("plano") ?? "").trim();

  if (!organizationId) return { erro: "Organização inválida." };
  if (!STATUS_VALIDOS.has(status)) return { erro: "Status inválido." };

  try {
    await atualizarOrganizacaoComoAdmin(organizationId, {
      status,
      plano: plano || null,
    });
    return { sucesso: true };
  } catch (erro) {
    if (erro instanceof Error) return { erro: erro.message };
    throw erro;
  }
}

/**
 * Chamada direto do cliente (não é form action) — o switch dispara um
 * booleano, não vale montar um FormData pra isso.
 */
export async function alternarAcessoLojaAction(
  storeId: string,
  ativa: boolean,
): Promise<void> {
  await alternarAcessoLojaComoAdmin(storeId, ativa);
}
