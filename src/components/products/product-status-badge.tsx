import type { ProductStatus } from "@/types/product";
import { Badge } from "@/components/ui/badge";

const STATUS: Record<
  ProductStatus,
  { label: string; variant: "secondary" | "accent" | "outline" }
> = {
  ativo: { label: "Ativo", variant: "secondary" },
  inativo: { label: "Inativo", variant: "outline" },
  arquivado: { label: "Arquivado", variant: "outline" },
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const config = STATUS[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
