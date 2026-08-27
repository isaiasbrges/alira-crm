import type { Metadata } from "next";

import { listarSegmentosTela } from "@/repositories/segments";
import { listarClientesTela } from "@/repositories/customers";
import { SegmentsView } from "@/components/segments/segments-view";

export const metadata: Metadata = {
  title: "Segmentos · Alira CRM",
};

export default async function SegmentosPage() {
  const [segmentos, { clientes, vendedores, tags, categorias, cidades }] =
    await Promise.all([listarSegmentosTela(), listarClientesTela()]);

  return (
    <SegmentsView
      segmentos={segmentos}
      clientes={clientes}
      opcoes={{ vendedores, tags, categorias, cidades }}
    />
  );
}
