import { formatNumber } from "@/lib/format";
import type { CategorySlice } from "@/types/report";

export function CategoryBreakdownChart({ data }: { data: CategorySlice[] }) {
  const maximo = Math.max(...data.map((item) => item.clientes), 1);

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.categoria} className="flex items-center gap-3">
          <span className="w-24 shrink-0 truncate text-sm text-muted-foreground">
            {item.categoria}
          </span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-chart-2"
              style={{ width: `${(item.clientes / maximo) * 100}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-sm font-medium tabular-nums">
            {formatNumber(item.clientes)}
          </span>
        </div>
      ))}
    </div>
  );
}
