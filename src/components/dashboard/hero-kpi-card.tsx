import { ArrowDown, ArrowUp, CircleDollarSign, Info, UsersRound } from "lucide-react";

import { cn } from "@/lib/utils";
import type { HeroKpi } from "@/types/dashboard";
import { TINT_CLASSES } from "@/components/dashboard/tints";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ICONES = {
  "receita-relacionamento": CircleDollarSign,
  "taxa-recompra": UsersRound,
} as const;

export function HeroKpiCard({ kpi }: { kpi: HeroKpi }) {
  const Icone = ICONES[kpi.id as keyof typeof ICONES] ?? CircleDollarSign;
  const subiu = kpi.delta >= 0;
  const Seta = subiu ? ArrowUp : ArrowDown;

  return (
    <Card className="gap-0 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">{kpi.label}</span>
            {kpi.hint && (
              <Tooltip>
                <TooltipTrigger aria-label={`Sobre ${kpi.label}`}>
                  <Info className="size-3.5 text-muted-foreground/60" />
                </TooltipTrigger>
                <TooltipContent className="max-w-56">{kpi.hint}</TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[32px] font-semibold leading-none tracking-[-0.02em]">
              {kpi.value}
            </span>
            <span
              className={cn(
                "flex items-center gap-0.5 text-sm font-medium",
                subiu ? "text-success" : "text-destructive"
              )}
            >
              <Seta className="size-3.5" />
              {Math.abs(kpi.delta).toLocaleString("pt-BR", { minimumFractionDigits: 1 })}%
            </span>
            <span className="text-xs text-muted-foreground">{kpi.comparacao}</span>
          </div>
        </div>

        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full",
            TINT_CLASSES[kpi.tint]
          )}
        >
          <Icone className="size-5" />
        </span>
      </div>
    </Card>
  );
}
