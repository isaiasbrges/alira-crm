import type { Metadata } from "next";

import {
  listarAtendimentosTela,
  listarClientesSemConversa,
} from "@/repositories/conversations";
import { ConversationsView } from "@/components/conversations/conversations-view";

export const metadata: Metadata = {
  title: "Atendimentos · Alira CRM",
};

export default async function AtendimentosPage() {
  const [conversations, clientesSemConversa] = await Promise.all([
    listarAtendimentosTela(),
    listarClientesSemConversa(),
  ]);

  return (
    <ConversationsView
      conversations={conversations}
      clientesSemConversa={clientesSemConversa}
    />
  );
}
