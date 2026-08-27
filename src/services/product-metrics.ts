import type { Product, ProductFilters } from "@/types/product";
import { estoqueTotal, ESTOQUE_BAIXO_LIMITE } from "@/types/product";

export type ProductKpis = {
  total: number;
  ativos: number;
  estoqueBaixo: number;
  esgotados: number;
};

export function buildProductKpis(products: Product[]): ProductKpis {
  return products.reduce<ProductKpis>(
    (acc, produto) => {
      acc.total += 1;
      if (produto.status === "ativo") acc.ativos += 1;

      const total = estoqueTotal(produto);
      if (total === 0) acc.esgotados += 1;
      else if (total <= ESTOQUE_BAIXO_LIMITE) acc.estoqueBaixo += 1;

      return acc;
    },
    { total: 0, ativos: 0, estoqueBaixo: 0, esgotados: 0 }
  );
}

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const busca = normalizar(filters.busca.trim());

  return products.filter((produto) => {
    if (busca) {
      const alvo = normalizar(`${produto.nome} ${produto.sku}`);
      if (!alvo.includes(busca)) return false;
    }

    if (filters.categoria !== "todas" && produto.categoria !== filters.categoria) {
      return false;
    }

    if (filters.status !== "todos" && produto.status !== filters.status) {
      return false;
    }

    const total = estoqueTotal(produto);
    if (filters.estoque === "esgotado" && total !== 0) return false;
    if (filters.estoque === "baixo" && !(total > 0 && total <= ESTOQUE_BAIXO_LIMITE)) {
      return false;
    }

    return true;
  });
}
