"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatNumber } from "@/lib/format";
import type { CategorySlice } from "@/types/dashboard";
import { ChartTooltipCard } from "@/components/dashboard/chart-tooltip-card";

export function CategoryChart({ data }: { data: CategorySlice[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 8, bottom: 0, left: 8 }}
      >
        <CartesianGrid horizontal={false} stroke="var(--color-border)" />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="categoria"
          tickLine={false}
          axisLine={false}
          width={88}
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
        />
        <Tooltip
          cursor={{ fill: "var(--color-secondary)" }}
          content={<ChartTooltipCard formatter={(value) => `${formatNumber(value)} clientes`} />}
        />
        <Bar
          dataKey="clientes"
          name="Clientes"
          fill="var(--color-chart-2)"
          radius={[0, 6, 6, 0]}
          barSize={18}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
