import { cn } from "@/lib/utils";
import { ESTOQUE_BAIXO_LIMITE } from "@/types/product";

export function StockBadge({ total }: { total: number }) {
  if (total === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive">
        <span className="size-1.5 rounded-full bg-destructive" />0 un.
      </span>
    );
  }

  const baixo = total <= ESTOQUE_BAIXO_LIMITE;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium",
        baixo ? "text-warning" : "text-foreground"
      )}
    >
      <span className={cn("size-1.5 rounded-full", baixo ? "bg-warning" : "bg-success")} />
      {total} un.
    </span>
  );
}
