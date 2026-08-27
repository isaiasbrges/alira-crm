"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, PackageSearch, Search } from "lucide-react";

import { formatNumber } from "@/lib/format";
import { paginate, totalPages } from "@/lib/pagination";
import type { Product, ProductFilters } from "@/types/product";
import { PRODUCT_FILTERS_DEFAULT } from "@/types/product";
import { MOCK_PRODUCTS } from "@/mocks/products";
import { buildProductKpis, filterProducts } from "@/services/product-metrics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { NewProductDialog } from "@/components/products/new-product-dialog";
import { ProductFiltersBar } from "@/components/products/product-filters";
import { ProductTable } from "@/components/products/product-table";

const POR_PAGINA = 8;

export function ProductsView() {
  const [products, setProducts] = React.useState<Product[]>(MOCK_PRODUCTS);
  const [filters, setFilters] = React.useState<ProductFilters>(PRODUCT_FILTERS_DEFAULT);
  const [page, setPage] = React.useState(1);

  const kpis = React.useMemo(() => buildProductKpis(products), [products]);
  const filtered = React.useMemo(() => filterProducts(products, filters), [products, filters]);

  const paginas = totalPages(filtered.length, POR_PAGINA);
  const paginaAtual = Math.min(page, paginas);
  const visiveis = paginate(filtered, paginaAtual, POR_PAGINA);

  function updateFilter<K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  return (
    <>
      <PageHeader
        titulo="Produtos"
        descricao="Catálogo, categorias e estoque por tamanho e cor."
      >
        <NewProductDialog onCreate={(produto) => setProducts((atual) => [produto, ...atual])} />
      </PageHeader>

      <section aria-label="Indicadores de produtos" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Total de produtos" value={kpis.total} />
        <SummaryCard label="Ativos" value={kpis.ativos} />
        <SummaryCard label="Estoque baixo" value={kpis.estoqueBaixo} tone="warning" />
        <SummaryCard label="Esgotados" value={kpis.esgotados} tone="destructive" />
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.busca}
            onChange={(event) => updateFilter("busca", event.target.value)}
            placeholder="Buscar por nome ou SKU"
            aria-label="Buscar produtos"
            className="pl-9"
          />
        </div>
      </div>

      <div className="mt-3">
        <ProductFiltersBar filters={filters} onChange={updateFilter} />
      </div>

      <Card className="mt-4 gap-0 overflow-hidden py-0">
        {visiveis.length === 0 ? (
          <EmptyState />
        ) : (
          <ProductTable products={visiveis} />
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <span className="text-xs text-muted-foreground">
            Mostrando {visiveis.length} de {formatNumber(filtered.length)} produtos
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
  value: number;
  tone?: "warning" | "destructive";
}) {
  return (
    <Card className="gap-0 p-4">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span
        className={
          "mt-1.5 block text-2xl font-semibold tracking-tight tabular-nums " +
          (tone === "warning"
            ? "text-warning"
            : tone === "destructive"
              ? "text-destructive"
              : "text-foreground")
        }
      >
        {formatNumber(value)}
      </span>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-secondary">
        <PackageSearch className="size-5 text-muted-foreground" />
      </span>
      <div>
        <p className="text-sm font-medium">Nenhum produto encontrado</p>
        <p className="mt-1 text-sm text-muted-foreground">Ajuste os filtros para ampliar a busca.</p>
      </div>
    </div>
  );
}
