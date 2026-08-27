import type { Metadata } from "next";

import { listarClientesTela } from "@/repositories/customers";
import { CustomersView } from "@/components/customers/customers-view";

export const metadata: Metadata = {
  title: "Clientes · Alira CRM",
};

export default async function ClientesPage() {
  const { clientes, vendedores, tags, cidades, categorias } =
    await listarClientesTela();

  return (
    <CustomersView
      clientes={clientes}
      options={{ vendedores, tags, cidades, categorias }}
    />
  );
}
