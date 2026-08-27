import "server-only";

import { getTenantContext } from "@/lib/tenant/context";
import { tenantDb } from "@/lib/tenant/db";
import type {
  AttentionCustomer,
  CampaignSummary,
  HeroKpi,
  PerformancePoint,
  SellerRank,
  StatTile,
  TaskSummary,
} from "@/types/dashboard";
import type {
  CategorySlice,
  MonthlyRevenuePoint,
  SellerPerformance,
} from "@/types/report";

const MESES_CURTOS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function inicioDoMes(data: Date): Date {
  return new Date(data.getFullYear(), data.getMonth(), 1);
}

function calcularDelta(atual: number, anterior: number): number {
  if (anterior === 0) return atual > 0 ? 100 : 0;
  return Number((((atual - anterior) / anterior) * 100).toFixed(1));
}

function diasEntre(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / 86_400_000);
}

/** Carrega tudo que o Dashboard precisa, calculado ao vivo contra o banco. */
export async function carregarDashboardTela() {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);
  const storeId = ctx.storeId ?? undefined;

  const agora = new Date();
  const inicioMesAtual = inicioDoMes(agora);
  const inicioMesAnterior = new Date(
    inicioMesAtual.getFullYear(),
    inicioMesAtual.getMonth() - 1,
    1,
  );
  const inicioHoje = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate(),
  );
  const fimHoje = new Date(inicioHoje.getTime() + 86_400_000);

  const [
    vendasMesAtual,
    vendasMesAnterior,
    totalClientes,
    clientesAtivos,
    clientesVip,
    clientesComCompra,
    clientesRecompra,
    tarefasHoje,
    campanhasRecentes,
    vendedoresMes,
    clientesParaAtencao,
    totalComprasPorCliente,
    vendedoresAtivos,
  ] = await Promise.all([
    db.sale.findMany({
      where: {
        storeId,
        status: "CONCLUIDA",
        concluidaEm: { gte: inicioMesAtual },
      },
      select: {
        total: true,
        campaignId: true,
        concluidaEm: true,
        customerId: true,
      },
    }),
    db.sale.findMany({
      where: {
        storeId,
        status: "CONCLUIDA",
        concluidaEm: { gte: inicioMesAnterior, lt: inicioMesAtual },
      },
      select: { total: true, campaignId: true },
    }),
    db.customer.count({ where: { storeId } }),
    db.customer.count({ where: { storeId, status: { not: "INATIVO" } } }),
    db.customer.count({ where: { storeId, status: "VIP" } }),
    db.customer.count({ where: { storeId, totalCompras: { gte: 1 } } }),
    db.customer.count({ where: { storeId, totalCompras: { gte: 2 } } }),
    db.task.findMany({
      where: {
        storeId,
        status: "PENDENTE",
        venceEm: { gte: inicioHoje, lt: fimHoje },
      },
      orderBy: { venceEm: "asc" },
      include: {
        customer: { select: { nome: true } },
        seller: { select: { nome: true } },
      },
    }),
    db.campaign.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        nome: true,
        status: true,
        agendadaPara: true,
        enviadaEm: true,
      },
    }),
    db.sale.findMany({
      where: {
        storeId,
        status: "CONCLUIDA",
        concluidaEm: { gte: inicioMesAtual },
        sellerId: { not: null },
      },
      select: { sellerId: true, total: true },
    }),
    db.customer.findMany({
      where: { storeId, ultimaCompra: { not: null } },
      select: {
        id: true,
        nome: true,
        status: true,
        ultimaCompra: true,
        totalGasto: true,
      },
      orderBy: { ultimaCompra: "asc" },
      take: 20,
    }),
    db.customer.findMany({
      where: { storeId },
      select: { id: true, totalCompras: true },
    }),
    db.seller.findMany({
      where: { storeId, ativo: true },
      select: { id: true, nome: true },
    }),
  ]);

  const receitaRelacionamentoAtual = vendasMesAtual
    .filter((venda) => venda.campaignId)
    .reduce((soma, venda) => soma + Number(venda.total), 0);
  const receitaRelacionamentoAnterior = vendasMesAnterior
    .filter((venda) => venda.campaignId)
    .reduce((soma, venda) => soma + Number(venda.total), 0);

  const taxaRecompra =
    clientesComCompra > 0 ? (clientesRecompra / clientesComCompra) * 100 : 0;

  const ticketMedioAtual =
    vendasMesAtual.length > 0
      ? vendasMesAtual.reduce((soma, venda) => soma + Number(venda.total), 0) /
        vendasMesAtual.length
      : 0;
  const ticketMedioAnterior =
    vendasMesAnterior.length > 0
      ? vendasMesAnterior.reduce(
          (soma, venda) => soma + Number(venda.total),
          0,
        ) / vendasMesAnterior.length
      : 0;

  const heroKpis: HeroKpi[] = [
    {
      id: "receita-relacionamento",
      label: "Receita de Relacionamento",
      value: formatBRL(receitaRelacionamentoAtual),
      delta: calcularDelta(
        receitaRelacionamentoAtual,
        receitaRelacionamentoAnterior,
      ),
      comparacao: `vs ${MESES_CURTOS[inicioMesAnterior.getMonth()]} ${inicioMesAnterior.getFullYear()}`,
      tint: "blue",
      hint: "Receita de vendas atribuídas a campanhas, no mês",
    },
    {
      id: "taxa-recompra",
      label: "Taxa de Recompra",
      value: `${taxaRecompra.toFixed(1).replace(".", ",")}%`,
      delta: 0,
      comparacao: "no momento",
      tint: "violet",
      hint: "Clientes que compraram mais de uma vez",
    },
  ];

  const statTiles: StatTile[] = [
    {
      id: "clientes-ativos",
      label: "Clientes ativos",
      value: formatInt(clientesAtivos),
      delta: 0,
      comparacao: "no momento",
      tint: "blue",
    },
    {
      id: "clientes-vip",
      label: "Clientes VIP",
      value: formatInt(clientesVip),
      delta: 0,
      comparacao: "no momento",
      tint: "violet",
    },
    {
      id: "ticket-medio",
      label: "Ticket médio",
      value: formatBRL(ticketMedioAtual),
      delta: calcularDelta(ticketMedioAtual, ticketMedioAnterior),
      comparacao: `vs ${MESES_CURTOS[inicioMesAnterior.getMonth()]} ${inicioMesAnterior.getFullYear()}`,
      tint: "amber",
    },
    {
      id: "total-clientes",
      label: "Base de clientes",
      value: formatInt(totalClientes),
      delta: 0,
      comparacao: "no momento",
      tint: "green",
    },
  ];

  const totalComprasPorClienteMap = new Map(
    totalComprasPorCliente.map((cliente) => [cliente.id, cliente.totalCompras]),
  );
  const performanceSeries: PerformancePoint[] = construirSerieDiaria(
    vendasMesAtual,
    agora,
    totalComprasPorClienteMap,
  );

  const attentionCustomers: AttentionCustomer[] = clientesParaAtencao
    .filter(
      (cliente) =>
        cliente.ultimaCompra && diasEntre(agora, cliente.ultimaCompra) >= 45,
    )
    .slice(0, 4)
    .map((cliente) => ({
      id: cliente.id,
      nome: cliente.nome,
      vip: cliente.status === "VIP",
      diasSemComprar: diasEntre(agora, cliente.ultimaCompra as Date),
      acumulado: Number(cliente.totalGasto),
    }));

  const recentCampaigns: CampaignSummary[] = campanhasRecentes.map(
    (campanha) => ({
      id: campanha.id,
      nome: campanha.nome,
      status: mapearStatusCampanhaResumo(campanha.status),
      dataLabel: campanha.enviadaEm
        ? `Enviada em ${formatarData(campanha.enviadaEm)}`
        : campanha.agendadaPara
          ? `Envio em ${formatarData(campanha.agendadaPara)}`
          : "Em rascunho",
    }),
  );

  const todayTasks: TaskSummary[] = tarefasHoje.map((tarefa) => ({
    id: tarefa.id,
    titulo: tarefa.titulo,
    contexto: tarefa.customer?.nome
      ? `Cliente: ${tarefa.customer.nome}`
      : "Tarefa geral",
    horario: tarefa.venceEm
      ? tarefa.venceEm.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—",
    prioridade: mapearPrioridade(tarefa.prioridade),
    responsavel: tarefa.seller?.nome ?? "—",
  }));

  const nomesVendedores = new Map(
    vendedoresAtivos.map((vendedor) => [vendedor.id, vendedor.nome]),
  );
  const topSellers: SellerRank[] = rankearVendedores(
    vendedoresMes,
    nomesVendedores,
  );

  return {
    heroKpis,
    statTiles,
    performanceSeries,
    attentionCustomers,
    recentCampaigns,
    todayTasks,
    topSellers,
  };
}

