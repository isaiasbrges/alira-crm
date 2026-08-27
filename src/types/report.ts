export type MonthlyRevenuePoint = {
  mes: string;
  receita: number;
  receitaCampanhas: number;
};

export type CategorySlice = {
  categoria: string;
  clientes: number;
};

export type SellerPerformance = {
  vendedorId: string;
  nome: string;
  vendas: number;
  receita: number;
  ticketMedio: number;
};
