import { ShoppingBag, X } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/components/sales/pdv/types";
import { Button } from "@/components/ui/button";

type CartListProps = {
  itens: CartItem[];
  onRemove: (variantId: string) => void;
  onChangeQuantidade: (variantId: string, quantidade: number) => void;
};

export function CartList({ itens, onRemove, onChangeQuantidade }: CartListProps) {
  if (itens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <ShoppingBag className="size-7 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">Carrinho vazio</p>
        <p className="text-xs text-muted-foreground">Busque um produto para começar a venda.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {itens.map((item) => (
        <li key={item.variantId} className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{item.produtoNome}</div>
            <div className="text-xs text-muted-foreground">
              {item.tamanho} · {item.cor} · {formatCurrency(item.precoUnitario)}
            </div>

            <div className="mt-1.5 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-6"
                onClick={() => onChangeQuantidade(item.variantId, item.quantidade - 1)}
              >
                −
              </Button>
              <span className="w-5 text-center text-xs font-medium tabular-nums">
                {item.quantidade}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-6"
                onClick={() => onChangeQuantidade(item.variantId, item.quantidade + 1)}
                disabled={item.quantidade >= item.estoqueDisponivel}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="text-sm font-semibold">
              {formatCurrency(item.precoUnitario * item.quantidade)}
            </span>
            <button
              type="button"
              onClick={() => onRemove(item.variantId)}
              aria-label={`Remover ${item.produtoNome}`}
              className="text-muted-foreground transition-colors hover:text-destructive"
            >
              <X className="size-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
