export type CampaignStatus = "rascunho" | "agendada" | "enviando" | "enviada" | "pausada" | "cancelada";

export type CampaignMetrics = {
  enviadas: number;
  entregues: number;
  lidas: number;
  respondidas: number;
  receita: number;
};

export type Campaign = {
  id: string;
  nome: string;
  status: CampaignStatus;
  segmentoId?: string;
  segmentoNome: string;
  templateNome: string;
  destinatarios: number;
  agendadaPara?: string;
  enviadaEm?: string;
  /** Só existe depois que a campanha sai — não há disparo real, é preenchido na criação de exemplo. */
  metrics?: CampaignMetrics;
};

export type CampaignFilters = {
  busca: string;
  status: CampaignStatus | "todos";
};

export const CAMPAIGN_FILTERS_DEFAULT: CampaignFilters = {
  busca: "",
  status: "todos",
};

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  rascunho: "Rascunho",
  agendada: "Agendada",
  enviando: "Enviando",
  enviada: "Enviada",
  pausada: "Pausada",
  cancelada: "Cancelada",
};
