import { CAMPAIGN_STATUS_LABEL, type CampaignStatus } from "@/types/campaign";
import { Badge } from "@/components/ui/badge";

const VARIANT: Record<CampaignStatus, "success" | "accent" | "secondary" | "amber" | "outline"> = {
  enviada: "success",
  enviando: "accent",
  agendada: "accent",
  rascunho: "secondary",
  pausada: "amber",
  cancelada: "outline",
};

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  return <Badge variant={VARIANT[status]}>{CAMPAIGN_STATUS_LABEL[status]}</Badge>;
}
