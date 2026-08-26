import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";

import { formatCurrency, initials } from "@/lib/format";
import type { ReactivationTarget } from "@/types/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function ReactivationList({ targets }: { targets: ReactivationTarget[] }) {
  if (targets.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhum cliente aguardando reativação.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {targets.map((target) => (
        <li key={target.id} className="flex items-center gap-3 py-3 first:pt-0">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback>{initials(target.nome)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{target.nome}</div>
            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {target.diasSemComprar} dias sem comprar · {formatCurrency(target.totalGasto)}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label={`Enviar WhatsApp para ${target.nome}`}
            className="shrink-0"
          >
            <MessageCircle />
          </Button>
        </li>
      ))}

      <li className="pt-3">
        <Link
          href="/clientes?filtro=reativar"
          className="inline-flex items-center gap-1 text-xs font-medium text-foreground transition-opacity hover:opacity-70"
        >
          Ver lista completa
          <ArrowUpRight className="size-3.5" />
        </Link>
      </li>
    </ul>
  );
}
