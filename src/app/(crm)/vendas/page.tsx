import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Vendas · Alira CRM",
};

export default function VendasPage() {
  return (
    <ModulePlaceholder
      titulo="Vendas"
      descricao="Histórico de vendas, trocas e o PDV Lite da loja."
      proximosPassos={[
        "Listagem de vendas com cliente, vendedor e forma de pagamento",
        "PDV Lite: selecionar cliente, buscar produto, aplicar desconto e finalizar",
        "Baixa automática de estoque e recálculo dos indicadores do cliente",
      ]}
    />
  );
}
