import { PAYMENT_METHOD_LABEL, type SaleFilters } from "@/types/sale";
import { MOCK_VENDEDORES } from "@/mocks/customers";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SaleFiltersBarProps = {
  filters: SaleFilters;
  onChange: <K extends keyof SaleFilters>(key: K, value: SaleFilters[K]) => void;
};

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-36 flex-1">
      <Label className="mb-1.5 text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function SaleFiltersBar({ filters, onChange }: SaleFiltersBarProps) {
  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-4">
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

      <FilterField label="Pagamento">
        <Select
          value={filters.formaPagamento}
          onValueChange={(value) => onChange("formaPagamento", value as SaleFilters["formaPagamento"])}
        >
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {Object.entries(PAYMENT_METHOD_LABEL).map(([valor, rotulo]) => (
              <SelectItem key={valor} value={valor}>
                {rotulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Status">
        <Select
          value={filters.status}
          onValueChange={(value) => onChange("status", value as SaleFilters["status"])}
        >
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="concluida">Concluída</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </FilterField>
    </div>
  );
}
