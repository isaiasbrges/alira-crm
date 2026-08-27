export type TaskStatus = "pendente" | "concluida" | "cancelada";
export type TaskPriority = "alta" | "media" | "baixa";

export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  clienteNome?: string;
  vendedorId: string;
  vendedorNome: string;
  prioridade: TaskPriority;
  status: TaskStatus;
  venceEm: string;
};

export type TaskFilters = {
  busca: string;
  vendedor: string;
  prioridade: TaskPriority | "todas";
  status: TaskStatus | "todos";
};

export const TASK_FILTERS_DEFAULT: TaskFilters = {
  busca: "",
  vendedor: "todos",
  prioridade: "todas",
  status: "todos",
};
