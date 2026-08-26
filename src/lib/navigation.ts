import {
  ChartNoAxesCombined,
  ClipboardCheck,
  LayoutDashboard,
  MessageCircle,
  Send,
  Settings,
  ShoppingBag,
  Tags,
  Users,
  UsersRound,
} from "lucide-react";

import type { NavSection } from "@/types/navigation";

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "operacao",
    label: "Operação",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      {
        label: "Clientes",
        href: "/clientes",
        icon: Users,
        children: [
          { label: "Todos os clientes", href: "/clientes" },
          { label: "Aniversariantes", href: "/clientes?filtro=aniversariantes" },
          { label: "Para reativar", href: "/clientes?filtro=reativar" },
        ],
      },
      { label: "Produtos", href: "/produtos", icon: Tags },
      { label: "Vendas", href: "/vendas", icon: ShoppingBag },
    ],
  },
  {
    id: "relacionamento",
    label: "Relacionamento",
    items: [
      { label: "Segmentos", href: "/segmentos", icon: UsersRound },
      { label: "Campanhas", href: "/campanhas", icon: Send },
      { label: "Tarefas", href: "/tarefas", icon: ClipboardCheck },
      { label: "WhatsApp", href: "/whatsapp", icon: MessageCircle },
    ],
  },
  {
    id: "gestao",
    label: "Gestão",
    items: [
      { label: "Relatórios", href: "/relatorios", icon: ChartNoAxesCombined },
      { label: "Configurações", href: "/configuracoes", icon: Settings },
    ],
  },
];

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  clientes: "Clientes",
  produtos: "Produtos",
  vendas: "Vendas",
  segmentos: "Segmentos",
  campanhas: "Campanhas",
  tarefas: "Tarefas",
  whatsapp: "WhatsApp",
  relatorios: "Relatórios",
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
