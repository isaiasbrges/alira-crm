import type { Task, TaskFilters } from "@/types/task";

export type TaskKpis = {
  total: number;
  pendentes: number;
  concluidas: number;
  atrasadas: number;
};

export function buildTaskKpis(tasks: Task[], referencia = new Date()): TaskKpis {
  return tasks.reduce<TaskKpis>(
    (acc, tarefa) => {
      acc.total += 1;
      if (tarefa.status === "concluida") acc.concluidas += 1;
      if (tarefa.status === "pendente") {
        acc.pendentes += 1;
        if (new Date(tarefa.venceEm) < referencia) acc.atrasadas += 1;
      }
      return acc;
    },
    { total: 0, pendentes: 0, concluidas: 0, atrasadas: 0 }
  );
}

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const busca = normalizar(filters.busca.trim());

  return tasks.filter((tarefa) => {
    if (busca) {
      const alvo = normalizar(`${tarefa.titulo} ${tarefa.clienteNome ?? ""} ${tarefa.vendedorNome}`);
      if (!alvo.includes(busca)) return false;
    }

    if (filters.vendedor !== "todos" && tarefa.vendedorId !== filters.vendedor) return false;
    if (filters.prioridade !== "todas" && tarefa.prioridade !== filters.prioridade) return false;
    if (filters.status !== "todos" && tarefa.status !== filters.status) return false;

    return true;
  });
}

/** Mais antiga primeiro, e pendente sempre antes de concluída/cancelada. */
export function ordenarTarefas(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.status === "pendente" && b.status !== "pendente") return -1;
    if (a.status !== "pendente" && b.status === "pendente") return 1;
    return new Date(a.venceEm).getTime() - new Date(b.venceEm).getTime();
  });
}
