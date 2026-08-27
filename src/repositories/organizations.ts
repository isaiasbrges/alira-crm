import "server-only";

import crypto from "node:crypto";

import type { OrganizationStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getTenantContext, isPlatformAdmin } from "@/lib/tenant/context";
import { getTenantDb } from "@/lib/tenant/db";

/**
 * Organização e lojas.
 *
 * `Organization` é o único modelo fora do guard de tenancy — ele é o próprio
 * tenant, não tem `organizationId`. Por isso as funções daqui filtram na mão
 * pelo id da sessão, e a única que enxerga várias organizações exige
 * SUPER_ADMIN de forma explícita.
 */

export async function organizacaoAtual() {
  const ctx = await getTenantContext();

  return prisma.organization.findUnique({
    where: { id: ctx.organizationId },
    select: { id: true, nome: true, slug: true, status: true, plano: true },
  });
}

/** Lojas da organização da sessão. Escopo garantido pelo guard. */
export async function lojasDaOrganizacao() {
  const db = await getTenantDb();

  return db.store.findMany({
    where: { ativa: true },
    select: { id: true, nome: true, slug: true },
    orderBy: { nome: "asc" },
  });
}

/**
 * Listagem cross-tenant do painel master.
 *
 * É a única função do sistema que atravessa organizações. Fica isolada aqui,
 * com a checagem de papel na entrada, para que esse privilégio seja visível em
 * um lugar só — em vez de espalhado por queries sem filtro.
 *
 * O painel `/admin` que consome isso ainda não existe; a função está aqui para
 * que ele nasça sobre um caminho auditado e não sobre `prisma` cru.
 */
export async function listarOrganizacoesComoAdmin() {
  const ctx = await getTenantContext();

  if (!isPlatformAdmin(ctx)) {
    throw new Error("Acesso restrito ao painel master.");
  }

  return prisma.organization.findMany({
    where: { interna: false },
    select: {
      id: true,
      nome: true,
      slug: true,
      status: true,
      plano: true,
      createdAt: true,
      _count: { select: { stores: true, users: true, customers: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Detalhe de uma organização cliente para o painel master: dados de
 * configuração e todas as lojas, inclusive as desativadas — é justamente
 * o botão de ativar/desativar que o painel expõe.
 */
export async function buscarOrganizacaoComoAdmin(organizationId: string) {
  const ctx = await getTenantContext();
  if (!isPlatformAdmin(ctx)) {
    throw new Error("Acesso restrito ao painel master.");
  }

  const organizacao = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      id: true,
      nome: true,
      slug: true,
      status: true,
      plano: true,
      interna: true,
      createdAt: true,
      stores: {
        select: { id: true, nome: true, ativa: true, createdAt: true },
        orderBy: { nome: "asc" },
      },
      _count: { select: { users: true, customers: true } },
    },
  });

  // A organização interna do time Alira não é uma empresa cliente — não
  // aparece na listagem e também não deve ser editável por essa tela.
  if (!organizacao || organizacao.interna) {
    throw new Error("Organização não encontrada.");
  }

  return organizacao;
}

/** Atualiza status e plano de uma organização cliente. */
export async function atualizarOrganizacaoComoAdmin(
  organizationId: string,
  dados: { status: OrganizationStatus; plano: string | null },
): Promise<void> {
  const ctx = await getTenantContext();
  if (!isPlatformAdmin(ctx)) {
    throw new Error("Acesso restrito ao painel master.");
  }

  await prisma.organization.update({
    where: { id: organizationId, interna: false },
    data: { status: dados.status, plano: dados.plano },
  });
}

/**
 * Ativa ou desativa o acesso a uma loja de uma organização cliente.
 * Uma loja desativada some do seletor de todo mundo na organização — é o
 * mecanismo de "acesso" que já existe (`getSession` só lista `ativa: true`),
 * só que agora acionável pelo painel master, não só por quem já está dentro.
 */
export async function alternarAcessoLojaComoAdmin(
  storeId: string,
  ativa: boolean,
): Promise<void> {
  const ctx = await getTenantContext();
  if (!isPlatformAdmin(ctx)) {
    throw new Error("Acesso restrito ao painel master.");
  }

  await prisma.store.update({
    where: { id: storeId },
    data: { ativa },
  });
}

/**
 * Integração de WhatsApp (n8n + Evolution API) da organização da sessão.
 *
 * Gera o token do webhook inbound na primeira vez que a tela é aberta — antes
 * disso não existe URL para mostrar em Configurações.
 */
export async function carregarIntegracaoWhatsapp(): Promise<{
  n8nWebhookUrl: string | null;
  token: string;
}> {
  const ctx = await getTenantContext();

  const organizacao = await prisma.organization.findUniqueOrThrow({
    where: { id: ctx.organizationId },
    select: { n8nWebhookUrl: true, whatsappWebhookToken: true },
  });

  const token =
    organizacao.whatsappWebhookToken ??
    (await gerarTokenWebhook(ctx.organizationId));

  return { n8nWebhookUrl: organizacao.n8nWebhookUrl, token };
}

async function gerarTokenWebhook(organizationId: string): Promise<string> {
  const token = crypto.randomBytes(24).toString("hex");
  await prisma.organization.update({
    where: { id: organizationId },
    data: { whatsappWebhookToken: token },
  });
  return token;
}

/** Salva a URL do webhook n8n de saída (organização da sessão). */
export async function salvarWebhookN8n(url: string | null): Promise<void> {
  const ctx = await getTenantContext();

  await prisma.organization.update({
    where: { id: ctx.organizationId },
    data: { n8nWebhookUrl: url },
  });
}

/**
 * URL do webhook n8n de saída, usada pelo disparo de mensagens.
 *
 * O organizationId aqui já foi resolvido pelo chamador (a partir da sessão) —
 * esta função só existe para não espalhar `prisma` cru por outros repositórios.
 */
export async function n8nWebhookUrlDaOrganizacao(
  organizationId: string,
): Promise<string | null> {
  const organizacao = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { n8nWebhookUrl: true },
  });
  return organizacao?.n8nWebhookUrl ?? null;
}
