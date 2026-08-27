import type { Segment } from "@/types/segment";

export const MOCK_SEGMENTS: Segment[] = [
  {
    id: "seg-1",
    nome: "VIP com WhatsApp autorizado",
    descricao: "Base para campanhas de relacionamento de alto ticket.",
    logica: "AND",
    regras: [
      { id: "r1", campo: "status", operador: "igual", valor: "vip" },
      { id: "r2", campo: "whatsappAutorizado", operador: "igual", valor: "sim" },
    ],
    createdAt: "2026-07-02T10:00:00",
  },
  {
    id: "seg-2",
    nome: "Para reativar — 90 dias",
    descricao: "Clientes sem compra há mais de 90 dias, para campanha de reativação.",
    logica: "AND",
    regras: [
      { id: "r1", campo: "diasSemComprar", operador: "maior", valor: "90" },
      { id: "r2", campo: "whatsappAutorizado", operador: "igual", valor: "sim" },
    ],
    createdAt: "2026-07-18T14:20:00",
  },
  {
    id: "seg-3",
    nome: "Compradoras de Alfaiataria ou Festa",
    descricao: "Perfil para pré-lançamento da próxima coleção.",
    logica: "OR",
    regras: [
      { id: "r1", campo: "categoria", operador: "contem", valor: "Alfaiataria" },
      { id: "r2", campo: "categoria", operador: "contem", valor: "Festa" },
    ],
    createdAt: "2026-08-05T09:15:00",
  },
  {
    id: "seg-4",
    nome: "Ticket médio acima de R$ 800",
    descricao: "",
    logica: "AND",
    regras: [{ id: "r1", campo: "ticketMedio", operador: "maior", valor: "800" }],
    createdAt: "2026-08-12T16:40:00",
  },
];
