import {
  BarChart3,
  Box,
  ClipboardCheck,
  Headset,
  LayoutDashboard,
  Megaphone,
  Settings,
  Share2,
  ShoppingBag,
  Target,
  Users,
} from "lucide-react";

import type { NavSection } from "@/types/navigation";

/**
 * Navegação principal — lista única, na ordem da referência de design.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    id: "principal",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Clientes", href: "/clientes", icon: Users },
      { label: "Vendas", href: "/vendas", icon: ShoppingBag },
      { label: "Atendimentos", href: "/atendimentos", icon: Headset },
      { label: "Tarefas", href: "/tarefas", icon: ClipboardCheck },
      { label: "Campanhas", href: "/campanhas", icon: Megaphone },
      { label: "Produtos", href: "/produtos", icon: Box },
      { label: "Segmentos", href: "/segmentos", icon: Share2 },
      { label: "Relatórios", href: "/relatorios", icon: BarChart3 },
      { label: "Metas", href: "/metas", icon: Target },
      { label: "Configurações", href: "/configuracoes", icon: Settings },
    ],
  },
];

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  clientes: "Clientes",
  vendas: "Vendas",
  atendimentos: "Atendimentos",
  tarefas: "Tarefas",
  campanhas: "Campanhas",
  produtos: "Produtos",
  segmentos: "Segmentos",
  relatorios: "Relatórios",
  metas: "Metas",
  configuracoes: "Configurações",
};

export function labelForSegment(segment: string): string {
  return ROUTE_LABELS[segment] ?? segment;
}

/**
 * Um item está ativo quando a rota atual é ele próprio ou um filho seu,
 * evitando que `/clientes` acenda em `/clientes-vip`.
 */
export function isRouteActive(pathname: string, href: string): boolean {
  const target = href.split("?")[0];
  if (target === "/") return pathname === "/";
  return pathname === target || pathname.startsWith(`${target}/`);
}
