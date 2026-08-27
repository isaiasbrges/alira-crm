"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Plus, Store as StoreIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { trocarLojaAction } from "@/lib/auth/actions";
import type { Workspace } from "@/types/navigation";
import { AddStoreDialog } from "@/components/layout/add-store-dialog";
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

function iniciais(nome: string): string {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

export function WorkspaceSwitcher({
  workspace,
  collapsed,
}: WorkspaceSwitcherProps) {
  const { organization, store, stores } = workspace;
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [addStoreOpen, setAddStoreOpen] = React.useState(false);

  function selecionarLoja(storeId: string) {
    if (storeId === store.id) return;
    startTransition(async () => {
      await trocarLojaAction(storeId);
      router.refresh();
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Trocar de loja"
          className={cn(
            "flex items-center gap-3 rounded-xl bg-white/[0.06] text-left transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            collapsed ? "size-10 w-full justify-center" : "h-14 w-full px-3",
          )}
        >
          {store.logoUrl ? (
            // Data URI ou URL arbitrária de upload — sem domínio fixo para o
            // otimizador do next/image configurar.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={store.logoUrl}
              alt={store.nome}
              className="size-9 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-xs font-semibold text-white">
              {iniciais(organization.nome)}
            </span>
          )}

          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-sidebar-foreground">
                  {organization.nome}
                </span>
                <span className="block truncate text-[11px] text-sidebar-muted">
                  {store.nome}
                </span>
              </span>
              <ChevronDown className="size-4 shrink-0 text-sidebar-muted" />
            </>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuLabel>{organization.nome}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {stores.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className="gap-2"
              disabled={pending}
              onClick={() => selecionarLoja(item.id)}
            >
              {item.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.logoUrl}
                  alt={item.nome}
                  className="size-4 shrink-0 rounded-sm object-cover"
                />
              ) : (
                <StoreIcon className="size-4" />
              )}
              <span className="flex-1 truncate">{item.nome}</span>
              {item.id === store.id && <Check className="size-4" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2"
            onSelect={(event) => {
              event.preventDefault();
              setAddStoreOpen(true);
            }}
          >
            <Plus className="size-4" />
            Adicionar loja
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddStoreDialog open={addStoreOpen} onOpenChange={setAddStoreOpen} />
    </>
  );
}
