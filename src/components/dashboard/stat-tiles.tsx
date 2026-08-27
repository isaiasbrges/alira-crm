import { ArrowDown, ArrowUp, Crown, RefreshCw, ShoppingBag, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import type { StatTile } from "@/types/dashboard";
import { TINT_CLASSES } from "@/components/dashboard/tints";
import { Card } from "@/components/ui/card";

const ICONES = {
  "clientes-ativos": Users,
  "clientes-vip": Crown,
  "ticket-medio": ShoppingBag,
  "clientes-reativados": RefreshCw,
} as const;

export function StatTiles({ tiles }: { tiles: StatTile[] }) {
  return (
    <Card className="grid gap-0 p-0 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile, indice) => {
        const Icone = ICONES[tile.id as keyof typeof ICONES] ?? Users;
        const subiu = tile.delta >= 0;
        const Seta = subiu ? ArrowUp : ArrowDown;

        return (
          <div
            key={tile.id}
            className={cn(
              "flex min-w-0 items-center gap-3.5 p-5",
              // Divisórias só entre colunas, acompanhando o grid de cada faixa.
              indice > 0 && "sm:border-l sm:border-border",
              indice === 2 && "xl:border-l",
              indice % 2 === 0 && indice > 0 && "sm:border-l-0 xl:border-l"
            )}
          >
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                TINT_CLASSES[tile.tint]
              )}
            >
              <Icone className="size-5" />
            </span>

            <div className="min-w-0">
              <div className="text-xl font-semibold tracking-[-0.01em]">{tile.value}</div>
              <div className="truncate text-sm text-muted-foreground">{tile.label}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    subiu ? "text-success" : "text-destructive"
                  )}
                >
                  <Seta className="size-3" />
                  {Math.abs(tile.delta).toLocaleString("pt-BR", {
                    minimumFractionDigits: 1,
                  })}
                  %
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {tile.comparacao}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
