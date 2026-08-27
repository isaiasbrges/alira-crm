import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { CampaignSummary } from "@/types/dashboard";

const STATUS_CLASSES: Record<CampaignSummary["status"], string> = {
  enviada: "text-muted-foreground",
  agendada: "text-primary",
  rascunho: "text-muted-foreground",
  pausada: "text-warning",
};

/** Métrica ainda sem valor aparece como travessão, não como zero. */
function Metrica({ rotulo, valor }: { rotulo: string; valor?: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] text-muted-foreground">{rotulo}</div>
      <div className="truncate text-sm font-semibold">{valor ?? "—"}</div>
    </div>
  );
}

export function RecentCampaigns({ campaigns }: { campaigns: CampaignSummary[] }) {
  if (campaigns.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma campanha no período.</p>;
  }

  return (
    <ul className="space-y-5">
      {campaigns.map((campanha) => (
        <li key={campanha.id}>
          <div className="flex items-start gap-3">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              <ImageIcon className="size-5" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{campanha.nome}</div>
              <div
                className={cn(
                  "mt-0.5 truncate text-xs",
                  STATUS_CLASSES[campanha.status],
                  campanha.status === "agendada" &&
                    "inline-block rounded-md bg-accent px-1.5 py-0.5"
                )}
              >
                {campanha.dataLabel}
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <Metrica
              rotulo="Abertura"
              valor={campanha.abertura ? formatPercent(campanha.abertura, 0) : undefined}
            />
            <Metrica
              rotulo="Conversão"
              valor={campanha.conversao ? formatPercent(campanha.conversao) : undefined}
            />
            <Metrica
              rotulo="Receita"
              valor={campanha.receita ? formatCurrency(campanha.receita, true) : undefined}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
