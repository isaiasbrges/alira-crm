import type { Metadata } from "next";

import { ConversationsView } from "@/components/conversations/conversations-view";

export const metadata: Metadata = {
  title: "Atendimentos · Alira CRM",
};

export default function AtendimentosPage() {
  return <ConversationsView />;
}
