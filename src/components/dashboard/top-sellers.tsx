import { cn } from "@/lib/utils";
import { formatCurrency, initials } from "@/lib/format";
import type { SellerRank } from "@/types/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/** Ouro, prata e bronze; do quarto em diante, neutro. */
const MEDALHA: Record<number, string> = {
  1: "bg-tint-amber text-tint-amber-fg",
  2: "bg-secondary text-secondary-foreground",
  3: "bg-tint-amber/60 text-tint-amber-fg",
};

export function TopSellers({ sellers }: { sellers: SellerRank[] }) {
  if (sellers.length === 0) {
    return <p className="text-sm text-muted-foreground">Sem vendas no período.</p>;
  }

  return (
    <ul className="space-y-4">
      {sellers.map((vendedor) => (
        <li key={vendedor.posicao} className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              MEDALHA[vendedor.posicao] ?? "bg-secondary text-muted-foreground"
            )}
          >
            {vendedor.posicao}
          </span>

          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-secondary text-[10px] font-medium">
              {initials(vendedor.nome)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-medium">{vendedor.nome}</span>
              <span className="shrink-0 text-sm font-semibold">
                {formatCurrency(vendedor.valor, true)}
              </span>
            </div>

            <div
              className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary"
              role="presentation"
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${vendedor.percentual}%` }}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
