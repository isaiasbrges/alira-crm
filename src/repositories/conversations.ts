import "server-only";

import { getTenantContext } from "@/lib/tenant/context";
import { tenantDb } from "@/lib/tenant/db";
import { n8nWebhookUrlDaOrganizacao } from "@/repositories/organizations";
import type { Conversation, MessageDirection } from "@/types/conversation";

const DIRECAO_PARA_TELA: Record<string, MessageDirection> = {
  INBOUND: "recebida",
  OUTBOUND: "enviada",
};

/**
 * Uma "conversa" por cliente com pelo menos uma mensagem registrada.
 * Mensagens recebidas chegam pelo webhook do n8n; as enviadas daqui também
 * são retransmitidas para lá (ver `enviarMensagemAtendimento`).
 *
 * Não filtra pela loja ativa: o WhatsApp é um único número por organização,
 * e o webhook inbound não sabe qual loja o atendente tem selecionada no
 * momento — filtrar por loja aqui faria mensagens novas "sumirem" até
 * alguém trocar de loja no seletor.
 */
export async function listarAtendimentosTela(): Promise<Conversation[]> {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  const clientes = await db.customer.findMany({
    where: {
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

/**
 * Clientes sem nenhuma mensagem ainda — candidatos para "Nova conversa".
 * Também não filtra por loja ativa, pelo mesmo motivo de `listarAtendimentosTela`.
 */
export async function listarClientesSemConversa() {
  const db = await tenantDb(await getTenantContext());

  return db.customer.findMany({
    where: { messages: { none: {} } },
    select: { id: true, nome: true },
    orderBy: { nome: "asc" },
  });
}

/**
 * Registra uma mensagem enviada ao cliente e retransmite para o webhook n8n
 * configurado, se houver — é o n8n quem manda de fato pela Evolution API.
 */
export async function enviarMensagemAtendimento(
  clienteId: string,
  texto: string,
): Promise<void> {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  const cliente = await db.customer.findUniqueOrThrow({
    where: { id: clienteId },
    select: { whatsapp: true },
  });

  await db.whatsappMessage.create({
    data: {
      organizationId: ctx.organizationId,
      customerId: clienteId,
      direction: "OUTBOUND",
      corpo: texto,
    },
  });

  await despacharParaN8n(ctx.organizationId, cliente.whatsapp, texto);
}

/**
 * Best-effort: se o n8n estiver fora do ar ou a URL não estiver configurada,
 * a mensagem já ficou registrada acima — não é motivo para falhar a tela.
 */
async function despacharParaN8n(
  organizationId: string,
  whatsapp: string,
  texto: string,
): Promise<void> {
  const webhookUrl = await n8nWebhookUrlDaOrganizacao(organizationId);
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ whatsapp, texto }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Falha de rede/timeout no n8n não deve quebrar o atendimento.
  }
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
