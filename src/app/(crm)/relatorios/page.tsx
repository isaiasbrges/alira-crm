import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Relatórios · Alira CRM",
};

export default function RelatoriosPage() {
  return (
    <ModulePlaceholder
      titulo="Relatórios"
      descricao="Recompra, ticket médio, reativação e desempenho por vendedor."
      proximosPassos={[
        "Relatório de recompra por período e por categoria",
        "Receita originada por campanha",
        "Exportação em CSV",
      ]}
    />
  );
}
