export type SaleStatus = "concluida" | "cancelada";

export type PaymentMethod = "dinheiro" | "pix" | "debito" | "credito" | "crediario";

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  dinheiro: "Dinheiro",
  pix: "Pix",
  debito: "Débito",
  credito: "Crédito",
  crediario: "Crediário",
};

export type SaleItem = {
  variantId: string;
  produtoNome: string;
  tamanho: string;
  cor: string;
  quantidade: number;
  precoUnitario: number;
  total: number;
};

export type Sale = {
  id: string;
  numero: number;
  clienteId?: string;
  clienteNome?: string;
  vendedorId: string;
  vendedorNome: string;
  itens: SaleItem[];
  subtotal: number;
  desconto: number;
  total: number;
  formaPagamento: PaymentMethod;
  status: SaleStatus;
  observacao?: string;
  concluidaEm: string;
};

export type SaleFilters = {
  busca: string;
  vendedor: string;
  formaPagamento: PaymentMethod | "todas";
  status: SaleStatus | "todos";
};

export const SALE_FILTERS_DEFAULT: SaleFilters = {
  busca: "",
  vendedor: "todos",
  formaPagamento: "todas",
  status: "todos",
};
