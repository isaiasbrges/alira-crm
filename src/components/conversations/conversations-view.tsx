"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

import type { Conversation } from "@/types/conversation";
import {
  enviarMensagemAction,
  marcarResolvidaAction,
} from "@/app/(crm)/atendimentos/actions";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { ConversationList } from "@/components/conversations/conversation-list";
import { ConversationThread } from "@/components/conversations/conversation-thread";
import { NewConversationDialog } from "@/components/conversations/new-conversation-dialog";

type ConversationsViewProps = {
  conversations: Conversation[];
  clientesSemConversa: { id: string; nome: string }[];
};

export function ConversationsView({
  conversations,
  clientesSemConversa,
}: ConversationsViewProps) {
  const router = useRouter();
  // Começa sem conversa selecionada: no mobile isso mostra a lista primeiro
  // (o padrão esperado), e no desktop mostra o placeholder de seleção — não
  // dá pra ter os dois comportamentos com uma seleção padrão fixa.
  const [ativaId, setAtivaId] = React.useState<string | null>(null);
  const [, startTransition] = React.useTransition();

  const ativa =
    conversations.find((conversa) => conversa.id === ativaId) ?? null;

  function enviarMensagem(texto: string) {
    if (!ativaId) return;
    startTransition(async () => {
      await enviarMensagemAction(ativaId, texto);
      router.refresh();
    });
  }

  function marcarResolvida() {
    if (!ativaId) return;
    startTransition(async () => {
      await marcarResolvidaAction(ativaId);
      router.refresh();
    });
  }

  function aoCriarConversa(clienteId: string) {
    setAtivaId(clienteId);
    router.refresh();
  }

  return (
    <>
      <PageHeader
        titulo="Atendimentos"
        descricao="Conversas de WhatsApp com os clientes."
      >
        {clientesSemConversa.length > 0 && (
          <NewConversationDialog
            clientes={clientesSemConversa}
            onCreated={aoCriarConversa}
          />
        )}
      </PageHeader>

      <Card className="grid h-[calc(100dvh-13rem)] min-h-[420px] grid-cols-1 gap-0 overflow-hidden p-0 lg:grid-cols-[320px_1fr]">
        <div
          className={`overflow-y-auto border-border lg:block lg:border-r ${ativa ? "hidden" : "block"}`}
        >
          {conversations.length === 0 ? (
            <EmptyState />
          ) : (
            <ConversationList
              conversations={conversations}
              ativaId={ativaId}
              onSelect={setAtivaId}
            />
          )}
        </div>

        <div className={ativa ? "block" : "hidden lg:block"}>
          {ativa ? (
            <ConversationThread
              conversation={ativa}
              onSend={enviarMensagem}
              onResolve={marcarResolvida}
              onVoltar={() => setAtivaId(null)}
            />
          ) : (
            <div className="hidden h-full items-center justify-center text-sm text-muted-foreground lg:flex">
              Selecione uma conversa
            </div>
          )}
        </div>
      </Card>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-secondary">
        <MessageCircle className="size-5 text-muted-foreground" />
      </span>
      <p className="text-sm font-medium">Nenhuma conversa ainda</p>
    </div>
  );
}
