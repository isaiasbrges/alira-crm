"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { isRouteActive } from "@/lib/navigation";
import type { CurrentUser, NavItem, NavSection, Workspace } from "@/types/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { SidebarUserMenu } from "@/components/layout/sidebar-user-menu";

type DashboardSidebarProps = {
  sections: NavSection[];
  workspace: Workspace;
  user: CurrentUser;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenSearch: () => void;
  /** No Sheet mobile a sidebar nunca colapsa e o rodapé de colapso some. */
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function DashboardSidebar({
  sections,
  workspace,
  user,
  collapsed,
  onToggleCollapsed,
  variant = "desktop",
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const isCollapsed = variant === "mobile" ? false : collapsed;

  return (
    <div className="sidebar-surface flex h-full flex-col text-sidebar-foreground">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center",
          isCollapsed ? "justify-center px-2" : "px-5"
        )}
      >
        <BrandMark collapsed={isCollapsed} />
      </div>

      <div className={cn("shrink-0 pb-4", isCollapsed ? "px-2" : "px-3")}>
        <WorkspaceSwitcher workspace={workspace} collapsed={isCollapsed} />
      </div>

      <nav
        aria-label="Navegação principal"
        className="flex-1 overflow-y-auto overflow-x-hidden pb-4"
      >
        {sections.map((section) => (
          <div key={section.id} className={cn(isCollapsed ? "px-2" : "px-3")}>
            {section.label && !isCollapsed && (
              <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted">
                {section.label}
              </div>
            )}

            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <SidebarNavItem
                    item={item}
                    pathname={pathname}
                    collapsed={isCollapsed}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="shrink-0 px-3 pb-4">
          <InsightsCard />
        </div>
      )}

      <div
        className={cn(
          "shrink-0 border-t border-sidebar-border py-3",
          isCollapsed ? "px-2" : "px-3"
        )}
      >
        <SidebarUserMenu user={user} collapsed={isCollapsed} />

        {variant === "desktop" && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
            className={cn(
              "mt-2 flex h-8 w-full items-center gap-2 rounded-lg text-xs font-medium text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              isCollapsed ? "justify-center px-0" : "px-2"
            )}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <>
                <PanelLeftClose className="size-4" />
                <span>Recolher</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function BrandMark({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <span className="text-xl font-semibold tracking-tight text-white" aria-label="Alira CRM">
        A
      </span>
    );
  }

  return (
    <span className="flex items-baseline gap-2">
      <span className="text-[22px] font-semibold tracking-tight text-white">Alira</span>
      <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">
        CRM
      </span>
    </span>
  );
}

/** Chamada para o assistente de insights — ainda sem destino, como na referência. */
function InsightsCard() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#152a63] to-[#1b3a86] p-4">
      <Sparkles className="absolute right-3 top-3 size-8 text-white/15" />

      <div className="flex items-center gap-1.5">
        <Sparkles className="size-3.5 text-sky-300" />
        <span className="text-sm font-semibold text-white">Alira Insights</span>
      </div>

      <p className="mt-1.5 text-xs leading-5 text-white/60">
        Descubra padrões e oportunidades
      </p>

      <button
        type="button"
        disabled
        className="mt-3 h-8 w-full rounded-lg bg-white/10 text-xs font-medium text-white transition-colors hover:bg-white/15 disabled:opacity-60"
      >
        Explorar
      </button>
    </div>
  );
}

function SidebarNavItem({
  item,
  pathname,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const active = isRouteActive(pathname, item.href);
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-10 items-center gap-3 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        collapsed ? "w-full justify-center px-0" : "px-3",
        active
          ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground"
          : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      <Icon className="size-[18px] shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
