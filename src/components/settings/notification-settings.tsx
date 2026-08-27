"use client";

import * as React from "react";

import { Switch } from "@/components/ui/switch";

type NotificationOption = {
  id: string;
  titulo: string;
  descricao: string;
  padrao: boolean;
};

const OPCOES: NotificationOption[] = [
  {
    id: "tarefas-vencendo",
    titulo: "Tarefas vencendo",
    descricao: "Avisar quando uma tarefa atribuída a mim estiver perto do prazo.",
    padrao: true,
  },
  {
    id: "clientes-reativar",
    titulo: "Clientes para reativar",
    descricao: "Resumo semanal de clientes sem comprar há mais de 90 dias.",
    padrao: true,
  },
  {
    id: "campanhas-enviadas",
    titulo: "Campanhas enviadas",
    descricao: "Notificar quando uma campanha agendada for concluída.",
    padrao: false,
  },
  {
    id: "estoque-baixo",
    titulo: "Estoque baixo",
    descricao: "Avisar quando uma variante de produto ficar com estoque baixo.",
    padrao: true,
  },
];

export function NotificationSettings() {
  const [ativas, setAtivas] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(OPCOES.map((opcao) => [opcao.id, opcao.padrao]))
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold">Notificações</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        O que você quer receber sobre a operação da loja.
      </p>

      <ul className="mt-4 divide-y divide-border">
        {OPCOES.map((opcao) => (
          <li key={opcao.id} className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <div className="text-sm font-medium">{opcao.titulo}</div>
              <div className="text-xs text-muted-foreground">{opcao.descricao}</div>
            </div>
            <Switch
              checked={ativas[opcao.id]}
              onCheckedChange={(checked) =>
                setAtivas((atual) => ({ ...atual, [opcao.id]: checked }))
              }
              aria-label={opcao.titulo}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
