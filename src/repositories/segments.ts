import "server-only";

import { getTenantContext } from "@/lib/tenant/context";
import { tenantDb } from "@/lib/tenant/db";
import type { Segment, SegmentLogic, SegmentRule } from "@/types/segment";

type RegrasArmazenadas = {
  logica: SegmentLogic;
  regras: SegmentRule[];
};

function ehRegrasArmazenadas(valor: unknown): valor is RegrasArmazenadas {
  return (
    typeof valor === "object" &&
    valor !== null &&
    "logica" in valor &&
    "regras" in valor &&
    Array.isArray((valor as RegrasArmazenadas).regras)
  );
}

/** Segmentos da loja ativa (mais os da organização inteira, sem loja). */
export async function listarSegmentosTela(): Promise<Segment[]> {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  const segmentos = await db.segment.findMany({
    where: { OR: [{ storeId: ctx.storeId ?? undefined }, { storeId: null }] },
    orderBy: { createdAt: "desc" },
  });

  return segmentos.map((segmento) => {
    const armazenado = ehRegrasArmazenadas(segmento.regras)
      ? segmento.regras
      : { logica: "AND" as SegmentLogic, regras: [] };

    return {
      id: segmento.id,
      nome: segmento.nome,
      descricao: segmento.descricao ?? undefined,
      logica: armazenado.logica,
      regras: armazenado.regras,
      createdAt: segmento.createdAt.toISOString(),
    };
  });
}

export type CriarSegmentoInput = {
  nome: string;
  descricao?: string | null;
  logica: SegmentLogic;
  regras: SegmentRule[];
};

export async function criarSegmento(
  input: CriarSegmentoInput,
): Promise<Segment> {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);

  const segmento = await db.segment.create({
    data: {
      organizationId: ctx.organizationId,
      storeId: ctx.storeId,
      nome: input.nome,
      descricao: input.descricao ?? null,
      regras: { logica: input.logica, regras: input.regras },
    },
  });

  return {
    id: segmento.id,
    nome: segmento.nome,
    descricao: segmento.descricao ?? undefined,
    logica: input.logica,
    regras: input.regras,
    createdAt: segmento.createdAt.toISOString(),
  };
}

export async function excluirSegmento(id: string): Promise<void> {
  const db = await tenantDb(await getTenantContext());
  await db.segment.delete({ where: { id } });
}
