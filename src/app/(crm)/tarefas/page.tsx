import type { Metadata } from "next";

import { TasksView } from "@/components/tasks/tasks-view";

export const metadata: Metadata = {
  title: "Tarefas · Alira CRM",
};

export default function TarefasPage() {
  return <TasksView />;
}
