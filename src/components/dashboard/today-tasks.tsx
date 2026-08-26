import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TaskPriority, TaskSummary } from "@/types/dashboard";

const PRIORITY_DOT: Record<TaskPriority, string> = {
  alta: "bg-destructive",
  media: "bg-chart-2",
  baixa: "bg-muted-foreground/40",
};

export function TodayTasks({ tasks }: { tasks: TaskSummary[] }) {
  if (tasks.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhuma tarefa para hoje.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-start gap-3 py-3 first:pt-0">
          <span
            aria-hidden
            className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", PRIORITY_DOT[task.prioridade])}
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{task.titulo}</div>
            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {task.clienteNome} · {task.responsavel}
            </div>
          </div>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {task.horario}
          </span>
        </li>
      ))}

      <li className="pt-3">
        <Link
          href="/tarefas"
          className="inline-flex items-center gap-1 text-xs font-medium text-foreground transition-opacity hover:opacity-70"
        >
          Ver todas as tarefas
          <ArrowUpRight className="size-3.5" />
        </Link>
      </li>
    </ul>
  );
}
