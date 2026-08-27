"use client";

import type { Workspace } from "@/types/navigation";
import type { TeamMember } from "@/types/team";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/general-settings";
import { IntegrationsSettings } from "@/components/settings/integrations-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { TeamTable } from "@/components/settings/team-table";

type SettingsTabsProps = {
  workspace: Workspace;
  team: TeamMember[];
  integracoes: {
    n8nWebhookUrl: string | null;
    inboundWebhookUrl: string;
  };
  pdv: {
    storeId: string;
    temSenha: boolean;
    podeGerenciar: boolean;
  };
};

export function SettingsTabs({
  workspace,
  team,
  integracoes,
  pdv,
}: SettingsTabsProps) {
  return (
    <Tabs defaultValue="geral">
      <TabsList>
        <TabsTrigger value="geral">Geral</TabsTrigger>
        <TabsTrigger value="usuarios">Usuários</TabsTrigger>
        <TabsTrigger value="integracoes">Integrações</TabsTrigger>
        <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
      </TabsList>

      <TabsContent value="geral" className="mt-5">
        <GeneralSettings workspace={workspace} pdv={pdv} />
      </TabsContent>

      <TabsContent value="usuarios" className="mt-5">
        <TeamTable team={team} />
      </TabsContent>

      <TabsContent value="integracoes" className="mt-5">
        <IntegrationsSettings
          n8nWebhookUrl={integracoes.n8nWebhookUrl}
          inboundWebhookUrl={integracoes.inboundWebhookUrl}
        />
      </TabsContent>

      <TabsContent value="notificacoes" className="mt-5">
        <NotificationSettings />
      </TabsContent>
    </Tabs>
  );
}
