import type { CustomerStatus } from "@/types/customer";
import { Badge } from "@/components/ui/badge";

const STATUS: Record<
  CustomerStatus,
  { label: string; variant: "secondary" | "accent" | "outline" }
> = {
  ativo: { label: "Ativo", variant: "secondary" },
  inativo: { label: "Inativo", variant: "outline" },
  vip: { label: "VIP", variant: "accent" },
};

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const config = STATUS[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
