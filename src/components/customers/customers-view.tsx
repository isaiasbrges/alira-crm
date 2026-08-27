"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Kanban,
  Search,
  Table2,
  UsersRound,
} from "lucide-react";

import { formatNumber } from "@/lib/format";
import type { Customer, CustomerFilters } from "@/types/customer";
import { CUSTOMER_FILTERS_DEFAULT } from "@/types/customer";
import {
  buildCustomerKpis,
  filterCustomers,
} from "@/services/customer-metrics";
import { paginate, totalPages } from "@/lib/pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { CustomerBoard } from "@/components/customers/customer-board";
import { CustomerTable } from "@/components/customers/customer-table";
import { CreateCustomerDialog } from "@/components/customers/create-customer-dialog";
import {
  CustomerFiltersDrawer,
  CustomerFiltersPanel,
  countActiveFilters,
  type CustomerFilterOptions,
} from "@/components/customers/customer-filters";

const POR_PAGINA = 8;

type CustomersViewProps = {
  clientes: Customer[];
  options: CustomerFilterOptions;
};

export function CustomersView({ clientes, options }: CustomersViewProps) {
  const [filters, setFilters] = React.useState<CustomerFilters>(
    CUSTOMER_FILTERS_DEFAULT,
  );
  const [page, setPage] = React.useState(1);
  const [visualizacao, setVisualizacao] = React.useState<"tabela" | "board">(
    "tabela",
  );

  const kpis = React.useMemo(() => buildCustomerKpis(clientes), [clientes]);
  const filtered = React.useMemo(
    () => filterCustomers(clientes, filters),
    [clientes, filters],
  );

  const paginas = totalPages(filtered.length, POR_PAGINA);
  const paginaAtual = Math.min(page, paginas);
  const visiveis = paginate(filtered, paginaAtual, POR_PAGINA);
  const activeCount = countActiveFilters(filters);

  function updateFilter<K extends keyof CustomerFilters>(
    key: K,
    value: CustomerFilters[K],
  ) {
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
        <CreateCustomerDialog vendedores={options.vendedores} />
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
          options={options}
        />

        <div className="flex items-center gap-0.5 rounded-lg border border-border p-0.5">
          <Button
            type="button"
            variant={visualizacao === "tabela" ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            aria-label="Ver como tabela"
            aria-pressed={visualizacao === "tabela"}
            onClick={() => setVisualizacao("tabela")}
          >
            <Table2 className="size-4" />
          </Button>
          <Button
            type="button"
            variant={visualizacao === "board" ? "secondary" : "ghost"}
            size="icon"
            className="size-8"
            aria-label="Ver como board"
            aria-pressed={visualizacao === "board"}
            onClick={() => setVisualizacao("board")}
          >
            <Kanban className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <CustomerFiltersPanel
          filters={filters}
          options={options}
          onChange={updateFilter}
          onReset={resetFilters}
          activeCount={activeCount}
        />
      </div>

      {visualizacao === "board" ? (
        filtered.length === 0 ? (
          <Card className="mt-4 gap-0 overflow-hidden py-0">
            <EmptyState
              onReset={resetFilters}
              hasFilters={activeCount > 0 || filters.busca !== ""}
            />
          </Card>
        ) : (
          <div className="mt-4">
            <CustomerBoard customers={filtered} />
          </div>
        )
      ) : (
        <Card className="mt-4 gap-0 overflow-hidden py-0">
          {visiveis.length === 0 ? (
            <EmptyState
              onReset={resetFilters}
              hasFilters={activeCount > 0 || filters.busca !== ""}
            />
          ) : (
            <CustomerTable customers={visiveis} />
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
            <span className="text-xs text-muted-foreground">
              Mostrando {visiveis.length} de {formatNumber(filtered.length)}{" "}
              clientes
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
      )}
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
