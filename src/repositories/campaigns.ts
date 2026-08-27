import "server-only";

import type {
  Prisma,
  CampaignStatus as DbCampaignStatus,
} from "@prisma/client";

import { getTenantContext } from "@/lib/tenant/context";
import { tenantDb } from "@/lib/tenant/db";
import { listarClientesTela } from "@/repositories/customers";
import { resolverSegmento } from "@/services/segment-engine";
import type { SegmentLogic, SegmentRule } from "@/types/segment";
import type { Campaign, CampaignStatus } from "@/types/campaign";

const STATUS_PARA_TELA: Record<string, CampaignStatus> = {
  RASCUNHO: "rascunho",
  AGENDADA: "agendada",
  ENVIANDO: "enviando",
  ENVIADA: "enviada",
  PAUSADA: "pausada",
  CANCELADA: "cancelada",
};

type RegrasArmazenadas = { logica: SegmentLogic; regras: SegmentRule[] };

function ehRegrasArmazenadas(valor: unknown): valor is RegrasArmazenadas {
  return (
    typeof valor === "object" &&
    valor !== null &&
    "logica" in valor &&
    "regras" in valor &&
    Array.isArray((valor as RegrasArmazenadas).regras)
  );
}

type CampanhaComRelacoes = Prisma.CampaignGetPayload<{
  include: { segment: { select: { nome: true; regras: true } } };
}>;

/**
 * Lista as campanhas da loja ativa. `destinatarios` é sempre recalculado ao
 * vivo contra o segmento (mesmo motor do construtor) — não existe disparo
 * real ainda, então não há `CampaignRecipient` para contar de verdade.
 */
export async function listarCampanhasTela(): Promise<Campaign[]> {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  const [campanhas, { clientes }] = await Promise.all([
    db.campaign.findMany({
      where: { storeId: ctx.storeId ?? undefined },
      include: { segment: { select: { nome: true, regras: true } } },
      orderBy: { createdAt: "desc" },
    }),
    listarClientesTela(),
  ]);

  return campanhas.map((campanha) =>
    mapearCampanhaParaTela(campanha, clientes),
  );
}

function mapearCampanhaParaTela(
  campanha: CampanhaComRelacoes,
  clientes: Awaited<ReturnType<typeof listarClientesTela>>["clientes"],
): Campaign {
  const armazenado = ehRegrasArmazenadas(campanha.segment?.regras)
    ? campanha.segment!.regras
    : null;

  const destinatarios = armazenado
    ? resolverSegmento(clientes, armazenado.regras, armazenado.logica).length
    : 0;

  return {
    id: campanha.id,
    nome: campanha.nome,
    status: STATUS_PARA_TELA[campanha.status] ?? "rascunho",
    segmentoId: campanha.segmentId ?? undefined,
    segmentoNome: campanha.segment?.nome ?? "—",
    templateNome: campanha.templateNome ?? "",
    destinatarios,
    agendadaPara: campanha.agendadaPara?.toISOString(),
    enviadaEm: campanha.enviadaEm?.toISOString(),
  };
}

export type CriarCampanhaInput = {
  nome: string;
  segmentoId: string;
  templateNome: string;
  agendadaPara?: string | null;
};

export async function criarCampanha(
  input: CriarCampanhaInput,
): Promise<Campaign> {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  if (!ctx.storeId) {
    throw new Error("Nenhuma loja ativa na sessão.");
  }

  const segmento = await db.segment.findUnique({
    where: { id: input.segmentoId },
    select: { regras: true },
  });
  if (!segmento) throw new Error("Segmento não encontrado.");

  const status: DbCampaignStatus = input.agendadaPara ? "AGENDADA" : "RASCUNHO";

  const campanha = await db.campaign.create({
    data: {
      organizationId: ctx.organizationId,
      storeId: ctx.storeId,
      segmentId: input.segmentoId,
      nome: input.nome,
      status,
      templateNome: input.templateNome || null,
      // Cópia das regras no momento da criação — preserva o alcance original
      // mesmo que o segmento de origem seja editado depois.
      segmentoRegras: segmento.regras ?? undefined,
      agendadaPara: input.agendadaPara ? new Date(input.agendadaPara) : null,
    },
    include: { segment: { select: { nome: true, regras: true } } },
  });

  const { clientes } = await listarClientesTela();
  return mapearCampanhaParaTela(campanha, clientes);
}
