import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";
import type { TaskPriority, TaskSummary } from "@/types/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

export function TodayTasks({ tasks }: { tasks: TaskSummary[] }) {
  if (tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma tarefa para hoje.</p>;
  }

  return (
    <ul className="space-y-4">
      {tasks.map((tarefa) => (
        <li key={tarefa.id} className="flex items-start gap-3">
          <button
            type="button"
            aria-label={`Concluir ${tarefa.titulo}`}
            className={cn(
              "mt-0.5 size-5 shrink-0 rounded-full border-2 transition-colors hover:bg-secondary",
              PRIORIDADE_RING[tarefa.prioridade]
            )}
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="min-w-0 truncate text-sm font-medium">{tarefa.titulo}</span>
              <Badge variant={PRIORIDADE_BADGE[tarefa.prioridade]} className="shrink-0">
                {PRIORIDADE_LABEL[tarefa.prioridade]}
              </Badge>
            </div>
            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {tarefa.contexto}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs text-muted-foreground">{tarefa.horario}</span>
            <Avatar className="size-7">
              <AvatarFallback className="bg-secondary text-[10px] font-medium">
                {initials(tarefa.responsavel)}
              </AvatarFallback>
            </Avatar>
          </div>
        </li>
      ))}
    </ul>
  );
}
