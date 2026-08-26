export type KpiTrend = "up" | "down" | "flat";

export type Kpi = {
  id: string;
  label: string;
  value: string;
  /** Variação percentual em relação ao período anterior. */
  delta?: number;
  trend: KpiTrend;
  hint?: string;
};

export type RevenuePoint = {
  periodo: string;
  receita: number;
  receitaCampanhas: number;
};

export type RepurchasePoint = {
  periodo: string;
  taxa: number;
};

export type CategorySlice = {
  categoria: string;
  clientes: number;
};

export type CampaignStatus = "rascunho" | "agendada" | "enviada" | "pausada";

export type CampaignSummary = {
  id: string;
  nome: string;
  status: CampaignStatus;
  enviadas: number;
  respostas: number;
  receita: number;
  data: string;
};

export type TaskPriority = "alta" | "media" | "baixa";

export type TaskSummary = {
  id: string;
  titulo: string;
  clienteNome: string;
  responsavel: string;
  horario: string;
  prioridade: TaskPriority;
};

export type ReactivationTarget = {
  id: string;
  nome: string;
  diasSemComprar: number;
  totalGasto: number;
  ultimaCategoria: string;
};
