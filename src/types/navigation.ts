import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  children?: NavChild[];
};

export type NavChild = {
  label: string;
  href: string;
};

export type NavSection = {
  id: string;
  label?: string;
  items: NavItem[];
};

export type Store = {
  id: string;
  nome: string;
};

export type Organization = {
  id: string;
  nome: string;
};

/**
 * Organização e loja ativa exibidas na sidebar.
 *
 * Montado no servidor a partir da sessão e entregue por props. O cliente
 * recebe o resultado pronto — nunca decide de qual organização ele faz parte.
 */
export type Workspace = {
  organization: Organization;
  store: Store;
  /** Lojas às quais o usuário tem acesso, para alimentar o seletor. */
  stores: Store[];
};

export type CurrentUser = {
  nome: string;
  funcao: string;
  email: string;
  iniciais: string;
};
