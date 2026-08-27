"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Mail, MessageCircle } from "lucide-react";

import { atualizarStatusClienteAction } from "@/app/(crm)/clientes/actions";
import { cn } from "@/lib/utils";
import { formatCurrency, initials } from "@/lib/format";
import type { Customer, CustomerStatus } from "@/types/customer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const COLUNAS: { status: CustomerStatus; label: string }[] = [
  { status: "ativo", label: "Ativos" },
  { status: "vip", label: "VIP" },
  { status: "inativo", label: "Inativos" },
];

export function CustomerBoard({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  const [arrastandoId, setArrastandoId] = React.useState<string | null>(null);
  const [colunaSobre, setColunaSobre] = React.useState<CustomerStatus | null>(
    null,
  );
  const [, startTransition] = React.useTransition();

  function soltarEm(status: CustomerStatus) {
    setColunaSobre(null);
    const clienteId = arrastandoId;
    setArrastandoId(null);
    if (!clienteId) return;

    const cliente = customers.find((item) => item.id === clienteId);
    if (!cliente || cliente.status === status) return;

    startTransition(async () => {
      await atualizarStatusClienteAction(clienteId, status);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {COLUNAS.map((coluna) => {
        const clientesDaColuna = customers.filter(
          (cliente) => cliente.status === coluna.status,
        );

        return (
          <div
            key={coluna.status}
            data-coluna-status={coluna.status}
            onDragOver={(event) => {
              event.preventDefault();
              setColunaSobre(coluna.status);
            }}
            onDragLeave={() =>
              setColunaSobre((atual) => (atual === coluna.status ? null : atual))
            }
            onDrop={(event) => {
              event.preventDefault();
              soltarEm(coluna.status);
            }}
            className={cn(
              "flex min-h-[220px] flex-col gap-2.5 rounded-2xl border border-border bg-secondary/40 p-3 transition-colors",
              colunaSobre === coluna.status && "border-primary bg-accent",
            )}
          >
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-semibold">{coluna.label}</span>
              <Badge variant="outline">{clientesDaColuna.length}</Badge>
            </div>

            <div className="flex flex-col gap-2">
              {clientesDaColuna.map((cliente) => (
                <CustomerCard
                  key={cliente.id}
                  cliente={cliente}
                  arrastando={arrastandoId === cliente.id}
                  onDragStart={() => setArrastandoId(cliente.id)}
                  onDragEnd={() => setArrastandoId(null)}
                />
              ))}

              {clientesDaColuna.length === 0 && (
                <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                  Arraste um cliente pra cá
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CustomerCard({
  cliente,
  arrastando,
  onDragStart,
  onDragEnd,
}: {
  cliente: Customer;
  arrastando: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      data-cliente-id={cliente.id}
      className={cn(
        "cursor-grab rounded-xl border border-border bg-card p-3 shadow-sm transition-opacity active:cursor-grabbing",
        arrastando && "opacity-40",
      )}
    >
      <div className="flex items-start gap-2.5">
        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="text-xs">
            {initials(cliente.nome)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{cliente.nome}</p>
          <p className="truncate text-xs text-muted-foreground">
            {cliente.cidade || "—"}
          </p>
        </div>
      </div>

      <div className="mt-2.5 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MessageCircle className="size-3.5 shrink-0" />
          <span className="truncate tabular-nums">{cliente.whatsapp}</span>
        </div>
        {cliente.email && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="size-3.5 shrink-0" />
            <span className="truncate">{cliente.email}</span>
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2">
        <span className="text-xs font-medium tabular-nums">
          {formatCurrency(cliente.totalGasto)}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {cliente.vendedorNome}
        </span>
      </div>
    </div>
  );
}
