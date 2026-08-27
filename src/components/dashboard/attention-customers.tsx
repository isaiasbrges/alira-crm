import { ArrowRight, MoreVertical } from "lucide-react";
import Link from "next/link";

import { formatCurrency, initials } from "@/lib/format";
import type { AttentionCustomer } from "@/types/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function AttentionCustomers({ customers }: { customers: AttentionCustomer[] }) {
  if (customers.length === 0) {
    return (
      <p className="px-6 pb-6 text-sm text-muted-foreground">
        Nenhum cliente precisando de atenção no período.
      </p>
    );
  }

  return (
    <>
      <ul className="divide-y divide-border">
        {customers.map((cliente) => (
          <li key={cliente.id} className="flex items-center gap-3 px-6 py-3.5">
            <Avatar className="size-10 shrink-0">
              <AvatarFallback className="bg-secondary text-xs font-medium">
                {initials(cliente.nome)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">{cliente.nome}</span>
                {cliente.vip && (
                  <Badge variant="amber" className="shrink-0">
                    VIP
                  </Badge>
                )}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {cliente.diasSemComprar} dias sem comprar
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {formatCurrency(cliente.acumulado, true)} acumulado
              </div>
            </div>

            <button
              type="button"
              className="h-8 shrink-0 rounded-lg border border-primary/30 px-3 text-xs font-medium text-primary transition-colors hover:bg-accent"
            >
              Reativar
            </button>

            <button
              type="button"
              aria-label={`Mais ações para ${cliente.nome}`}
              className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary"
            >
              <MoreVertical className="size-4" />
            </button>
          </li>
        ))}
      </ul>

      <div className="border-t border-border px-6 py-3.5">
        <Link
          href="/clientes"
          className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Ver todos os clientes para reativar
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </>
  );
}
