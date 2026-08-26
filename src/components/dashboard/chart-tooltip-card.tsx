type TooltipPayloadItem = {
  name?: string;
  value?: number;
  color?: string;
};

type ChartTooltipCardProps = {
  active?: boolean;
  label?: string;
  payload?: TooltipPayloadItem[];
  formatter: (value: number) => string;
};

export function ChartTooltipCard({
  active,
  label,
  payload,
  formatter,
}: ChartTooltipCardProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <div className="mb-1 text-xs font-medium text-muted-foreground">{label}</div>
      <div className="space-y-0.5">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="ml-auto font-medium tabular-nums">
              {formatter(item.value ?? 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
