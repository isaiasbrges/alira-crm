import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { formatCurrency, formatDate } from "@/lib/format";
import type { CampaignStatus, CampaignSummary } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";

const STATUS_VARIANT: Record<
  CampaignStatus,
  "default" | "secondary" | "accent" | "outline" | "success"
> = {
  enviada: "success",
  agendada: "accent",
  rascunho: "outline",
  pausada: "secondary",
};

const STATUS_LABEL: Record<CampaignStatus, string> = {
  enviada: "Enviada",
  agendada: "Agendada",
  rascunho: "Rascunho",
  pausada: "Pausada",
};

export function RecentCampaigns({ campaigns }: { campaigns: CampaignSummary[] }) {
  if (campaigns.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhuma campanha criada ainda.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {campaigns.map((campaign) => (
        <li key={campaign.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium">{campaign.nome}</span>
              <Badge variant={STATUS_VARIANT[campaign.status]}>
                {STATUS_LABEL[campaign.status]}
              </Badge>
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {campaign.status === "enviada"
                ? `${campaign.enviadas} enviadas · ${campaign.respostas} respostas`
                : formatDate(campaign.data)}
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-sm font-medium tabular-nums">
              {campaign.receita > 0 ? formatCurrency(campaign.receita) : "—"}
            </div>
            <div className="text-[11px] text-muted-foreground">receita</div>
          </div>
        </li>
      ))}

      <li className="pt-3">
        <Link
          href="/campanhas"
          className="inline-flex items-center gap-1 text-xs font-medium text-foreground transition-opacity hover:opacity-70"
        >
          Ver todas as campanhas
          <ArrowUpRight className="size-3.5" />
        </Link>
      </li>
    </ul>
  );
}
