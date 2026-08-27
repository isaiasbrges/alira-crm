"use client";

import * as React from "react";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";
import type { Conversation } from "@/types/conversation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function horario(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function ConversationThread({
  conversation,
  onSend,
  onResolve,
  onVoltar,
}: {
  conversation: Conversation;
  onSend: (texto: string) => void;
  onResolve: () => void;
  onVoltar: () => void;
}) {
  const [rascunho, setRascunho] = React.useState("");
  const fimRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    fimRef.current?.scrollIntoView({ block: "end" });
  }, [conversation.mensagens.length]);

  function enviar(event: React.FormEvent) {
    event.preventDefault();
    if (!rascunho.trim()) return;
    onSend(rascunho.trim());
    setRascunho("");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={onVoltar}
          aria-label="Voltar para as conversas"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="bg-secondary text-xs font-medium">
            {initials(conversation.clienteNome)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium">{conversation.clienteNome}</span>
            {conversation.vip && (
              <Badge variant="amber" className="px-1.5 py-0 text-[10px]">
                VIP
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            Atendido por {conversation.vendedorNome}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={onResolve}
          disabled={conversation.status === "resolvida"}
        >
          <CheckCircle2 className="size-3.5" />
          {conversation.status === "resolvida" ? "Resolvida" : "Marcar como resolvida"}
        </Button>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
        {conversation.mensagens.map((mensagem) => (
          <div
            key={mensagem.id}
            className={cn(
              "flex",
              mensagem.direcao === "enviada" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                mensagem.direcao === "enviada"
                  ? "rounded-br-sm bg-primary text-primary-foreground"
                  : "rounded-bl-sm bg-secondary text-secondary-foreground"
              )}
            >
              <p className="whitespace-pre-wrap">{mensagem.texto}</p>
              <span
                className={cn(
                  "mt-1 block text-right text-[10px]",
                  mensagem.direcao === "enviada"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {horario(mensagem.horario)}
              </span>
            </div>
          </div>
        ))}
        <div ref={fimRef} />
      </div>

      <form onSubmit={enviar} className="flex items-center gap-2 border-t border-border p-3">
        <Input
          value={rascunho}
          onChange={(event) => setRascunho(event.target.value)}
          placeholder="Escreva uma mensagem"
          aria-label="Mensagem"
        />
        <Button type="submit" size="icon" disabled={!rascunho.trim()} aria-label="Enviar">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
