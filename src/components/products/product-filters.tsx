import type { ProductFilters } from "@/types/product";
import { PRODUCT_CATEGORIES } from "@/mocks/products";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductFiltersBarProps = {
  filters: ProductFilters;
  onChange: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
};

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-36 flex-1">
      <Label className="mb-1.5 text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function ProductFiltersBar({ filters, onChange }: ProductFiltersBarProps) {
  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-4">
      <FilterField label="Categoria">
        <Select value={filters.categoria} onValueChange={(value) => onChange("categoria", value)}>
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {PRODUCT_CATEGORIES.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Status">
        <Select
          value={filters.status}
          onValueChange={(value) => onChange("status", value as ProductFilters["status"])}
        >
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="arquivado">Arquivado</SelectItem>
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Estoque">
        <Select
          value={filters.estoque}
          onValueChange={(value) => onChange("estoque", value as ProductFilters["estoque"])}
        >
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="baixo">Estoque baixo</SelectItem>
            <SelectItem value="esgotado">Esgotado</SelectItem>
          </SelectContent>
        </Select>
      </FilterField>
    </div>
  );
}
