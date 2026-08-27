export type MessageDirection = "recebida" | "enviada";

export type ConversationMessage = {
  id: string;
  direcao: MessageDirection;
  texto: string;
  horario: string;
};

export type ConversationStatus = "aberta" | "resolvida";

export type Conversation = {
  id: string;
  clienteNome: string;
  clienteId?: string;
  vip: boolean;
  status: ConversationStatus;
  vendedorNome: string;
  mensagens: ConversationMessage[];
};

export function ultimaMensagem(conversa: Conversation): ConversationMessage | undefined {
  return conversa.mensagens[conversa.mensagens.length - 1];
}
