"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency, formatPercent } from "@/lib/format";
import type { PerformancePoint } from "@/types/dashboard";

/** Marca só os dias de referência no eixo, para o rótulo não empilhar. */
const DIAS_MARCADOS = new Set(["01", "05", "10", "15", "20", "25", "31"]);

type TooltipPayload = {
  payload?: PerformancePoint;
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  const ponto = payload?.[0]?.payload;
  if (!active || !ponto) return null;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <div className="text-xs font-medium text-foreground">Dia {ponto.dia}</div>
      <div className="mt-1.5 space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="size-2 rounded-full bg-chart-1" />
          <span className="text-muted-foreground">Receita</span>
          <span className="ml-auto font-medium">{formatCurrency(ponto.receita)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="size-2 rounded-full bg-chart-2" />
          <span className="text-muted-foreground">Recompra</span>
          <span className="ml-auto font-medium">{formatPercent(ponto.recompra, 0)}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Receita (R$) e taxa de recompra (%) na mesma janela de tempo.
 *
 * São grandezas diferentes, então cada uma tem seu eixo: receita à esquerda,
 * recompra à direita. A recompra é tracejada para que a leitura não dependa
 * apenas da cor.
 */
export function PerformanceChart({ data }: { data: PerformancePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <defs>
          <linearGradient id="fillReceita" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.16} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke="var(--color-border)" />

        <XAxis
          dataKey="dia"
          tickLine={false}
          axisLine={false}
          interval={0}
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          tickFormatter={(dia: string) => (DIAS_MARCADOS.has(dia) ? `${dia} Ago` : "")}
        />

        <YAxis
          yAxisId="receita"
          tickLine={false}
          axisLine={false}
          width={64}
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          tickFormatter={(valor: number) => `R$ ${Math.round(valor / 1000)}k`}
        />

        <YAxis
          yAxisId="recompra"
          orientation="right"
          tickLine={false}
          axisLine={false}
          width={44}
          domain={[0, 60]}
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          tickFormatter={(valor: number) => `${valor}%`}
        />

        <Tooltip cursor={{ stroke: "var(--color-border)" }} content={<ChartTooltip />} />

        <Area
          yAxisId="receita"
          type="monotone"
          dataKey="receita"
          name="Receita (R$)"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          fill="url(#fillReceita)"
        />

        <Line
          yAxisId="recompra"
          type="monotone"
          dataKey="recompra"
          name="Taxa de recompra (%)"
          stroke="var(--color-chart-2)"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
