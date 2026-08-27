"use server";

import {
  criarSegmento,
  excluirSegmento,
  type CriarSegmentoInput,
} from "@/repositories/segments";
import type { Segment } from "@/types/segment";

export type CriarSegmentoResult = {
  erro?: string;
  segmento?: Segment;
};

export async function criarSegmentoAction(
  input: CriarSegmentoInput,
): Promise<CriarSegmentoResult> {
  if (!input.nome.trim()) return { erro: "Informe o nome do segmento." };

  const segmento = await criarSegmento(input);
  return { segmento };
}

export async function excluirSegmentoAction(id: string): Promise<void> {
  await excluirSegmento(id);
}
