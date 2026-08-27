"use server";

import { salvarWebhookN8n } from "@/repositories/organizations";
import { definirSenhaPdv } from "@/repositories/pdv-lock";

export type SalvarWebhookN8nState = {
  erro?: string;
  sucesso?: boolean;
};

export async function salvarWebhookN8nAction(
  _prevState: SalvarWebhookN8nState,
  formData: FormData,
): Promise<SalvarWebhookN8nState> {
  const url = String(formData.get("n8nWebhookUrl") ?? "").trim();

  if (url) {
    try {
      new URL(url);
    } catch {
      return { erro: "URL inválida." };
    }
  }

  await salvarWebhookN8n(url || null);

  return { sucesso: true };
}

export type DefinirSenhaPdvState = {
  erro?: string;
  sucesso?: boolean;
};

export async function definirSenhaPdvAction(
  _prevState: DefinirSenhaPdvState,
  formData: FormData,
): Promise<DefinirSenhaPdvState> {
  const storeId = String(formData.get("storeId") ?? "");
  const intent = String(formData.get("intent") ?? "salvar");
  if (!storeId) return { erro: "Loja inválida." };

  try {
    if (intent === "remover") {
      await definirSenhaPdv(storeId, null);
      return { sucesso: true };
    }

    const senha = String(formData.get("senha") ?? "");
    const confirmacao = String(formData.get("confirmacao") ?? "");

    if (senha.length < 4) {
      return { erro: "A senha precisa ter pelo menos 4 caracteres." };
    }
    if (senha !== confirmacao) {
      return { erro: "As senhas não coincidem." };
    }

    await definirSenhaPdv(storeId, senha);
    return { sucesso: true };
  } catch (erro) {
    if (erro instanceof Error) return { erro: erro.message };
    throw erro;
  }
}
