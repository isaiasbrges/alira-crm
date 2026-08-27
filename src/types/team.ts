import type { UserRole } from "@prisma/client";

export type TeamMember = {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  ativo: boolean;
};

export const ROLE_LABEL: Record<UserRole, string> = {
  SUPER_ADMIN: "Equipe Alira",
  OWNER: "Proprietário",
  MANAGER: "Gerente",
  SELLER: "Vendedor",
};
