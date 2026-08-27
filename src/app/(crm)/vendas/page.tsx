import type { Metadata } from "next";

import { SalesView } from "@/components/sales/sales-view";

export const metadata: Metadata = {
  title: "Vendas · Alira CRM",
};

export default function VendasPage() {
  return <SalesView />;
}
