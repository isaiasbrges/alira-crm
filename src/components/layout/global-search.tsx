"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Megaphone, Package, ShoppingBag, UserRound } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  MOCK_SEARCH_RESULTS,
  SEARCH_GROUP_LABELS,
  type SearchResultKind,
} from "@/mocks/search";

const KIND_ICONS: Record<SearchResultKind, React.ElementType> = {
  cliente: UserRound,
  produto: Package,
  venda: ShoppingBag,
  campanha: Megaphone,
};

const KIND_ORDER: SearchResultKind[] = ["cliente", "produto", "venda", "campanha"];

type GlobalSearchProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();

  function handleSelect(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar clientes, produtos, vendas..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        {KIND_ORDER.map((kind) => {
          const results = MOCK_SEARCH_RESULTS.filter((item) => item.kind === kind);
          if (results.length === 0) return null;
          const Icon = KIND_ICONS[kind];

          return (
            <CommandGroup key={kind} heading={SEARCH_GROUP_LABELS[kind]}>
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.titulo} ${result.descricao}`}
                  onSelect={() => handleSelect(result.href)}
                >
                  <Icon />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">{result.titulo}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {result.descricao}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
