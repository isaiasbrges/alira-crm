import type {
  AttentionCustomer,
  CampaignSummary,
  HeroKpi,
  PerformancePoint,
  SellerRank,
  StatTile,
  TaskSummary,
} from "@/types/dashboard";

export const MOCK_HERO_KPIS: HeroKpi[] = [
  {
    id: "receita-relacionamento",
    label: "Receita de Relacionamento",
    value: "R$ 48.320,00",
    delta: 12.5,
    comparacao: "vs Jul 2026",
    tint: "blue",
    hint: "Receita atribuída a campanhas e reativações",
  },
  {
    id: "taxa-recompra",
    label: "Taxa de Recompra",
    value: "37,2%",
    delta: 8.4,
    comparacao: "vs Jul 2026",
    tint: "violet",
    hint: "Clientes que compraram mais de uma vez",
  },
];

export const MOCK_STAT_TILES: StatTile[] = [
  {
    id: "clientes-ativos",
    label: "Clientes ativos",
    value: "1.256",
    delta: 9.3,
    comparacao: "vs Jul 2026",
    tint: "blue",
  },
  {
    id: "clientes-vip",
    label: "Clientes VIP",
    value: "238",
    delta: 7.1,
    comparacao: "vs Jul 2026",
    tint: "violet",
  },
  {
    id: "ticket-medio",
    label: "Ticket médio",
    value: "R$ 386,90",
    delta: 5.8,
    comparacao: "vs Jul 2026",
    tint: "amber",
  },
  {
    id: "clientes-reativados",
    label: "Clientes reativados",
    value: "134",
    delta: 14.2,
    comparacao: "vs Jul 2026",
    tint: "green",
  },
];

/** Série diária do mês: receita em R$ e taxa de recompra em %. */
export const MOCK_PERFORMANCE_SERIES: PerformancePoint[] = [
  { dia: "01", receita: 4200, recompra: 28 },
  { dia: "02", receita: 5100, recompra: 30 },
  { dia: "03", receita: 6800, recompra: 33 },
  { dia: "04", receita: 9400, recompra: 36 },
  { dia: "05", receita: 14600, recompra: 41 },
  { dia: "06", receita: 10200, recompra: 44 },
  { dia: "07", receita: 7300, recompra: 40 },
  { dia: "08", receita: 5900, recompra: 37 },
  { dia: "09", receita: 5400, recompra: 35 },
  { dia: "10", receita: 6100, recompra: 38 },
  { dia: "11", receita: 5700, recompra: 42 },
  { dia: "12", receita: 6900, recompra: 45 },
  { dia: "13", receita: 8800, recompra: 47 },
  { dia: "14", receita: 7200, recompra: 44 },
  { dia: "15", receita: 6300, recompra: 41 },
  { dia: "16", receita: 5800, recompra: 39 },
  { dia: "17", receita: 6600, recompra: 43 },
  { dia: "18", receita: 8100, recompra: 46 },
  { dia: "19", receita: 9600, recompra: 48 },
  { dia: "20", receita: 7400, recompra: 45 },
  { dia: "21", receita: 6200, recompra: 42 },
  { dia: "22", receita: 5500, recompra: 40 },
  { dia: "23", receita: 6000, recompra: 38 },
  { dia: "24", receita: 7800, recompra: 41 },
  { dia: "25", receita: 9200, recompra: 44 },
  { dia: "26", receita: 12800, recompra: 47 },
  { dia: "27", receita: 10400, recompra: 45 },
  { dia: "28", receita: 8300, recompra: 42 },
  { dia: "29", receita: 7100, recompra: 40 },
  { dia: "30", receita: 6400, recompra: 38 },
  { dia: "31", receita: 5900, recompra: 37 },
];

export const MOCK_ATTENTION_CUSTOMERS: AttentionCustomer[] = [
  { id: "cli-1", nome: "Juliana Martins", vip: true, diasSemComprar: 87, acumulado: 8420 },
  { id: "cli-2", nome: "Camila Ferreira", vip: false, diasSemComprar: 122, acumulado: 4890 },
  { id: "cli-3", nome: "Renata Oliveira", vip: false, diasSemComprar: 95, acumulado: 3620 },
  { id: "cli-4", nome: "Mariana Santos", vip: false, diasSemComprar: 150, acumulado: 2780 },
];

export const MOCK_RECENT_CAMPAIGNS: CampaignSummary[] = [
  {
    id: "camp-1",
    nome: "Dia das Mães",
    status: "enviada",
    dataLabel: "Enviada em 05/05/2026",
    abertura: 62,
    conversao: 18.7,
    receita: 12430,
  },
  {
    id: "camp-2",
    nome: "Nova Coleção Inverno",
    status: "agendada",
    dataLabel: "Envio em 20/05/2026",
  },
];

export const MOCK_TODAY_TASKS: TaskSummary[] = [
  {
    id: "task-1",
    titulo: "Ligar para Juliana Martins",
    contexto: "Reativação • VIP",
    horario: "09:00",
    prioridade: "alta",
    responsavel: "Ana Ribeiro",
  },
  {
    id: "task-2",
    titulo: "Enviar novidades para segmento VIP",
    contexto: "Campanha • Segmento VIP",
    horario: "11:30",
    prioridade: "media",
    responsavel: "Marina Lopes",
  },
  {
    id: "task-3",
    titulo: "Follow-up Camila Ferreira",
    contexto: "Reativação • Cliente inativa",
    horario: "14:00",
    prioridade: "alta",
    responsavel: "Carla Souza",
  },
];

export const MOCK_TOP_SELLERS: SellerRank[] = [
  { posicao: 1, nome: "Maria Eduarda", valor: 32450, percentual: 100 },
  { posicao: 2, nome: "Isaias Nascimento", valor: 28760, percentual: 89 },
  { posicao: 3, nome: "Ana Clara", valor: 21340, percentual: 66 },
];
