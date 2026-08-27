"use client";

import * as React from "react";
import { PackageSearch, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/product";
import { estoqueTotal } from "@/types/product";
import { MOCK_PRODUCTS } from "@/mocks/products";
import { Input } from "@/components/ui/input";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function ProductPicker({ onSelect }: { onSelect: (produto: Product) => void }) {
  const [busca, setBusca] = React.useState("");

  const resultados = React.useMemo(() => {
    const disponiveis = MOCK_PRODUCTS.filter((produto) => produto.status === "ativo");
    const termo = normalizar(busca.trim());
    if (!termo) return disponiveis;

    return disponiveis.filter((produto) =>
      normalizar(`${produto.nome} ${produto.sku}`).includes(termo)
    );
  }, [busca]);

  return (
    <div className="flex h-full flex-col">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Buscar produto por nome ou SKU"
          aria-label="Buscar produto"
          className="pl-9"
        />
      </div>

      <div className="mt-4 grid flex-1 auto-rows-min grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 xl:grid-cols-4">
        {resultados.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center gap-2 py-16 text-center">
            <PackageSearch className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        )}

        {resultados.map((produto) => {
          const total = estoqueTotal(produto);
          const esgotado = total === 0;

          return (
            <button
              key={produto.id}
              type="button"
              disabled={esgotado}
              onClick={() => onSelect(produto)}
              className={cn(
                "flex flex-col items-start gap-1 rounded-xl border border-border bg-card p-3 text-left shadow-sm transition-colors hover:border-input",
                esgotado && "cursor-not-allowed opacity-40"
              )}
            >
              <span className="line-clamp-2 text-sm font-medium">{produto.nome}</span>
              <span className="text-xs text-muted-foreground">{produto.sku}</span>
              <span className="mt-1 text-sm font-semibold">{formatCurrency(produto.preco)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
