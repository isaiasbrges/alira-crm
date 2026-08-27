"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Plus, Receipt, Search } from "lucide-react";
import Link from "next/link";

import { formatCurrency, formatNumber } from "@/lib/format";
import { paginate, totalPages } from "@/lib/pagination";
import type { Sale, SaleFilters } from "@/types/sale";
import { SALE_FILTERS_DEFAULT } from "@/types/sale";
import { buildSaleKpis, filterSales } from "@/services/sale-metrics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { SaleFiltersBar } from "@/components/sales/sale-filters";
import { SalesTable } from "@/components/sales/sales-table";

const POR_PAGINA = 8;

type SalesViewProps = {
  vendas: Sale[];
  vendedores: { id: string; nome: string }[];
};

export function SalesView({ vendas, vendedores }: SalesViewProps) {
  const [filters, setFilters] =
    React.useState<SaleFilters>(SALE_FILTERS_DEFAULT);
  const [page, setPage] = React.useState(1);

  const kpis = React.useMemo(() => buildSaleKpis(vendas), [vendas]);
  const filtered = React.useMemo(
    () => filterSales(vendas, filters),
    [vendas, filters],
  );

  const paginas = totalPages(filtered.length, POR_PAGINA);
  const paginaAtual = Math.min(page, paginas);
  const visiveis = paginate(filtered, paginaAtual, POR_PAGINA);

  function updateFilter<K extends keyof SaleFilters>(
    key: K,
    value: SaleFilters[K],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  return (
    <>
      <PageHeader
        titulo="Vendas"
        descricao="Histórico de vendas da loja e novo lançamento no PDV."
      >
        <Button asChild className="gap-2">
          <Link href="/vendas/pdv">
            <Plus className="size-4" />
            Nova venda
          </Link>
        </Button>
      </PageHeader>

      <section
        aria-label="Indicadores de vendas"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <SummaryCard
          label="Vendas no período"
          value={formatNumber(kpis.total)}
        />
        <SummaryCard label="Receita" value={formatCurrency(kpis.receita)} />
        <SummaryCard
          label="Ticket médio"
          value={formatCurrency(kpis.ticketMedio)}
        />
        <SummaryCard
          label="Canceladas"
          value={formatNumber(kpis.canceladas)}
          tone="destructive"
        />
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.busca}
            onChange={(event) => updateFilter("busca", event.target.value)}
            placeholder="Buscar por pedido, cliente ou vendedor"
            aria-label="Buscar vendas"
            className="pl-9"
          />
        </div>
      </div>

      <div className="mt-3">
        <SaleFiltersBar
          filters={filters}
          onChange={updateFilter}
          vendedores={vendedores}
        />
      </div>

      <Card className="mt-4 gap-0 overflow-hidden py-0">
        {visiveis.length === 0 ? (
          <EmptyState />
        ) : (
          <SalesTable sales={visiveis} />
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <span className="text-xs text-muted-foreground">
            Mostrando {visiveis.length} de {formatNumber(filtered.length)}{" "}
            vendas
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={paginaAtual <= 1}
              className="gap-1"
            >
              <ChevronLeft className="size-4" />
              Anterior
            </Button>
            <span className="text-xs tabular-nums text-muted-foreground">
              {paginaAtual} / {paginas}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((value) => Math.min(paginas, value + 1))}
              disabled={paginaAtual >= paginas}
              className="gap-1"
            >
              Próxima
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "destructive";
}) {
  return (
    <Card className="gap-0 p-4">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span
        className={
          "mt-1.5 block text-2xl font-semibold tracking-tight tabular-nums " +
          (tone === "destructive" ? "text-destructive" : "text-foreground")
        }
      >
        {value}
      </span>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-secondary">
        <Receipt className="size-5 text-muted-foreground" />
      </span>
      <div>
        <p className="text-sm font-medium">Nenhuma venda encontrada</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajuste os filtros para ampliar a busca.
        </p>
      </div>
    </div>
  );
}
