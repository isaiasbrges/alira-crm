"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Plus, Search, UsersRound } from "lucide-react";

import { formatNumber } from "@/lib/format";
import type { CustomerFilters } from "@/types/customer";
import { CUSTOMER_FILTERS_DEFAULT } from "@/types/customer";
import { MOCK_CUSTOMERS } from "@/mocks/customers";
import {
  buildCustomerKpis,
  filterCustomers,
  paginate,
  totalPages,
} from "@/services/customer-metrics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { CustomerTable } from "@/components/customers/customer-table";
import {
  CustomerFiltersDrawer,
  CustomerFiltersPanel,
  countActiveFilters,
} from "@/components/customers/customer-filters";

const POR_PAGINA = 8;

export function CustomersView() {
  const [filters, setFilters] = React.useState<CustomerFilters>(CUSTOMER_FILTERS_DEFAULT);
  const [page, setPage] = React.useState(1);

  const kpis = React.useMemo(() => buildCustomerKpis(MOCK_CUSTOMERS), []);
  const filtered = React.useMemo(() => filterCustomers(MOCK_CUSTOMERS, filters), [filters]);

  const paginas = totalPages(filtered.length, POR_PAGINA);
  const paginaAtual = Math.min(page, paginas);
  const visiveis = paginate(filtered, paginaAtual, POR_PAGINA);
  const activeCount = countActiveFilters(filters);

  function updateFilter<K extends keyof CustomerFilters>(key: K, value: CustomerFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(CUSTOMER_FILTERS_DEFAULT);
    setPage(1);
  }

  return (
    <>
      <PageHeader
        titulo="Clientes"
        descricao="Base completa da loja, com preferências, histórico e segmentação."
      >
        <Button className="gap-2">
          <Plus className="size-4" />
          Novo cliente
        </Button>
      </PageHeader>

      <section
        aria-label="Indicadores de clientes"
        className="grid grid-cols-2 gap-3 lg:grid-cols-5"
      >
        <SummaryCard label="Total" value={kpis.total} />
        <SummaryCard label="Ativos" value={kpis.ativos} />
        <SummaryCard label="Inativos" value={kpis.inativos} />
        <SummaryCard label="VIP" value={kpis.vip} />
        <SummaryCard
          label="Com WhatsApp autorizado"
          value={kpis.comWhatsapp}
          className="col-span-2 lg:col-span-1"
        />
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.busca}
            onChange={(event) => updateFilter("busca", event.target.value)}
            placeholder="Buscar por nome, telefone ou cidade"
            aria-label="Buscar clientes"
            className="pl-9"
          />
        </div>

        <CustomerFiltersDrawer
          filters={filters}
          onChange={updateFilter}
          onReset={resetFilters}
          activeCount={activeCount}
        />
      </div>

      <div className="mt-3">
        <CustomerFiltersPanel
          filters={filters}
          onChange={updateFilter}
          onReset={resetFilters}
          activeCount={activeCount}
        />
      </div>

      <Card className="mt-4 gap-0 overflow-hidden py-0">
        {visiveis.length === 0 ? (
          <EmptyState onReset={resetFilters} hasFilters={activeCount > 0 || filters.busca !== ""} />
        ) : (
          <CustomerTable customers={visiveis} />
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <span className="text-xs text-muted-foreground">
            Mostrando {visiveis.length} de {formatNumber(filtered.length)} clientes
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
  className,
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <Card className={`gap-0 p-4 ${className ?? ""}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums">
        {formatNumber(value)}
      </span>
    </Card>
  );
}

function EmptyState({
  onReset,
  hasFilters,
}: {
  onReset: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-secondary">
        <UsersRound className="size-5 text-muted-foreground" />
      </span>
      <div>
        <p className="text-sm font-medium">Nenhum cliente encontrado</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasFilters
            ? "Ajuste os filtros para ampliar a busca."
            : "Cadastre o primeiro cliente para começar."}
        </p>
      </div>
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={onReset}>
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
