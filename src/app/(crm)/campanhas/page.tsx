import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Campanhas · Alira CRM",
};

export default function CampanhasPage() {
  return (
    <ModulePlaceholder
      titulo="Campanhas"
      descricao="Envios segmentados por WhatsApp e a receita originada por eles."
      proximosPassos={[
        "Criação de campanha a partir de um segmento salvo",
        "Escolha de template aprovado e agendamento do disparo",
        "Acompanhamento de entregues, lidas, respondidas e receita atribuída",
      ]}
    />
  );
}
