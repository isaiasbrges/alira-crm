import type { Metadata } from "next";

import { listarOpcoesPdv } from "@/repositories/sales";
import { PdvView } from "@/components/sales/pdv/pdv-view";

export const metadata: Metadata = {
  title: "PDV Lite · Alira CRM",
};

export default async function PdvPage() {
  const { produtos, clientes, vendedores } = await listarOpcoesPdv();

  return (
    <PdvView produtos={produtos} clientes={clientes} vendedores={vendedores} />
  );
}
