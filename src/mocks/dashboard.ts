import type {
  CampaignSummary,
  CategorySlice,
  Kpi,
  ReactivationTarget,
  RepurchasePoint,
  RevenuePoint,
  TaskSummary,
} from "@/types/dashboard";

export const MOCK_KPIS: Kpi[] = [
  {
    id: "clientes-ativos",
    label: "Clientes ativos",
    value: "418",
    delta: 6.4,
    trend: "up",
    hint: "Compraram nos últimos 90 dias",
  },
  {
    id: "clientes-inativos",
    label: "Clientes inativos",
    value: "134",
    delta: -3.1,
    trend: "down",
    hint: "Sem compra há mais de 90 dias",
  },
  {
    id: "clientes-vip",
    label: "Clientes VIP",
    value: "62",
    delta: 4.8,
    trend: "up",
    hint: "Ticket médio acima de R$ 800",
  },
  {
    id: "ticket-medio",
    label: "Ticket médio",
    value: "R$ 684",
    delta: 2.2,
    trend: "up",
    hint: "Média por venda no período",
  },
  {
    id: "taxa-recompra",
    label: "Taxa de recompra",
    value: "37,2%",
    delta: 1.9,
    trend: "up",
    hint: "Clientes com 2+ compras",
  },
  {
    id: "receita-campanhas",
    label: "Receita de campanhas",
    value: "R$ 48.320",
    delta: 12.5,
    trend: "up",
    hint: "Atribuída a campanhas de WhatsApp",
  },
];

export const MOCK_REVENUE_SERIES: RevenuePoint[] = [
  { periodo: "Mar", receita: 142000, receitaCampanhas: 18400 },
  { periodo: "Abr", receita: 158000, receitaCampanhas: 21600 },
  { periodo: "Mai", receita: 149000, receitaCampanhas: 19800 },
  { periodo: "Jun", receita: 173000, receitaCampanhas: 28200 },
  { periodo: "Jul", receita: 186000, receitaCampanhas: 34100 },
  { periodo: "Ago", receita: 204000, receitaCampanhas: 48320 },
];

export const MOCK_REPURCHASE_SERIES: RepurchasePoint[] = [
  { periodo: "Mar", taxa: 28.4 },
  { periodo: "Abr", taxa: 30.1 },
  { periodo: "Mai", taxa: 29.6 },
  { periodo: "Jun", taxa: 33.8 },
  { periodo: "Jul", taxa: 35.3 },
  { periodo: "Ago", taxa: 37.2 },
];

export const MOCK_CATEGORY_SLICES: CategorySlice[] = [
  { categoria: "Vestidos", clientes: 186 },
  { categoria: "Alfaiataria", clientes: 142 },
  { categoria: "Malhas", clientes: 118 },
  { categoria: "Jeans", clientes: 94 },
  { categoria: "Festa", clientes: 72 },
];

export const MOCK_RECENT_CAMPAIGNS: CampaignSummary[] = [
  {
    id: "cmp_001",
    nome: "Pré-lançamento coleção primavera",
    status: "enviada",
    enviadas: 312,
    respostas: 84,
    receita: 24600,
    data: "2026-08-21",
  },
  {
    id: "cmp_002",
    nome: "Reativação — 90 dias sem comprar",
    status: "enviada",
    enviadas: 128,
    respostas: 31,
    receita: 12840,
    data: "2026-08-14",
  },
  {
    id: "cmp_003",
    nome: "Aniversariantes de setembro",
    status: "agendada",
    enviadas: 0,
    respostas: 0,
    receita: 0,
    data: "2026-09-01",
  },
  {
    id: "cmp_004",
    nome: "VIP — peças exclusivas",
    status: "rascunho",
    enviadas: 0,
    respostas: 0,
    receita: 0,
    data: "2026-08-25",
  },
];

export const MOCK_TODAY_TASKS: TaskSummary[] = [
  {
    id: "tsk_001",
    titulo: "Enviar looks da nova coleção",
    clienteNome: "Juliana Martins",
    responsavel: "Ana Ribeiro",
    horario: "09:30",
    prioridade: "alta",
  },
  {
    id: "tsk_002",
    titulo: "Confirmar ajuste do vestido",
    clienteNome: "Beatriz Nogueira",
    responsavel: "Marina Lopes",
    horario: "11:00",
    prioridade: "alta",
  },
  {
    id: "tsk_003",
    titulo: "Follow-up pós-compra",
    clienteNome: "Larissa Prado",
    responsavel: "Marina Lopes",
    horario: "14:00",
    prioridade: "media",
  },
  {
    id: "tsk_004",
    titulo: "Convidar para provador privativo",
    clienteNome: "Patrícia Duarte",
    responsavel: "Ana Ribeiro",
    horario: "16:30",
    prioridade: "baixa",
  },
];

export const MOCK_REACTIVATION_TARGETS: ReactivationTarget[] = [
  {
    id: "cus_005",
    nome: "Camila Ferraz",
    diasSemComprar: 221,
    totalGasto: 890,
    ultimaCategoria: "Jeans",
  },
  {
    id: "cus_007",
    nome: "Fernanda Rocha",
    diasSemComprar: 295,
    totalGasto: 1620,
    ultimaCategoria: "Malhas",
  },
  {
    id: "cus_011",
    nome: "Priscila Andrade",
    diasSemComprar: 247,
    totalGasto: 1340,
    ultimaCategoria: "Jeans",
  },
];
