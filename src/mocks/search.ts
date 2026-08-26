export type SearchResultKind = "cliente" | "produto" | "venda" | "campanha";

export type SearchResult = {
  id: string;
  kind: SearchResultKind;
  titulo: string;
  descricao: string;
  href: string;
};

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: "cus_001",
    kind: "cliente",
    titulo: "Juliana Martins",
    descricao: "VIP · (11) 98812-4477 · São Paulo",
    href: "/clientes",
  },
  {
    id: "cus_004",
    kind: "cliente",
    titulo: "Patrícia Duarte",
    descricao: "VIP · (16) 99781-2233 · Ribeirão Preto",
    href: "/clientes",
  },
  {
    id: "prd_001",
    kind: "produto",
    titulo: "Vestido Midi Alira",
    descricao: "SKU VM-001 · Vestidos · 6 variantes",
    href: "/produtos",
  },
  {
    id: "prd_002",
    kind: "produto",
    titulo: "Blazer Alfaiataria",
    descricao: "SKU BA-014 · Alfaiataria · 8 variantes",
    href: "/produtos",
  },
  {
    id: "sal_1042",
    kind: "venda",
    titulo: "Pedido #1042",
    descricao: "Juliana Martins · R$ 1.240,00 · 21/08/2026",
    href: "/vendas",
  },
  {
    id: "cmp_001",
    kind: "campanha",
    titulo: "Pré-lançamento coleção primavera",
    descricao: "Enviada · 312 destinatários",
    href: "/campanhas",
  },
];

export const SEARCH_GROUP_LABELS: Record<SearchResultKind, string> = {
  cliente: "Clientes",
  produto: "Produtos",
  venda: "Vendas",
  campanha: "Campanhas",
};
