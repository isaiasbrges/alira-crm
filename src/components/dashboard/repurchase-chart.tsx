"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatPercent } from "@/lib/format";
import type { RepurchasePoint } from "@/types/dashboard";
import { ChartTooltipCard } from "@/components/dashboard/chart-tooltip-card";

export function RepurchaseChart({ data }: { data: RepurchasePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
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
          width={48}
          domain={[20, 45]}
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          tickFormatter={(value: number) => `${value}%`}
        />
        <Tooltip
          cursor={{ stroke: "var(--color-border)" }}
          content={<ChartTooltipCard formatter={(value) => formatPercent(value)} />}
        />
        <Line
          type="monotone"
          dataKey="taxa"
          name="Taxa de recompra"
          stroke="var(--color-chart-3)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-chart-3)" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
