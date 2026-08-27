"use server";

import {
  enviarMensagemAtendimento,
  marcarAtendimentoResolvido,
} from "@/repositories/conversations";

export async function enviarMensagemAction(
  clienteId: string,
  texto: string,
): Promise<void> {
  const limpo = texto.trim();
  if (!limpo) return;
  await enviarMensagemAtendimento(clienteId, limpo);
}

export async function marcarResolvidaAction(clienteId: string): Promise<void> {
  await marcarAtendimentoResolvido(clienteId);
}
