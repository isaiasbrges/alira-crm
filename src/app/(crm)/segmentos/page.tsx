import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Segmentos · Alira CRM",
};

export default function SegmentosPage() {
  return (
    <ModulePlaceholder
      titulo="Segmentos"
      descricao="Construtor de regras para agrupar clientes e alimentar campanhas."
      proximosPassos={[
        "Regras combináveis com AND e OR",
        "Critérios de última compra, categoria, ticket médio, tamanho e status",
        "Prévia da audiência antes de salvar o segmento",
      ]}
    />
  );
}
