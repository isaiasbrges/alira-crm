"use client";

import type { Workspace } from "@/types/navigation";
import { MOCK_TEAM } from "@/mocks/team";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/general-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { TeamTable } from "@/components/settings/team-table";

export function SettingsTabs({ workspace }: { workspace: Workspace }) {
  return (
    <Tabs defaultValue="geral">
      <TabsList>
        <TabsTrigger value="geral">Geral</TabsTrigger>
        <TabsTrigger value="usuarios">Usuários</TabsTrigger>
        <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
      </TabsList>

      <TabsContent value="geral" className="mt-5">
        <GeneralSettings workspace={workspace} />
      </TabsContent>

      <TabsContent value="usuarios" className="mt-5">
        <TeamTable team={MOCK_TEAM} />
      </TabsContent>

      <TabsContent value="notificacoes" className="mt-5">
        <NotificationSettings />
      </TabsContent>
    </Tabs>
  );
}