/** Carrega tudo que Relatórios precisa. */
export async function carregarRelatoriosTela() {
  const ctx = await getTenantContext();
  const db = tenantDb(ctx);
  const storeId = ctx.storeId ?? undefined;

  const agora = new Date();
  const seiseMesesAtras = new Date(
    agora.getFullYear(),
    agora.getMonth() - 5,
    1,
  );

  const [vendas, clientes, vendedoresTodos] = await Promise.all([
    db.sale.findMany({
      where: {
        storeId,
        status: "CONCLUIDA",
        concluidaEm: { gte: seiseMesesAtras },
      },
      select: {
        total: true,
        campaignId: true,
        concluidaEm: true,
        sellerId: true,
      },
    }),
    db.customer.findMany({
      where: { storeId },
      include: { preferences: { select: { categoriasFavoritas: true } } },
    }),
    db.seller.findMany({
      where: { storeId, ativo: true },
      select: { id: true, nome: true },
    }),
  ]);

  const monthlyRevenue: MonthlyRevenuePoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const mesRef = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
    const proximoMes = new Date(mesRef.getFullYear(), mesRef.getMonth() + 1, 1);
    const vendasDoMes = vendas.filter(
      (venda) =>
        venda.concluidaEm &&
        venda.concluidaEm >= mesRef &&
        venda.concluidaEm < proximoMes,
    );
    monthlyRevenue.push({
      mes: MESES_CURTOS[mesRef.getMonth()],
      receita: vendasDoMes.reduce(
        (soma, venda) => soma + Number(venda.total),
        0,
      ),
      receitaCampanhas: vendasDoMes
        .filter((venda) => venda.campaignId)
        .reduce((soma, venda) => soma + Number(venda.total), 0),
    });
  }

  const contagemCategorias = new Map<string, number>();
  for (const cliente of clientes) {
    const categorias = Array.isArray(cliente.preferences?.categoriasFavoritas)
      ? (cliente.preferences?.categoriasFavoritas as unknown[])
      : [];
    for (const categoria of categorias) {
      if (typeof categoria !== "string") continue;
      contagemCategorias.set(
        categoria,
        (contagemCategorias.get(categoria) ?? 0) + 1,
      );
    }
  }
  const categoryBreakdown: CategorySlice[] = [...contagemCategorias.entries()]
    .map(([categoria, total]) => ({ categoria, clientes: total }))
    .sort((a, b) => b.clientes - a.clientes)
    .slice(0, 6);

  const porVendedor = new Map<string, { vendas: number; receita: number }>();
  for (const venda of vendas) {
    if (!venda.sellerId) continue;
    const atual = porVendedor.get(venda.sellerId) ?? { vendas: 0, receita: 0 };
    atual.vendas += 1;
    atual.receita += Number(venda.total);
    porVendedor.set(venda.sellerId, atual);
  }
  const sellerPerformance: SellerPerformance[] = vendedoresTodos
    .map((vendedor) => {
      const dados = porVendedor.get(vendedor.id) ?? { vendas: 0, receita: 0 };
      return {
        vendedorId: vendedor.id,
        nome: vendedor.nome,
        vendas: dados.vendas,
        receita: dados.receita,
        ticketMedio: dados.vendas > 0 ? dados.receita / dados.vendas : 0,
      };
    })
    .sort((a, b) => b.receita - a.receita);

  return { monthlyRevenue, categoryBreakdown, sellerPerformance };
}

