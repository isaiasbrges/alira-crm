import type { CategorySlice, MonthlyRevenuePoint, SellerPerformance } from "@/types/report";

export const MOCK_MONTHLY_REVENUE: MonthlyRevenuePoint[] = [
  { mes: "Mar", receita: 142000, receitaCampanhas: 18400 },
  { mes: "Abr", receita: 158000, receitaCampanhas: 21600 },
  { mes: "Mai", receita: 149000, receitaCampanhas: 19800 },
  { mes: "Jun", receita: 173000, receitaCampanhas: 28200 },
  { mes: "Jul", receita: 186000, receitaCampanhas: 34100 },
  { mes: "Ago", receita: 204000, receitaCampanhas: 48320 },
];

export const MOCK_CATEGORY_BREAKDOWN: CategorySlice[] = [
  { categoria: "Vestidos", clientes: 312 },
  { categoria: "Alfaiataria", clientes: 268 },
  { categoria: "Malhas", clientes: 194 },
  { categoria: "Jeans", clientes: 176 },
  { categoria: "Festa", clientes: 98 },
];

export const MOCK_SELLER_PERFORMANCE: SellerPerformance[] = [
  { vendedorId: "sel_maria", nome: "Maria Eduarda", vendas: 94, receita: 32450, ticketMedio: 345 },
  { vendedorId: "sel_isaias", nome: "Isaias Nascimento", vendas: 81, receita: 28760, ticketMedio: 355 },
  { vendedorId: "sel_ana", nome: "Ana Ribeiro", vendas: 72, receita: 24980, ticketMedio: 347 },
  { vendedorId: "sel_carla", nome: "Carla Souza", vendas: 65, receita: 21990, ticketMedio: 338 },
  { vendedorId: "sel_marina", nome: "Marina Lopes", vendas: 58, receita: 19340, ticketMedio: 333 },
];
