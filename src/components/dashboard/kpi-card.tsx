import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDelta } from "@/lib/format";
import type { Kpi } from "@/types/dashboard";
import { Card } from "@/components/ui/card";

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const TrendIcon = kpi.trend === "down" ? TrendingDown : TrendingUp;
  const positivo = kpi.trend === "up";

  return (
    <Card className="gap-0 p-4">
      <div className="text-xs font-medium text-muted-foreground">{kpi.label}</div>

      <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
        <span className="whitespace-nowrap text-2xl font-semibold tracking-tight">
          {kpi.value}
        </span>
        {kpi.delta !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              positivo ? "text-success" : "text-destructive"
            )}
          >
            <TrendIcon className="size-3" />
            {formatDelta(kpi.delta)}
          </span>
        )}
      </div>

      {kpi.hint && (
        <div className="mt-1.5 text-[11px] text-muted-foreground">{kpi.hint}</div>
      )}
    </Card>
  );
}
