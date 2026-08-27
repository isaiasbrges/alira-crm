"use client";

import * as React from "react";
import { Megaphone, Search } from "lucide-react";

import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { Campaign, CampaignFilters } from "@/types/campaign";
import {
  CAMPAIGN_FILTERS_DEFAULT,
  CAMPAIGN_STATUS_LABEL,
} from "@/types/campaign";
import type { Customer } from "@/types/customer";
import type { Segment } from "@/types/segment";
import {
  buildCampaignKpis,
  filterCampaigns,
} from "@/services/campaign-metrics";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { CampaignTable } from "@/components/campaigns/campaign-table";
import { NewCampaignDialog } from "@/components/campaigns/new-campaign-dialog";

type CampaignsViewProps = {
  campanhas: Campaign[];
  segmentos: Segment[];
  clientes: Customer[];
};

export function CampaignsView({
  campanhas,
  segmentos,
  clientes,
}: CampaignsViewProps) {
  const [filters, setFilters] = React.useState<CampaignFilters>(
    CAMPAIGN_FILTERS_DEFAULT,
  );

  const kpis = React.useMemo(() => buildCampaignKpis(campanhas), [campanhas]);
  const visiveis = React.useMemo(
    () => filterCampaigns(campanhas, filters),
    [campanhas, filters],
  );

  function updateFilter<K extends keyof CampaignFilters>(
    key: K,
    value: CampaignFilters[K],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <>
      <PageHeader
        titulo="Campanhas"
        descricao="Disparos de WhatsApp por segmento."
      >
        <NewCampaignDialog segmentos={segmentos} clientes={clientes} />
      </PageHeader>

      <section
        aria-label="Indicadores de campanhas"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <SummaryCard
          label="Total de campanhas"
          value={formatNumber(kpis.total)}
        />
        <SummaryCard label="Enviadas" value={formatNumber(kpis.enviadas)} />
        <SummaryCard
          label="Receita atribuída"
          value={formatCurrency(kpis.receita)}
        />
        <SummaryCard
          label="Abertura média"
          value={formatPercent(kpis.taxaAberturaMedia, 0)}
        />
      </section>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.busca}
            onChange={(event) => updateFilter("busca", event.target.value)}
            placeholder="Buscar campanha"
            aria-label="Buscar campanhas"
            className="pl-9"
          />
        </div>

        <div className="min-w-40">
          <Label className="mb-1.5 text-xs text-muted-foreground">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) =>
              updateFilter("status", value as CampaignFilters["status"])
            }
          >
            <SelectTrigger size="sm" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {Object.entries(CAMPAIGN_STATUS_LABEL).map(([valor, rotulo]) => (
                <SelectItem key={valor} value={valor}>
                  {rotulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="mt-4 gap-0 overflow-hidden py-0">
        {visiveis.length === 0 ? (
          <EmptyState />
        ) : (
          <CampaignTable campaigns={visiveis} />
        )}
      </Card>
    </>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="gap-0 p-4">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="mt-1.5 block text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </span>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-secondary">
        <Megaphone className="size-5 text-muted-foreground" />
      </span>
      <div>
        <p className="text-sm font-medium">Nenhuma campanha encontrada</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajuste os filtros para ampliar a busca.
        </p>
      </div>
    </div>
  );
}
