"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import type { Task, TaskPriority } from "@/types/task";
import { Badge } from "@/components/ui/badge";

const PRIORIDADE_RING: Record<TaskPriority, string> = {
  alta: "border-destructive",
  media: "border-warning",
  baixa: "border-muted-foreground/40",
};

const PRIORIDADE_BADGE: Record<TaskPriority, "destructive" | "amber" | "secondary"> = {
  alta: "destructive",
  media: "amber",
  baixa: "secondary",
};

const PRIORIDADE_LABEL: Record<TaskPriority, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

function horario(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function TaskList({
  tasks,
  onToggle,
}: {
  tasks: Task[];
  onToggle: (id: string) => void;
}) {
  return (
    <ul className="divide-y divide-border">
      {tasks.map((tarefa) => {
        const concluida = tarefa.status === "concluida";
        const cancelada = tarefa.status === "cancelada";

        return (
          <li key={tarefa.id} className="flex items-start gap-3 px-6 py-4">
            <button
              type="button"
              disabled={cancelada}
              onClick={() => onToggle(tarefa.id)}
              aria-label={concluida ? `Reabrir ${tarefa.titulo}` : `Concluir ${tarefa.titulo}`}
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                cancelada
                  ? "cursor-not-allowed border-border"
                  : concluida
                    ? "border-success bg-success"
                    : cn("hover:bg-secondary", PRIORIDADE_RING[tarefa.prioridade])
              )}
            >
              {concluida && <Check className="size-3 text-success-foreground" strokeWidth={3} />}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-medium",
                    (concluida || cancelada) && "text-muted-foreground line-through"
                  )}
                >
                  {tarefa.titulo}
                </span>
                {!concluida && !cancelada && (
                  <Badge variant={PRIORIDADE_BADGE[tarefa.prioridade]}>
                    {PRIORIDADE_LABEL[tarefa.prioridade]}
                  </Badge>
                )}
                {cancelada && (
                  <Badge variant="outline" className="text-muted-foreground">
                    Cancelada
                  </Badge>
                )}
              </div>
              <div className="mt-0.5 truncate text-xs text-muted-foreground">
                {tarefa.clienteNome ? `${tarefa.clienteNome} · ` : ""}
                {tarefa.vendedorNome}
              </div>
            </div>

            <div className="shrink-0 text-right text-xs text-muted-foreground">
              <div>{horario(tarefa.venceEm)}</div>
              <div>{formatDate(tarefa.venceEm)}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