/**
 * Receita diária e, no mesmo ponto, a taxa de recompra acumulada até aquele
 * dia — dos clientes que já compraram no mês até ali, qual fração é
 * compradora recorrente (`totalCompras` atual >= 2). É uma leitura real,
 * só que com o `totalCompras` de hoje em vez de "como estava naquele dia" —
 * não dá pra reconstruir o histórico exato sem uma tabela de snapshots.
 */
function construirSerieDiaria(
  vendas: {
    total: unknown;
    concluidaEm: Date | null;
    customerId: string | null;
  }[],
  referencia: Date,
  totalComprasPorCliente: Map<string, number>,
): PerformancePoint[] {
  const diasNoMes = new Date(
    referencia.getFullYear(),
    referencia.getMonth() + 1,
    0,
  ).getDate();
  const receitaPorDia = new Map<number, number>();
  const clientesPorDia = new Map<number, Set<string>>();

  for (const venda of vendas) {
    if (!venda.concluidaEm) continue;
    const dia = venda.concluidaEm.getDate();
    receitaPorDia.set(dia, (receitaPorDia.get(dia) ?? 0) + Number(venda.total));
    if (venda.customerId) {
      if (!clientesPorDia.has(dia)) clientesPorDia.set(dia, new Set());
      clientesPorDia.get(dia)!.add(venda.customerId);
    }
  }

  const pontos: PerformancePoint[] = [];
  const clientesAcumulados = new Set<string>();

  for (let dia = 1; dia <= diasNoMes && dia <= referencia.getDate(); dia++) {
    for (const clienteId of clientesPorDia.get(dia) ?? []) {
      clientesAcumulados.add(clienteId);
    }

    let recorrentes = 0;
    for (const clienteId of clientesAcumulados) {
      if ((totalComprasPorCliente.get(clienteId) ?? 0) >= 2) recorrentes += 1;
    }
    const recompra =
      clientesAcumulados.size > 0
        ? (recorrentes / clientesAcumulados.size) * 100
        : 0;

    pontos.push({
      dia: String(dia).padStart(2, "0"),
      receita: receitaPorDia.get(dia) ?? 0,
      recompra: Number(recompra.toFixed(1)),
    });
  }

  return pontos;
}

