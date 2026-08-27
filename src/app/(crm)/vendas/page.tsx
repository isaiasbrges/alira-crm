import type { Metadata } from "next";

import { listarVendasTela, listarVendedoresTela } from "@/repositories/sales";
import { SalesView } from "@/components/sales/sales-view";

export const metadata: Metadata = {
  title: "Vendas · Alira CRM",
};

export default async function VendasPage() {
  const [vendas, vendedores] = await Promise.all([
    listarVendasTela(),
    listarVendedoresTela(),
  ]);

  return <SalesView vendas={vendas} vendedores={vendedores} />;
}
