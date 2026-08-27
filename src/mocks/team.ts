import type { UserRole } from "@prisma/client";

export type TeamMember = {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  ativo: boolean;
};

export const MOCK_TEAM: TeamMember[] = [
  { id: "usr_dev_owner", nome: "Isaias", email: "isaias@aliracrm.com.br", role: "OWNER", ativo: true },
  { id: "usr_ana", nome: "Ana Ribeiro", email: "ana.ribeiro@aliracrm.com.br", role: "MANAGER", ativo: true },
  { id: "usr_carla", nome: "Carla Souza", email: "carla.souza@aliracrm.com.br", role: "SELLER", ativo: true },
  { id: "usr_marina", nome: "Marina Lopes", email: "marina.lopes@aliracrm.com.br", role: "SELLER", ativo: true },
  { id: "usr_pedro", nome: "Pedro Alencar", email: "pedro.alencar@aliracrm.com.br", role: "SELLER", ativo: false },
];

export const ROLE_LABEL: Record<UserRole, string> = {
  SUPER_ADMIN: "Equipe Alira",
  OWNER: "Proprietário",
  MANAGER: "Gerente",
  SELLER: "Vendedor",
};
