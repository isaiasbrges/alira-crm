import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Tarefas · Alira CRM",
};

export default function TarefasPage() {
  return (
    <ModulePlaceholder
      titulo="Tarefas"
      descricao="Follow-ups e lembretes atribuídos aos vendedores."
      proximosPassos={[
        "Criação de tarefa vinculada a um cliente e responsável",
        "Prioridade, prazo e conclusão",
        "Agenda do dia por vendedor",
      ]}
    />
  );
}
