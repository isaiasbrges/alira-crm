"use client";

import { Bell, Menu, Search } from "lucide-react";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PeriodPicker } from "@/components/layout/period-picker";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MOCK_CURRENT_USER } from "@/mocks/workspace";

type HeaderProps = {
  workspaceLabel: string;
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
};

export function Header({ workspaceLabel, onOpenMobileNav, onOpenSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/55 px-4 backdrop-blur-xl backdrop-saturate-150 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenMobileNav}
        aria-label="Abrir menu"
        className="lg:hidden"
      >
        <Menu />
      </Button>

      <Breadcrumb root={workspaceLabel} />

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden h-9 w-64 items-center gap-2 rounded-md border border-input bg-card px-3 text-left text-sm text-muted-foreground shadow-xs transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 xl:flex"
        >
          <Search className="size-4 shrink-0" />
          <span className="truncate text-xs">Buscar clientes, produtos, vendas...</span>
          <kbd className="ml-auto shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">
            ⌘K
          </kbd>
        </button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSearch}
          aria-label="Buscar"
          className="xl:hidden"
        >
          <Search />
        </Button>

        <div className="hidden md:block">
          <PeriodPicker />
        </div>

        <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
          <Bell />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" />
        </Button>

        <Separator orientation="vertical" className="mx-1 hidden h-8 sm:block" />

        <div className="flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarFallback>{MOCK_CURRENT_USER.iniciais}</AvatarFallback>
          </Avatar>
          <div className="hidden leading-tight sm:block">
            <div className="text-sm font-medium">{MOCK_CURRENT_USER.nome}</div>
            <div className="text-[11px] text-muted-foreground">
              {MOCK_CURRENT_USER.funcao}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
