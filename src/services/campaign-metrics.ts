import type { Campaign, CampaignFilters } from "@/types/campaign";

export type CampaignKpis = {
  total: number;
  enviadas: number;
  receita: number;
  taxaAberturaMedia: number;
};

export function buildCampaignKpis(campaigns: Campaign[]): CampaignKpis {
  const enviadas = campaigns.filter((campanha) => campanha.metrics);
  const receita = enviadas.reduce((soma, campanha) => soma + (campanha.metrics?.receita ?? 0), 0);

  const taxas = enviadas
    .filter((campanha) => campanha.metrics && campanha.metrics.enviadas > 0)
    .map((campanha) => (campanha.metrics!.lidas / campanha.metrics!.enviadas) * 100);

  return {
    total: campaigns.length,
    enviadas: enviadas.length,
    receita,
    taxaAberturaMedia: taxas.length > 0 ? taxas.reduce((a, b) => a + b, 0) / taxas.length : 0,
  };
}

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function filterCampaigns(campaigns: Campaign[], filters: CampaignFilters): Campaign[] {
  const busca = normalizar(filters.busca.trim());

  return campaigns.filter((campanha) => {
    if (busca && !normalizar(campanha.nome).includes(busca)) return false;
    if (filters.status !== "todos" && campanha.status !== filters.status) return false;
    return true;
  });
}
