import type { Metadata } from "next";

import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export const metadata: Metadata = {
  title: "Produtos · Alira CRM",
};

export default function ProdutosPage() {
  return (
    <ModulePlaceholder
      titulo="Produtos"
      descricao="Catálogo, categorias, variantes e estoque por tamanho e cor."
      proximosPassos={[
        "Cadastro de produto com SKU, categoria, coleção e preço",
        "Variantes por tamanho e cor, cada uma com estoque próprio",
        "Listagem com busca por nome e SKU",
      ]}
    />
  );
}
