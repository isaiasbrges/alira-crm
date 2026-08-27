import "server-only";

import { getTenantContext } from "@/lib/tenant/context";
import { tenantDb } from "@/lib/tenant/db";
import type { Conversation, MessageDirection } from "@/types/conversation";

const DIRECAO_PARA_TELA: Record<string, MessageDirection> = {
  INBOUND: "recebida",
  OUTBOUND: "enviada",
};

/**
 * Uma "conversa" por cliente com pelo menos uma mensagem registrada — não há
 * disparo real ainda (fica para quando n8n + Evolution API entrarem), então
 * hoje isso é o histórico do que foi digitado aqui mesmo.
 */
export async function listarAtendimentosTela(): Promise<Conversation[]> {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  const clientes = await db.customer.findMany({
    where: {
      storeId: ctx.storeId ?? undefined,
      messages: { some: {} },
    },
    select: {
      id: true,
      nome: true,
      status: true,
      atendimentoResolvido: true,
      seller: { select: { nome: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        select: { id: true, direction: true, corpo: true, createdAt: true },
      },
    },
  });

  const conversas = clientes.map(
    (cliente): Conversation => ({
      id: cliente.id,
      clienteNome: cliente.nome,
      clienteId: cliente.id,
      vip: cliente.status === "VIP",
      status: cliente.atendimentoResolvido ? "resolvida" : "aberta",
      vendedorNome: cliente.seller?.nome ?? "—",
      mensagens: cliente.messages.map((mensagem) => ({
        id: mensagem.id,
        direcao: DIRECAO_PARA_TELA[mensagem.direction] ?? "enviada",
        texto: mensagem.corpo ?? "",
        horario: mensagem.createdAt.toISOString(),
      })),
    }),
  );

  return conversas.sort((a, b) => {
    const ultimaA = a.mensagens[a.mensagens.length - 1]?.horario ?? "";
    const ultimaB = b.mensagens[b.mensagens.length - 1]?.horario ?? "";
    return ultimaB.localeCompare(ultimaA);
  });
}

/** Clientes sem nenhuma mensagem ainda — candidatos para "Nova conversa". */
export async function listarClientesSemConversa() {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  return db.customer.findMany({
    where: {
      storeId: ctx.storeId ?? undefined,
      messages: { none: {} },
    },
    select: { id: true, nome: true },
    orderBy: { nome: "asc" },
  });
}

/**
 * Registra uma mensagem enviada ao cliente. Grava no histórico — o envio de
 * verdade pelo WhatsApp acontece fora daqui até o disparo real existir.
 */
export async function enviarMensagemAtendimento(
  clienteId: string,
  texto: string,
): Promise<void> {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  await db.whatsappMessage.create({
    data: {
      organizationId: ctx.organizationId,
      customerId: clienteId,
      direction: "OUTBOUND",
      corpo: texto,
    },
  });
}

export async function marcarAtendimentoResolvido(
  clienteId: string,
): Promise<void> {
  const db = await tenantDb(await getTenantContext());
  await db.customer.update({
    where: { id: clienteId },
    data: { atendimentoResolvido: true },
  });
}
