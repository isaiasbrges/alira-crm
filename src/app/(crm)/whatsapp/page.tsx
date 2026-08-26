import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "WhatsApp · Alira CRM",
};

export default function WhatsappPage() {
  return (
    <ModulePlaceholder
      titulo="WhatsApp"
      descricao="Integração com a Meta WhatsApp Cloud API, templates e consentimentos."
      proximosPassos={[
        "Conexão com a Cloud API e verificação do webhook",
        "Sincronização dos templates aprovados",
        "Registro de consentimento, opt-out e suppression list (LGPD)",
      ]}
    />
  );
}
