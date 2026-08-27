import type { SaleStatus } from "@/types/sale";
import { Badge } from "@/components/ui/badge";

const STATUS: Record<SaleStatus, { label: string; variant: "success" | "destructive" }> = {
  concluida: { label: "Concluída", variant: "success" },
  cancelada: { label: "Cancelada", variant: "destructive" },
};

export function SaleStatusBadge({ status }: { status: SaleStatus }) {
  const config = STATUS[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
