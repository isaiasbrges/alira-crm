import type { Metadata } from "next";

import { carregarWorkspace } from "@/lib/tenant/workspace";
import { listarUsuariosTela } from "@/repositories/users";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsTabs } from "@/components/settings/settings-tabs";

export const metadata: Metadata = {
  title: "Configurações · Alira CRM",
};

export default async function ConfiguracoesPage() {
  const [{ workspace }, team] = await Promise.all([
    carregarWorkspace(),
    listarUsuariosTela(),
  ]);

  return (
    <>
      <PageHeader
        titulo="Configurações"
        descricao="Dados da loja, usuários e notificações."
      />
      <SettingsTabs workspace={workspace} team={team} />
    </>
  );
}
