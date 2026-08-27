import "server-only";

import { prisma } from "@/lib/prisma";

/**
 * Recebimento de mensagens via n8n + Evolution API.
 *
 * Quem chama aqui é o n8n, não um usuário logado — não há sessão para o guard
 * de tenancy usar. A organização é resolvida pelo token da URL do webhook, e
 * as consultas filtram organizationId na mão, como em src/repositories/organizations.ts.
 */

export type EventoMensagemRecebida = {
  whatsapp: string;
  texto: string;
  externalId?: string;
};

/** Resolve a organização dona do token. O token É a autenticação da rota. */
export async function organizacaoPorTokenWebhook(
  token: string,
): Promise<{ id: string } | null> {
  return prisma.organization.findUnique({
    where: { whatsappWebhookToken: token },
    select: { id: true },
  });
}

/**
 * Registra uma mensagem recebida, casando (ou criando) o cliente pelo
 * WhatsApp. `externalId` torna a chamada idempotente — o n8n pode reentregar
 * o mesmo evento sem duplicar a mensagem.
 */
export async function registrarMensagemRecebida(
  organizationId: string,
  evento: EventoMensagemRecebida,
): Promise<void> {
  const whatsapp = evento.whatsapp.trim();
  const texto = evento.texto.trim();
  if (!whatsapp || !texto) return;

  if (evento.externalId) {
    const existente = await prisma.whatsappMessage.findUnique({
      where: { externalId: evento.externalId },
      select: { id: true },
    });
    if (existente) return;
  }

  let cliente = await prisma.customer.findUnique({
    where: { organizationId_whatsapp: { organizationId, whatsapp } },
    select: { id: true },
  });

  if (!cliente) {
    const primeiraLoja = await prisma.store.findFirst({
      where: { organizationId, ativa: true },
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });
    // Organização sem loja ativa: não há onde encaixar o cliente novo.
    if (!primeiraLoja) return;

    cliente = await prisma.customer.create({
      data: {
        organizationId,
        storeId: primeiraLoja.id,
        nome: "Contato",
        whatsapp,
      },
      select: { id: true },
    });
  }

  await prisma.whatsappMessage.create({
    data: {
      organizationId,
      customerId: cliente.id,
      direction: "INBOUND",
      corpo: texto,
      externalId: evento.externalId,
    },
  });
}
