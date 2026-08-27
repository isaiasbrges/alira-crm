import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Atendimentos · Alira CRM",
};

export default function AtendimentosPage() {
  return (
    <ModulePlaceholder
      titulo="Atendimentos"
      descricao="Conversas com clientes, histórico por pessoa e fila da equipe."
      proximosPassos={[
        "Caixa de entrada unificada das conversas de WhatsApp",
        "Histórico de atendimento vinculado à ficha do cliente",
        "Atribuição de conversas a vendedores e status de resolução",
      ]}
    />
  );
}
