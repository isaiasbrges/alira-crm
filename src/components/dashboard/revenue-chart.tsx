"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/format";
import type { RevenuePoint } from "@/types/dashboard";
import { ChartTooltipCard } from "@/components/dashboard/chart-tooltip-card";

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
        <defs>
          <linearGradient id="fillReceita" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillCampanhas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis
          dataKey="periodo"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={64}
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
        />
        <Tooltip
          cursor={{ stroke: "var(--color-border)" }}
          content={<ChartTooltipCard formatter={(value) => formatCurrency(value)} />}
        />

        <Area
          type="monotone"
          dataKey="receita"
          name="Receita total"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          fill="url(#fillReceita)"
        />
        <Area
          type="monotone"
          dataKey="receitaCampanhas"
          name="Receita de campanhas"
          stroke="var(--color-chart-2)"
          strokeWidth={2}
          fill="url(#fillCampanhas)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
