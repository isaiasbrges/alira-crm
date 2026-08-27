export type Tint = "blue" | "violet" | "amber" | "green";

/** Indicador de destaque, exibido em cartão largo no topo do dashboard. */
export type HeroKpi = {
  id: string;
  label: string;
  value: string;
  /** Variação percentual sobre o período anterior. */
  delta: number;
  comparacao: string;
  tint: Tint;
  hint?: string;
};

/** Indicador secundário, exibido na faixa de quatro colunas. */
export type StatTile = {
  id: string;
  label: string;
  value: string;
  delta: number;
  comparacao: string;
  tint: Tint;
};

/** Ponto da série que combina receita (R$) e taxa de recompra (%). */
export type PerformancePoint = {
  dia: string;
  receita: number;
  recompra: number;
};

export type AttentionCustomer = {
  id: string;
  nome: string;
  vip: boolean;
  diasSemComprar: number;
  acumulado: number;
};

export type CampaignStatus = "rascunho" | "agendada" | "enviada" | "pausada";

export type CampaignSummary = {
  id: string;
  nome: string;
  status: CampaignStatus;
  /** Texto pronto: "Enviada em 05/05/2026" ou "Envio em 20/05/2026". */
  dataLabel: string;
  /** Ausentes enquanto a campanha não saiu. */
  abertura?: number;
  conversao?: number;
  receita?: number;
};

export type TaskPriority = "alta" | "media" | "baixa";

export type TaskSummary = {
  id: string;
  titulo: string;
  /** Origem da tarefa: "Reativação • VIP". */
  contexto: string;
  horario: string;
  prioridade: TaskPriority;
  responsavel: string;
};

export type SellerRank = {
  posicao: number;
  nome: string;
  valor: number;
  /** Participação sobre o líder, para a barra de progresso. */
  percentual: number;
};
