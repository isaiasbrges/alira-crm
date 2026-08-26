"use client";

import { SlidersHorizontal, X } from "lucide-react";

import type { CustomerFilters } from "@/types/customer";
import { CUSTOMER_FILTERS_DEFAULT } from "@/types/customer";
import {
  MOCK_CATEGORIAS,
  MOCK_CIDADES,
  MOCK_TAGS,
  MOCK_TAMANHOS,
  MOCK_VENDEDORES,
} from "@/mocks/customers";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type CustomerFiltersProps = {
  filters: CustomerFilters;
  onChange: <K extends keyof CustomerFilters>(key: K, value: CustomerFilters[K]) => void;
  onReset: () => void;
  activeCount: number;
};

const ULTIMA_COMPRA_OPCOES = [
  { value: "qualquer", label: "Qualquer data" },
  { value: "30-dias", label: "Últimos 30 dias" },
  { value: "90-dias", label: "Últimos 90 dias" },
  { value: "180-dias", label: "Últimos 180 dias" },
  { value: "sem-compra", label: "Há mais de 180 dias" },
];

/** Compartilhado entre a barra desktop e o drawer mobile. */
function FilterFields({ filters, onChange }: Omit<CustomerFiltersProps, "onReset" | "activeCount">) {
  return (
    <>
      <FilterField label="Status">
        <Select
          value={filters.status}
          onValueChange={(value) => onChange("status", value as CustomerFilters["status"])}
        >
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Categoria">
        <Select value={filters.categoria} onValueChange={(value) => onChange("categoria", value)}>
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {MOCK_CATEGORIAS.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Tamanho">
        <Select value={filters.tamanho} onValueChange={(value) => onChange("tamanho", value)}>
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {MOCK_TAMANHOS.map((tamanho) => (
              <SelectItem key={tamanho} value={tamanho}>
                {tamanho}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Vendedor">
        <Select value={filters.vendedor} onValueChange={(value) => onChange("vendedor", value)}>
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {MOCK_VENDEDORES.map((vendedor) => (
              <SelectItem key={vendedor.id} value={vendedor.id}>
                {vendedor.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Última compra">
        <Select
          value={filters.ultimaCompra}
          onValueChange={(value) => onChange("ultimaCompra", value)}
        >
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ULTIMA_COMPRA_OPCOES.map((opcao) => (
              <SelectItem key={opcao.value} value={opcao.value}>
                {opcao.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Cidade">
        <Select value={filters.cidade} onValueChange={(value) => onChange("cidade", value)}>
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {MOCK_CIDADES.map((cidade) => (
              <SelectItem key={cidade} value={cidade}>
                {cidade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Tag">
        <Select value={filters.tag} onValueChange={(value) => onChange("tag", value)}>
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {MOCK_TAGS.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>
    </>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 space-y-1.5">
      <Label className="text-[11px] font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

/** Painel sempre visível no desktop. */
export function CustomerFiltersPanel({
  filters,
  onChange,
  onReset,
  activeCount,
}: CustomerFiltersProps) {
  return (
    <div className="hidden rounded-xl border border-border bg-card p-4 lg:block">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 2xl:grid-cols-7">
        <FilterFields filters={filters} onChange={onChange} />
      </div>

      {activeCount > 0 && (
        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            {activeCount} filtro{activeCount > 1 ? "s" : ""} aplicado
            {activeCount > 1 ? "s" : ""}
          </span>
          <Button variant="ghost" size="sm" onClick={onReset} className="h-7 gap-1 text-xs">
            <X className="size-3" />
            Limpar
          </Button>
        </div>
      )}
    </div>
  );
}

/** No mobile os mesmos campos viram drawer para não espremer a tela. */
export function CustomerFiltersDrawer({
  filters,
  onChange,
  onReset,
  activeCount,
}: CustomerFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2 lg:hidden">
          <SlidersHorizontal className="size-4" />
          Filtros
          {activeCount > 0 && (
            <span className="rounded bg-accent px-1.5 text-[10px] font-semibold text-accent-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-4">
          <FilterFields filters={filters} onChange={onChange} />
          {activeCount > 0 && (
            <Button variant="outline" onClick={onReset} className="w-full gap-2">
              <X className="size-4" />
              Limpar filtros
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function countActiveFilters(filters: CustomerFilters): number {
  return (Object.keys(CUSTOMER_FILTERS_DEFAULT) as (keyof CustomerFilters)[]).filter(
    (key) => key !== "busca" && filters[key] !== CUSTOMER_FILTERS_DEFAULT[key]
  ).length;
}
