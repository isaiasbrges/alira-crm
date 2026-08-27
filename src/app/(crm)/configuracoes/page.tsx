import type { Metadata } from "next";

import { getTenantContext } from "@/lib/tenant/context";
import { carregarWorkspace } from "@/lib/tenant/workspace";
import { carregarIntegracaoWhatsapp } from "@/repositories/organizations";
import { lojaAtivaPdv } from "@/repositories/pdv-lock";
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
  const [{ workspace }, team, integracaoWhatsapp, pdv, ctx] = await Promise.all([
    carregarWorkspace(),
    listarUsuariosTela(),
    carregarIntegracaoWhatsapp(),
    lojaAtivaPdv(),
    getTenantContext(),
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
      <SettingsTabs
        workspace={workspace}
        team={team}
        integracoes={integracoes}
        pdv={{
          storeId: pdv.id,
          temSenha: pdv.temSenha,
          podeGerenciar: ctx.role === "OWNER" || ctx.role === "MANAGER",
        }}
        podeGerenciarAcesso={ctx.role === "OWNER" || ctx.role === "MANAGER"}
      />
    </>
  );
}
