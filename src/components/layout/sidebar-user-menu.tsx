"use client";

import { CircleUser, LogOut, Settings } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { CurrentUser } from "@/types/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SidebarUserMenuProps = {
  user: CurrentUser;
  collapsed: boolean;
};

export function SidebarUserMenu({ user, collapsed }: SidebarUserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menu do usuário"
        className={cn(
          "flex items-center gap-2.5 rounded-lg transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          collapsed ? "size-9 w-full justify-center" : "h-12 w-full px-2 text-left"
        )}
      >
        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="bg-white/10 text-[11px] font-medium text-sidebar-foreground">
            {user.iniciais}
          </AvatarFallback>
        </Avatar>

        {!collapsed && (
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-sidebar-foreground">
              {user.nome}
            </span>
            <span className="block truncate text-[11px] text-sidebar-muted">
              {user.funcao}
            </span>
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" side="top" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <span className="block text-sm font-medium text-foreground">{user.nome}</span>
          <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/configuracoes">
            <CircleUser />
            Meu perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/configuracoes">
            <Settings />
            Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" disabled>
          <LogOut />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
