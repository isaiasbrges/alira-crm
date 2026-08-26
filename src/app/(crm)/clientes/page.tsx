import type { Metadata } from "next";

import { CustomersView } from "@/components/customers/customers-view";

export const metadata: Metadata = {
  title: "Clientes · Alira CRM",
};

export default function ClientesPage() {
  return <CustomersView />;
}
