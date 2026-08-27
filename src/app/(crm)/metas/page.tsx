import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Metas · Alira CRM",
};

export default function MetasPage() {
  return (
    <ModulePlaceholder
      titulo="Metas"
      descricao="Objetivos de venda por loja e por vendedor, com acompanhamento no período."
      proximosPassos={[
        "Definição de meta mensal por loja e por vendedor",
        "Acompanhamento do realizado contra o previsto",
        "Alertas quando o ritmo do mês ficar abaixo da meta",
      ]}
    />
  );
}
