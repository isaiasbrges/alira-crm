import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import type { Sale } from "@/types/sale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SaleSuccess({ venda, onNovaVenda }: { venda: Sale; onNovaVenda: () => void }) {
  return (
    <Card className="mx-auto mt-10 max-w-md items-center gap-4 px-8 py-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-tint-green text-tint-green-fg">
        <CheckCircle2 className="size-7" />
      </span>

      <div>
        <p className="text-lg font-semibold">Venda #{venda.numero} concluída</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {venda.clienteNome ?? "Cliente balcão"} · {formatCurrency(venda.total)}
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Button variant="outline" className="flex-1" onClick={onNovaVenda}>
          Nova venda
        </Button>
        <Button asChild className="flex-1">
          <Link href="/vendas">Ver histórico</Link>
        </Button>
      </div>
    </Card>
  );
}
