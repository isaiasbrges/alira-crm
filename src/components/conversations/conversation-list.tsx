import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";
import type { Conversation } from "@/types/conversation";
import { ultimaMensagem } from "@/types/conversation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function horario(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function ConversationList({
  conversations,
  ativaId,
  onSelect,
}: {
  conversations: Conversation[];
  ativaId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ul className="divide-y divide-border">
      {conversations.map((conversa) => {
        const ultima = ultimaMensagem(conversa);
        const ativa = conversa.id === ativaId;

        return (
          <li key={conversa.id}>
            <button
              type="button"
              onClick={() => onSelect(conversa.id)}
              className={cn(
                "flex w-full items-start gap-2.5 px-3 py-3 text-left transition-colors hover:bg-secondary/60",
                ativa && "bg-accent"
              )}
            >
              <Avatar className="size-9 shrink-0">
                <AvatarFallback className="bg-secondary text-xs font-medium">
                  {initials(conversa.clienteNome)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-medium">{conversa.clienteNome}</span>
                  {conversa.vip && (
                    <Badge variant="amber" className="shrink-0 px-1.5 py-0 text-[10px]">
                      VIP
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {ultima?.direcao === "enviada" && "Você: "}
                  {ultima?.texto ?? "Sem mensagens"}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1.5">
                {ultima && (
                  <span className="text-[11px] text-muted-foreground">
                    {horario(ultima.horario)}
                  </span>
                )}
                {conversa.status === "resolvida" && (
                  <span className="size-1.5 rounded-full bg-success" title="Resolvida" />
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
