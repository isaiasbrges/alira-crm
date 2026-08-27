"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatCurrency } from "@/lib/format";
import type { MonthlyRevenuePoint } from "@/types/report";

type TooltipPayload = { payload?: MonthlyRevenuePoint };

function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  const ponto = payload?.[0]?.payload;
  if (!active || !ponto) return null;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <div className="text-xs font-medium">{ponto.mes}</div>
      <div className="mt-1.5 space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-chart-1" />
          <span className="text-muted-foreground">Total</span>
          <span className="ml-auto font-medium">{formatCurrency(ponto.receita)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-chart-2" />
          <span className="text-muted-foreground">Campanhas</span>
          <span className="ml-auto font-medium">{formatCurrency(ponto.receitaCampanhas)}</span>
        </div>
      </div>
    </div>
  );
}

export function MonthlyRevenueChart({ data }: { data: MonthlyRevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis
          dataKey="mes"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={56}
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          tickFormatter={(valor: number) => `${Math.round(valor / 1000)}k`}
        />
        <Tooltip cursor={{ fill: "var(--color-secondary)" }} content={<ChartTooltip />} />
        <Bar dataKey="receita" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} maxBarSize={36} />
        <Bar
          dataKey="receitaCampanhas"
          fill="var(--color-chart-2)"
          radius={[6, 6, 0, 0]}
          maxBarSize={36}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
