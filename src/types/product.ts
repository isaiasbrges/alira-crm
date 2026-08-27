export type ProductStatus = "ativo" | "inativo" | "arquivado";

export type ProductVariant = {
  id: string;
  tamanho: string;
  cor: string;
  sku: string;
  estoque: number;
};

export type Product = {
  id: string;
  nome: string;
  sku: string;
  categoria: string;
  colecao?: string;
  preco: number;
  status: ProductStatus;
  imagemCor?: string;
  variantes: ProductVariant[];
};

export type ProductFilters = {
  busca: string;
  categoria: string;
  status: ProductStatus | "todos";
  estoque: "todos" | "baixo" | "esgotado";
};

export const PRODUCT_FILTERS_DEFAULT: ProductFilters = {
  busca: "",
  categoria: "todas",
  status: "todos",
  estoque: "todos",
};

export function estoqueTotal(produto: Product): number {
  return produto.variantes.reduce((soma, variante) => soma + variante.estoque, 0);
}

/** Abaixo disso o estoque acende como baixo na listagem e no PDV. */
export const ESTOQUE_BAIXO_LIMITE = 5;
