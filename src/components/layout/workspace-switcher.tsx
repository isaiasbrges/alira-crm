"use client";

import { Check, ChevronsUpDown, Store as StoreIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Workspace } from "@/types/navigation";
import { MOCK_STORES } from "@/mocks/workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type WorkspaceSwitcherProps = {
  workspace: Workspace;
  collapsed: boolean;
};

export function WorkspaceSwitcher({ workspace, collapsed }: WorkspaceSwitcherProps) {
  const { organization, store } = workspace;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Trocar de loja"
        className={cn(
          "flex items-center gap-2.5 rounded-md text-left transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          collapsed ? "size-9 justify-center" : "h-11 w-full px-2"
        )}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-[0_0_16px_-4px_rgb(59_130_246/0.9)]">
          <StoreIcon className="size-3.5" />
        </span>

        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-sidebar-foreground">
                {organization.nome}
              </span>
              <span className="block truncate text-[11px] text-sidebar-foreground/45">
                {store.nome}
              </span>
            </span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-sidebar-foreground/40" />
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuLabel>{organization.nome}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MOCK_STORES.map((item) => (
          <DropdownMenuItem key={item.id} className="gap-2">
            <StoreIcon className="size-4" />
            <span className="flex-1 truncate">{item.nome}</span>
            {item.id === store.id && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-xs">
          Adicionar loja — em breve
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
