import type { UserRole } from "@prisma/client";

import { ROLE_LABEL } from "@/mocks/team";
import { Badge } from "@/components/ui/badge";

const VARIANT: Record<UserRole, "accent" | "secondary" | "outline"> = {
  SUPER_ADMIN: "accent",
  OWNER: "accent",
  MANAGER: "secondary",
  SELLER: "outline",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return <Badge variant={VARIANT[role]}>{ROLE_LABEL[role]}</Badge>;
}
