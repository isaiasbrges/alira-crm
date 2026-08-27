import type { Metadata } from "next";

import { listarProdutosTela } from "@/repositories/products";
import { ProductsView } from "@/components/products/products-view";

export const metadata: Metadata = {
  title: "Produtos · Alira CRM",
};

export default async function ProdutosPage() {
  const { produtos, categorias } = await listarProdutosTela();

  return <ProductsView produtos={produtos} categorias={categorias} />;
}
