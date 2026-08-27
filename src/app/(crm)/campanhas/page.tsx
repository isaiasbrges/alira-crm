import type { Metadata } from "next";

import { listarCampanhasTela } from "@/repositories/campaigns";
import { listarSegmentosTela } from "@/repositories/segments";
import { listarClientesTela } from "@/repositories/customers";
import { CampaignsView } from "@/components/campaigns/campaigns-view";

export const metadata: Metadata = {
  title: "Campanhas · Alira CRM",
};

export default async function CampanhasPage() {
  const [campanhas, segmentos, { clientes }] = await Promise.all([
    listarCampanhasTela(),
    listarSegmentosTela(),
    listarClientesTela(),
  ]);

  return (
    <CampaignsView
      campanhas={campanhas}
      segmentos={segmentos}
      clientes={clientes}
    />
  );
}
