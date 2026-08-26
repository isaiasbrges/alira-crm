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
  organizationId: string;
};

export type Organization = {
  id: string;
  nome: string;
};

export type Workspace = {
  organization: Organization;
  store: Store;
};
