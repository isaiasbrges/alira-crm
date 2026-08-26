import type { Store, Workspace } from "@/types/navigation";

export const MOCK_ORGANIZATION = {
  id: "org_alira",
  nome: "Ateliê",
};

export const MOCK_STORES: Store[] = [
  { id: "store_principal", nome: "Loja principal", organizationId: MOCK_ORGANIZATION.id },
];

export const MOCK_WORKSPACE: Workspace = {
  organization: MOCK_ORGANIZATION,
  store: MOCK_STORES[0],
};

export const MOCK_CURRENT_USER = {
  id: "user_isaias",
  nome: "Isaias",
  funcao: "Administrador",
  email: "isaias@atelie.com.br",
  iniciais: "IB",
};
