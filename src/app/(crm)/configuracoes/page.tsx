import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Configurações · Alira CRM",
};

export default function ConfiguracoesPage() {
  return (
    <ModulePlaceholder
      titulo="Configurações"
      descricao="Dados da loja, usuários, vendedores e integrações."
      proximosPassos={[
        "Perfil da loja e identidade visual",
        "Usuários, papéis e vendedores",
        "Credenciais das integrações externas",
      ]}
    />
  );
}
