"use client";

import * as React from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const MESES_CURTOS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

/** "01 – 31 Ago 2026" quando o intervalo cabe num mês; senão mostra os dois. */
function rotularIntervalo(range: DateRange | undefined): string {
  if (!range?.from) return "Selecionar período";

  const inicio = range.from;
  const fim = range.to ?? range.from;

  const dia = (data: Date) => String(data.getDate()).padStart(2, "0");
  const mes = (data: Date) => MESES_CURTOS[data.getMonth()];

  if (inicio.getMonth() === fim.getMonth() && inicio.getFullYear() === fim.getFullYear()) {
    return `${dia(inicio)} – ${dia(fim)} ${mes(fim)} ${fim.getFullYear()}`;
  }

  return `${dia(inicio)} ${mes(inicio)} – ${dia(fim)} ${mes(fim)} ${fim.getFullYear()}`;
}

export function PeriodPicker() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 7, 1),
    to: new Date(2026, 7, 31),
  });

  return (
    <div className="flex items-center gap-2.5">
      <span className="hidden text-sm text-muted-foreground lg:inline">Período</span>

      <Popover>
        <PopoverTrigger className="flex h-10 items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 text-sm shadow-sm transition-colors hover:border-input focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30">
          <CalendarDays className="size-4 text-muted-foreground" />
          <span className="whitespace-nowrap">{rotularIntervalo(range)}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
