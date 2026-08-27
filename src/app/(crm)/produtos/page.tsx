import type { Metadata } from "next";

import { ProductsView } from "@/components/products/products-view";

export const metadata: Metadata = {
  title: "Produtos · Alira CRM",
};

export default function ProdutosPage() {
  return <ProductsView />;
}
