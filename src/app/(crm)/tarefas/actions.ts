"use server";

import { alternarConclusaoTarefa, criarTarefa } from "@/repositories/tasks";
import type { TaskPriority } from "@/types/task";

export type CriarTarefaState = {
  erro?: string;
};

export async function criarTarefaAction(
  _prevState: CriarTarefaState,
  formData: FormData,
): Promise<CriarTarefaState> {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const clienteId = String(formData.get("clienteId") ?? "").trim();
  const vendedorId = String(formData.get("vendedorId") ?? "").trim();
  const prioridade = String(
    formData.get("prioridade") ?? "media",
  ) as TaskPriority;
  const venceEm = String(formData.get("venceEm") ?? "").trim();

  if (!titulo) return { erro: "Informe o título da tarefa." };
  if (!vendedorId) return { erro: "Selecione o responsável." };

  await criarTarefa({
    titulo,
    clienteId: clienteId || null,
    vendedorId,
    prioridade,
    venceEm: venceEm || null,
  });

  return {};
}

export async function alternarTarefaAction(id: string): Promise<void> {
  await alternarConclusaoTarefa(id);
}
