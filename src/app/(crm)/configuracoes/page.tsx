import type { Metadata } from "next";

import { carregarWorkspace } from "@/lib/tenant/workspace";
import { carregarIntegracaoWhatsapp } from "@/repositories/organizations";
import { listarUsuariosTela } from "@/repositories/users";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsTabs } from "@/components/settings/settings-tabs";

export const metadata: Metadata = {
  title: "Configurações · Alira CRM",
};

function resolverAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:4310";
}

export default async function ConfiguracoesPage() {
  const [{ workspace }, team, integracaoWhatsapp] = await Promise.all([
    carregarWorkspace(),
    listarUsuariosTela(),
    carregarIntegracaoWhatsapp(),
  ]);

  const integracoes = {
    n8nWebhookUrl: integracaoWhatsapp.n8nWebhookUrl,
    inboundWebhookUrl: `${resolverAppUrl()}/api/webhooks/whatsapp/${integracaoWhatsapp.token}`,
  };

  return (
    <>
      <PageHeader
        titulo="Configurações"
        descricao="Dados da loja, usuários, integrações e notificações."
      />
      <SettingsTabs workspace={workspace} team={team} integracoes={integracoes} />
    </>
  );
}
