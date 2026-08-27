"use client";

import { Bell, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

type HeaderProps = {
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
};

/**
 * Barra superior: busca global e notificações.
 *
 * A identificação da loja fica na sidebar e a da página no cabeçalho de
 * conteúdo, então aqui não há breadcrumb.
 */
export function Header({ onOpenMobileNav, onOpenSearch }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 px-4 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenMobileNav}
        aria-label="Abrir menu"
        className="lg:hidden"
      >
        <Menu />
      </Button>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex h-10 items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 text-left text-sm text-muted-foreground shadow-sm transition-colors hover:border-input sm:w-72 lg:w-80"
        >
          <Search className="size-4 shrink-0" />
          <span className="hidden truncate sm:block">
            Buscar cliente, pedido, produto...
          </span>
          <kbd className="ml-auto hidden shrink-0 rounded-md border border-border px-1.5 py-0.5 font-sans text-[10px] text-muted-foreground sm:block">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          aria-label="Notificações"
          className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-secondary"
        >
          <Bell className="size-[18px]" />
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
