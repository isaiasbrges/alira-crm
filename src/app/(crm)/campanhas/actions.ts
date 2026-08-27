"use server";

import {
  criarCampanha,
  type CriarCampanhaInput,
} from "@/repositories/campaigns";
import type { Campaign } from "@/types/campaign";

export type CriarCampanhaResult = {
  erro?: string;
  campanha?: Campaign;
};

export async function criarCampanhaAction(
  input: CriarCampanhaInput,
): Promise<CriarCampanhaResult> {
  if (!input.nome.trim()) return { erro: "Informe o nome da campanha." };
  if (!input.segmentoId) return { erro: "Selecione um segmento." };

  try {
    const campanha = await criarCampanha(input);
    return { campanha };
  } catch (erro) {
    if (erro instanceof Error) return { erro: erro.message };
    throw erro;
  }
}
