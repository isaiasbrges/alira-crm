import type { Metadata } from "next";

import { listarTarefasTela } from "@/repositories/tasks";
import { TasksView } from "@/components/tasks/tasks-view";

export const metadata: Metadata = {
  title: "Tarefas · Alira CRM",
};

export default async function TarefasPage() {
  const { tarefas, vendedores, clientes } = await listarTarefasTela();

  return (
    <TasksView tarefas={tarefas} vendedores={vendedores} clientes={clientes} />
  );
}