function rankearVendedores(
  vendas: { sellerId: string | null; total: unknown }[],
  nomes: Map<string, string>,
): SellerRank[] {
  const porVendedor = new Map<string, number>();
  for (const venda of vendas) {
    if (!venda.sellerId) continue;
    porVendedor.set(
      venda.sellerId,
      (porVendedor.get(venda.sellerId) ?? 0) + Number(venda.total),
    );
  }

  const ranking = [...porVendedor.entries()]
    .map(([sellerId, valor]) => ({
      sellerId,
      nome: nomes.get(sellerId) ?? "—",
      valor,
    }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5);

  const lider = ranking[0]?.valor ?? 0;

  return ranking.map((vendedor, indice) => ({
    posicao: indice + 1,
    nome: vendedor.nome,
    valor: vendedor.valor,
    percentual: lider > 0 ? Math.round((vendedor.valor / lider) * 100) : 0,
  }));
}

function mapearPrioridade(prioridade: string): "alta" | "media" | "baixa" {
  if (prioridade === "ALTA") return "alta";
  if (prioridade === "BAIXA") return "baixa";
  return "media";
}

function mapearStatusCampanhaResumo(
  status: string,
): "rascunho" | "agendada" | "enviada" | "pausada" {
  if (status === "AGENDADA") return "agendada";
  if (status === "ENVIADA") return "enviada";
  if (status === "PAUSADA") return "pausada";
  return "rascunho";
}

function formatBRL(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatInt(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

function formatarData(data: Date): string {
  return data.toLocaleDateString("pt-BR");
}
