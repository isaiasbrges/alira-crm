"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "@/lib/navigation";
import type { CurrentUser, Workspace } from "@/types/navigation";
import { useCommandShortcut } from "@/hooks/use-command-shortcut";
import { DashboardSidebar } from "@/components/ui/dashboard-sidebar";
import { GlobalSearch } from "@/components/layout/global-search";
import { Header } from "@/components/layout/header";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";

type AppShellProps = {
  children: React.ReactNode;
  /** Resolvido no servidor a partir da sessão; o cliente só exibe. */
  workspace: Workspace;
  user: CurrentUser;
};

export function AppShell({ children, workspace, user }: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const openSearch = React.useCallback(() => setSearchOpen(true), []);
  useCommandShortcut("k", openSearch);

  return (
    <TooltipProvider>
      <div className="flex min-h-dvh w-full">
        <aside
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 transition-[width] duration-200 lg:block",
            collapsed ? "w-[68px]" : "w-[264px]"
          )}
        >
          <DashboardSidebar
            sections={NAV_SECTIONS}
            workspace={workspace}
            user={user}
            collapsed={collapsed}
            onToggleCollapsed={() => setCollapsed((value) => !value)}
            onOpenSearch={openSearch}
          />
        </aside>

        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="w-[272px] p-0" showCloseButton={false}>
            <SheetHeader className="sr-only">
              <SheetTitle>Navegação</SheetTitle>
            </SheetHeader>
            <DashboardSidebar
              sections={NAV_SECTIONS}
              workspace={workspace}
              user={user}
              collapsed={false}
              onToggleCollapsed={() => undefined}
              onOpenSearch={() => {
                setMobileNavOpen(false);
                openSearch();
              }}
              variant="mobile"
              onNavigate={() => setMobileNavOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            workspaceLabel={workspace.organization.nome}
            user={user}
            onOpenMobileNav={() => setMobileNavOpen(true)}
            onOpenSearch={openSearch}
          />

          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>

        <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
      </div>
    </TooltipProvider>
  );
}
