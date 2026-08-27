import type { Metadata } from "next";
import Link from "next/link";

import {
  MOCK_ATTENTION_CUSTOMERS,
  MOCK_HERO_KPIS,
  MOCK_PERFORMANCE_SERIES,
  MOCK_RECENT_CAMPAIGNS,
  MOCK_STAT_TILES,
  MOCK_TODAY_TASKS,
  MOCK_TOP_SELLERS,
} from "@/mocks/dashboard";
import { carregarWorkspace } from "@/lib/tenant/workspace";
import { PageHeader } from "@/components/layout/page-header";
import { PeriodPicker } from "@/components/layout/period-picker";
import { AttentionCustomers } from "@/components/dashboard/attention-customers";
import { HeroKpiCard } from "@/components/dashboard/hero-kpi-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { RecentCampaigns } from "@/components/dashboard/recent-campaigns";
import { StatTiles } from "@/components/dashboard/stat-tiles";
import { TodayTasks } from "@/components/dashboard/today-tasks";
import { TopSellers } from "@/components/dashboard/top-sellers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard · Alira CRM",
};

/** Saudação pelo horário do servidor; vira horário da loja quando houver fuso. */
function saudacao(): string {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

function CardLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium text-primary hover:underline">
      {children}
    </Link>
  );
}

export default async function DashboardPage() {
  const { user } = await carregarWorkspace();
  const primeiroNome = user.nome.split(" ")[0];

  return (
    <>
      <PageHeader
        titulo={
          <>
            {saudacao()}, {primeiroNome}! <span aria-hidden>👋</span>
          </>
        }
        descricao="Aqui está o resumo da sua loja hoje."
      >
        <PeriodPicker />
      </PageHeader>

      <section
        aria-label="Indicadores principais"
        className="grid gap-4 *:min-w-0 lg:grid-cols-2"
      >
        {MOCK_HERO_KPIS.map((kpi) => (
          <HeroKpiCard key={kpi.id} kpi={kpi} />
        ))}
      </section>

      <section className="mt-4 grid gap-4 *:min-w-0 xl:grid-cols-3">
        <Card className="gap-0 xl:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base">
                Receita e recompra ao longo do tempo
              </CardTitle>
              <span className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground">
                Diário
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-0.5 w-4 rounded-full bg-chart-1" />
                Receita (R$)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-4 border-t-2 border-dashed border-chart-2" />
                Taxa de recompra (%)
              </span>
            </div>
          </CardHeader>

          <CardContent className="pb-6">
            <PerformanceChart data={MOCK_PERFORMANCE_SERIES} />
          </CardContent>
        </Card>

        <Card className="gap-0 p-0">
          <CardHeader className="px-6 pb-4 pt-6">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Clientes que merecem atenção</CardTitle>
              <CardLink href="/clientes">Ver todos</CardLink>
            </div>
          </CardHeader>

          <AttentionCustomers customers={MOCK_ATTENTION_CUSTOMERS} />
        </Card>
      </section>

      <section aria-label="Indicadores da base" className="mt-4">
        <StatTiles tiles={MOCK_STAT_TILES} />
      </section>

      <section className="mt-4 grid gap-4 *:min-w-0 xl:grid-cols-3">
        <Card className="gap-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Campanhas recentes</CardTitle>
              <CardLink href="/campanhas">Ver todas</CardLink>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <RecentCampaigns campaigns={MOCK_RECENT_CAMPAIGNS} />
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Tarefas de hoje</CardTitle>
              <CardLink href="/tarefas">Ver todas</CardLink>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <TodayTasks tasks={MOCK_TODAY_TASKS} />
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Top vendedores</CardTitle>
              <CardLink href="/relatorios">Ver ranking</CardLink>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <TopSellers sellers={MOCK_TOP_SELLERS} />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
