import type { UserRole } from "@prisma/client";

export type TeamMember = {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  ativo: boolean;
  /** IDs de loja que o usuário pode acessar. Nulo = todas, sem restrição. */
  storeAccessIds: string[] | null;
};

export const ROLE_LABEL: Record<UserRole, string> = {
  SUPER_ADMIN: "Equipe Alira",
  OWNER: "Proprietário",
  MANAGER: "Gerente",
  SELLER: "Vendedor",
};
