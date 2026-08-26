export type CustomerStatus = "ativo" | "inativo" | "vip";

export type CustomerTag = {
  id: string;
  label: string;
};

export type CustomerSizes = {
  camiseta?: string;
  calca?: string;
  calcado?: string;
};

export type CustomerPreferences = {
  estilo?: string;
  cores: string[];
  marcas: string[];
  categorias: string[];
};

export type Customer = {
  id: string;
  nome: string;
  whatsapp: string;
  email?: string;
  nascimento?: string;
  cidade: string;
  estado: string;

  tamanhos: CustomerSizes;
  preferencias: CustomerPreferences;

  vendedorId: string;
  vendedorNome: string;

  tags: CustomerTag[];
  status: CustomerStatus;

  /** Consentimento para receber campanhas de marketing via WhatsApp (LGPD). */
  consentimentoWhatsapp: boolean;

  ultimaCompra?: string;
  totalGasto: number;
  ticketMedio: number;
  /** Compras por ano, usada para segmentação de recompra. */
  frequenciaCompra: number;
};

export type CustomerFilters = {
  busca: string;
  status: CustomerStatus | "todos";
  categoria: string;
  tamanho: string;
  vendedor: string;
  ultimaCompra: string;
  cidade: string;
  tag: string;
};

export const CUSTOMER_FILTERS_DEFAULT: CustomerFilters = {
  busca: "",
  status: "todos",
  categoria: "todas",
  tamanho: "todos",
  vendedor: "todos",
  ultimaCompra: "qualquer",
  cidade: "todas",
  tag: "todas",
};
