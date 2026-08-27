"use client";

import * as React from "react";

import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/components/sales/pdv/types";

type VariantPickerDialogProps = {
  produto: Product | null;
  onClose: () => void;
  onAdd: (item: CartItem) => void;
};

export function VariantPickerDialog({ produto, onClose, onAdd }: VariantPickerDialogProps) {
  const [variantId, setVariantId] = React.useState<string | null>(null);
  const [quantidade, setQuantidade] = React.useState(1);

  // Zera a seleção quando o produto muda, sem efeito: ajustar estado durante a
  // própria renderização evita o quadro extra que um useEffect causaria. Os
  // dois lados da comparação precisam do mesmo tipo — comparar o `undefined`
  // de `produto?.id` direto com o `null` do estado nunca converge e trava em
  // loop, porque cada um representa "sem produto" de um jeito diferente.
  const idAtual = produto?.id ?? null;
  const [produtoAnteriorId, setProdutoAnteriorId] = React.useState<string | null>(idAtual);
  if (idAtual !== produtoAnteriorId) {
    setProdutoAnteriorId(idAtual);
    setVariantId(null);
    setQuantidade(1);
  }

  const variante = produto?.variantes.find((item) => item.id === variantId) ?? null;

  function confirmar() {
    if (!produto || !variante) return;

    onAdd({
      variantId: variante.id,
      produtoNome: produto.nome,
      tamanho: variante.tamanho,
      cor: variante.cor,
      precoUnitario: produto.preco,
      quantidade,
      estoqueDisponivel: variante.estoque,
    });
    onClose();
  }

  return (
    <Dialog open={Boolean(produto)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {produto && (
          <>
            <DialogHeader>
              <DialogTitle>{produto.nome}</DialogTitle>
              <DialogDescription>
                {formatCurrency(produto.preco)} · Escolha tamanho e cor
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {produto.variantes.map((item) => {
                const esgotado = item.estoque === 0;
                const selecionado = item.id === variantId;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={esgotado}
                    onClick={() => setVariantId(item.id)}
                    className={cn(
                      "flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2 text-left transition-colors",
                      esgotado && "cursor-not-allowed opacity-40",
                      selecionado
                        ? "border-primary bg-accent"
                        : "border-border hover:border-input"
                    )}
                  >
                    <span className="text-sm font-medium">
                      {item.tamanho} · {item.cor}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {esgotado ? "Esgotado" : `${item.estoque} em estoque`}
                    </span>
                  </button>
                );
              })}
            </div>

            {variante && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
                <span className="text-sm text-muted-foreground">Quantidade</span>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={() => setQuantidade((valor) => Math.max(1, valor - 1))}
                  >
                    −
                  </Button>
                  <span className="w-6 text-center text-sm font-medium tabular-nums">
                    {quantidade}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={() =>
                      setQuantidade((valor) => Math.min(variante.estoque, valor + 1))
                    }
                    disabled={quantidade >= variante.estoque}
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="button" onClick={confirmar} disabled={!variante}>
                Adicionar ao carrinho
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
