import type { TaskFilters } from "@/types/task";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TaskFiltersBarProps = {
  filters: TaskFilters;
  onChange: <K extends keyof TaskFilters>(
    key: K,
    value: TaskFilters[K],
  ) => void;
  vendedores: { id: string; nome: string }[];
};

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-36 flex-1">
      <Label className="mb-1.5 text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function TaskFiltersBar({
  filters,
  onChange,
  vendedores,
}: TaskFiltersBarProps) {
  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-4">
      <FilterField label="Vendedor">
        <Select
          value={filters.vendedor}
          onValueChange={(value) => onChange("vendedor", value)}
        >
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {vendedores.map((vendedor) => (
              <SelectItem key={vendedor.id} value={vendedor.id}>
                {vendedor.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Prioridade">
        <Select
          value={filters.prioridade}
          onValueChange={(value) =>
            onChange("prioridade", value as TaskFilters["prioridade"])
          }
        >
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Status">
        <Select
          value={filters.status}
          onValueChange={(value) =>
            onChange("status", value as TaskFilters["status"])
          }
        >
          <SelectTrigger size="sm" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="concluida">Concluída</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </FilterField>
    </div>
  );
}
