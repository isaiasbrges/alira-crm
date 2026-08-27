"use client";

import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types/product";
import { estoqueTotal } from "@/types/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductStatusBadge } from "@/components/products/product-status-badge";
import { StockBadge } from "@/components/products/stock-badge";

export function ProductTable({ products }: { products: Product[] }) {
  const [expandido, setExpandido] = React.useState<string | null>(null);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8" />
          <TableHead>Produto</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Coleção</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Estoque</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((produto) => {
          const aberto = expandido === produto.id;
          const total = estoqueTotal(produto);

          return (
            <React.Fragment key={produto.id}>
              <TableRow
                className="cursor-pointer"
                onClick={() => setExpandido(aberto ? null : produto.id)}
              >
                <TableCell>
                  {aberto ? (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-4 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{produto.nome}</div>
                  <div className="text-xs text-muted-foreground">{produto.sku}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">{produto.categoria}</TableCell>
                <TableCell className="text-muted-foreground">
                  {produto.colecao ?? "—"}
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(produto.preco)}</TableCell>
                <TableCell>
                  <StockBadge total={total} />
                </TableCell>
                <TableCell>
                  <ProductStatusBadge status={produto.status} />
                </TableCell>
              </TableRow>

              {aberto && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="bg-secondary/40 whitespace-normal p-0">
                    <div className="flex flex-wrap gap-2 p-4">
                      {produto.variantes.map((variante) => (
                        <div
                          key={variante.id}
                          className={cn(
                            "flex min-w-32 items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2",
                            variante.estoque === 0 && "opacity-60"
                          )}
                        >
                          <div>
                            <div className="text-xs font-medium">
                              {variante.tamanho} / {variante.cor}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {variante.sku}
                            </div>
                          </div>
                          <StockBadge total={variante.estoque} />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
