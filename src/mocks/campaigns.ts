import type { Campaign } from "@/types/campaign";

export const MOCK_TEMPLATES = [
  "Pré-lançamento de coleção",
  "Reativação — desconto de retorno",
  "Aniversário do mês",
  "Confirmação de pedido",
  "Convite para evento na loja",
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-1",
    nome: "Pré-lançamento coleção Inverno",
    status: "enviada",
    segmentoId: "seg-3",
    segmentoNome: "Compradoras de Alfaiataria ou Festa",
    templateNome: "Pré-lançamento de coleção",
    destinatarios: 312,
    enviadaEm: "2026-08-20T09:00:00",
    metrics: { enviadas: 312, entregues: 305, lidas: 194, respondidas: 84, receita: 24600 },
  },
  {
    id: "camp-2",
    nome: "Reativação — 90 dias",
    status: "enviada",
    segmentoId: "seg-2",
    segmentoNome: "Para reativar — 90 dias",
    templateNome: "Reativação — desconto de retorno",
    destinatarios: 128,
    enviadaEm: "2026-08-15T10:30:00",
    metrics: { enviadas: 128, entregues: 124, lidas: 66, respondidas: 31, receita: 12840 },
  },
  {
    id: "camp-3",
    nome: "Aniversariantes de setembro",
    status: "agendada",
    segmentoNome: "Aniversariantes do mês",
    templateNome: "Aniversário do mês",
    destinatarios: 47,
    agendadaPara: "2026-09-01T08:00:00",
  },
  {
    id: "camp-4",
    nome: "VIP — peças exclusivas",
    status: "rascunho",
    segmentoId: "seg-1",
    segmentoNome: "VIP com WhatsApp autorizado",
    templateNome: "Convite para evento na loja",
    destinatarios: 3,
  },
  {
    id: "camp-5",
    nome: "Liquidação de verão",
    status: "pausada",
    segmentoNome: "Toda a base com WhatsApp autorizado",
    templateNome: "Pré-lançamento de coleção",
    destinatarios: 890,
  },
];
