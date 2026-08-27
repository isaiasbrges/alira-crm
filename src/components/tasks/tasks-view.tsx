"use client";

import * as React from "react";
import { ClipboardCheck, Search } from "lucide-react";

import { formatNumber } from "@/lib/format";
import type { Task, TaskFilters } from "@/types/task";
import { TASK_FILTERS_DEFAULT } from "@/types/task";
import { MOCK_TASKS } from "@/mocks/tasks";
import { buildTaskKpis, filterTasks, ordenarTarefas } from "@/services/task-metrics";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { NewTaskDialog } from "@/components/tasks/new-task-dialog";
import { TaskFiltersBar } from "@/components/tasks/task-filters";
import { TaskList } from "@/components/tasks/task-list";

export function TasksView() {
  const [tasks, setTasks] = React.useState<Task[]>(MOCK_TASKS);
  const [filters, setFilters] = React.useState<TaskFilters>(TASK_FILTERS_DEFAULT);

  const kpis = React.useMemo(() => buildTaskKpis(tasks), [tasks]);
  const visiveis = React.useMemo(
    () => ordenarTarefas(filterTasks(tasks, filters)),
    [tasks, filters]
  );

  function updateFilter<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function alternarConclusao(id: string) {
    setTasks((atual) =>
      atual.map((tarefa) =>
        tarefa.id === id
          ? { ...tarefa, status: tarefa.status === "concluida" ? "pendente" : "concluida" }
          : tarefa
      )
    );
  }

  return (
    <>
      <PageHeader titulo="Tarefas" descricao="Agenda da equipe de vendas.">
        <NewTaskDialog onCreate={(tarefa) => setTasks((atual) => [tarefa, ...atual])} />
      </PageHeader>

      <section aria-label="Indicadores de tarefas" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Total" value={kpis.total} />
        <SummaryCard label="Pendentes" value={kpis.pendentes} />
        <SummaryCard label="Atrasadas" value={kpis.atrasadas} tone="destructive" />
        <SummaryCard label="Concluídas" value={kpis.concluidas} tone="success" />
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.busca}
            onChange={(event) => updateFilter("busca", event.target.value)}
            placeholder="Buscar por título, cliente ou vendedor"
            aria-label="Buscar tarefas"
            className="pl-9"
          />
        </div>
      </div>

      <div className="mt-3">
        <TaskFiltersBar filters={filters} onChange={updateFilter} />
      </div>

      <Card className="mt-4 gap-0 overflow-hidden py-0">
        {visiveis.length === 0 ? (
          <EmptyState />
        ) : (
          <TaskList tasks={visiveis} onToggle={alternarConclusao} />
        )}
      </Card>
    </>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "destructive" | "success";
}) {
  return (
    <Card className="gap-0 p-4">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span
        className={
          "mt-1.5 block text-2xl font-semibold tracking-tight tabular-nums " +
          (tone === "destructive"
            ? "text-destructive"
            : tone === "success"
              ? "text-success"
              : "text-foreground")
        }
      >
        {formatNumber(value)}
      </span>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-secondary">
        <ClipboardCheck className="size-5 text-muted-foreground" />
      </span>
      <div>
        <p className="text-sm font-medium">Nenhuma tarefa encontrada</p>
        <p className="mt-1 text-sm text-muted-foreground">Ajuste os filtros para ampliar a busca.</p>
      </div>
    </div>
  );
}
