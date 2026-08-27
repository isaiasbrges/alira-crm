import type { Sale, SaleFilters } from "@/types/sale";

export type SaleKpis = {
  total: number;
  receita: number;
  ticketMedio: number;
  canceladas: number;
};

export function buildSaleKpis(sales: Sale[]): SaleKpis {
  const concluidas = sales.filter((venda) => venda.status === "concluida");
  const receita = concluidas.reduce((soma, venda) => soma + venda.total, 0);

  return {
    total: sales.length,
    receita,
    ticketMedio: concluidas.length > 0 ? receita / concluidas.length : 0,
    canceladas: sales.filter((venda) => venda.status === "cancelada").length,
  };
}

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function filterSales(sales: Sale[], filters: SaleFilters): Sale[] {
  const busca = normalizar(filters.busca.trim());

  return sales.filter((venda) => {
    if (busca) {
      const alvo = normalizar(`${venda.numero} ${venda.clienteNome ?? ""} ${venda.vendedorNome}`);
      if (!alvo.includes(busca)) return false;
    }

    if (filters.vendedor !== "todos" && venda.vendedorId !== filters.vendedor) return false;
    if (filters.formaPagamento !== "todas" && venda.formaPagamento !== filters.formaPagamento) {
      return false;
    }
    if (filters.status !== "todos" && venda.status !== filters.status) return false;

    return true;
  });
}
