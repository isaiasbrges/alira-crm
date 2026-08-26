"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function PeriodPicker() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 31),
  });

  const label =
    range?.from && range?.to
      ? `${formatDate(range.from)} — ${formatDate(range.to)}`
      : "Selecionar período";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 font-normal">
          <CalendarDays className="size-4 text-muted-foreground" />
          <span className="hidden text-xs lg:inline">{label}</span>
          <span className="text-xs lg:hidden">Período</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} />
      </PopoverContent>
    </Popover>
  );
}
