export type CartItem = {
  variantId: string;
  produtoNome: string;
  tamanho: string;
  cor: string;
  precoUnitario: number;
  quantidade: number;
  /** Estoque da variante no momento em que entrou no carrinho, para não deixar pedir além do disponível. */
  estoqueDisponivel: number;
};
