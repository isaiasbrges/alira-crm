"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { isRouteActive } from "@/lib/navigation";
import type { NavItem, NavSection, Workspace } from "@/types/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { SidebarUserMenu } from "@/components/layout/sidebar-user-menu";

type DashboardSidebarProps = {
  sections: NavSection[];
  workspace: Workspace;
  user: { nome: string; funcao: string; email: string; iniciais: string };
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
  onOpenSearch,
  variant = "desktop",
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const isCollapsed = variant === "mobile" ? false : collapsed;

  return (
    <div className="flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground backdrop-blur-xl backdrop-saturate-150">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-sidebar-border",
          isCollapsed ? "justify-center px-2" : "px-3"
        )}
      >
        <WorkspaceSwitcher workspace={workspace} collapsed={isCollapsed} />
      </div>

      <div className={cn("shrink-0 py-3", isCollapsed ? "px-2" : "px-3")}>
        <SidebarSearchTrigger collapsed={isCollapsed} onOpenSearch={onOpenSearch} />
      </div>

      <nav
        aria-label="Navegação principal"
        className="flex-1 overflow-y-auto overflow-x-hidden pb-4"
      >
        {sections.map((section) => (
          <div key={section.id} className={cn("mb-5", isCollapsed ? "px-2" : "px-3")}>
            {section.label && !isCollapsed && (
              <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/40">
                {section.label}
              </div>
            )}
            {section.label && isCollapsed && (
              <div className="mx-auto mb-2 h-px w-6 bg-sidebar-border" />
            )}

            <ul className="space-y-0.5">
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
              "mt-2 flex h-8 w-full items-center gap-2 rounded-md text-xs font-medium text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
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

function SidebarSearchTrigger({
  collapsed,
  onOpenSearch,
}: {
  collapsed: boolean;
  onOpenSearch: () => void;
}) {
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Buscar"
            className="flex size-9 w-full items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <Search className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Buscar</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpenSearch}
      className="flex h-9 w-full items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-accent/60 px-2.5 text-left text-sm text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
    >
      <Search className="size-4 shrink-0" />
      <span className="truncate text-xs">Buscar...</span>
      <kbd className="ml-auto shrink-0 rounded border border-sidebar-border px-1.5 py-0.5 font-mono text-[10px] text-sidebar-foreground/40">
        ⌘K
      </kbd>
    </button>
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
  const hasChildren = Boolean(item.children?.length);

  // Sem escolha manual a seção acompanha a rota; o clique passa a mandar depois.
  const [manualExpanded, setManualExpanded] = React.useState<boolean | null>(null);
  const expanded = manualExpanded ?? active;

  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex h-9 items-center gap-2.5 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        collapsed ? "w-full justify-center px-0" : "px-2.5",
        active
          ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground shadow-[inset_0_0_0_1px_rgb(59_130_246/0.35),0_0_18px_-6px_rgb(59_130_246/0.55)]"
          : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && hasChildren && (
        <button
          type="button"
          aria-label={expanded ? `Recolher ${item.label}` : `Expandir ${item.label}`}
          aria-expanded={expanded}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setManualExpanded(!expanded);
          }}
          className="ml-auto rounded p-0.5 opacity-50 transition-opacity hover:opacity-100"
        >
          <ChevronRight
            className={cn("size-3.5 transition-transform", expanded && "rotate-90")}
          />
        </button>
      )}
    </Link>
  );

  return (
    <>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      ) : (
        link
      )}

      {!collapsed && hasChildren && expanded && (
        <ul className="mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3 ml-4">
          {item.children?.map((child) => {
            const childActive = pathname + "" === child.href;
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex h-8 items-center rounded-md px-2.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                    childActive
                      ? "text-sidebar-foreground"
                      : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground/80"
                  )}
                >
                  <span className="truncate">{child.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
