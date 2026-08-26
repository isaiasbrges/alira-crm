import type { Metadata } from "next";

import {
  MOCK_CATEGORY_SLICES,
  MOCK_KPIS,
  MOCK_REACTIVATION_TARGETS,
  MOCK_RECENT_CAMPAIGNS,
  MOCK_REPURCHASE_SERIES,
  MOCK_REVENUE_SERIES,
  MOCK_TODAY_TASKS,
} from "@/mocks/dashboard";
import { PageHeader } from "@/components/layout/page-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RepurchaseChart } from "@/components/dashboard/repurchase-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentCampaigns } from "@/components/dashboard/recent-campaigns";
import { TodayTasks } from "@/components/dashboard/today-tasks";
import { ReactivationList } from "@/components/dashboard/reactivation-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard · Alira CRM",
};

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        titulo="Dashboard"
        descricao="Visão geral da operação da loja no período selecionado."
      />

      <section aria-label="Indicadores" className="grid grid-cols-2 gap-3 *:min-w-0 lg:grid-cols-3 xl:grid-cols-6">
        {MOCK_KPIS.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </section>

      <section className="mt-6 grid gap-4 *:min-w-0 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Receita por período</CardTitle>
            <CardDescription>Total da loja e parcela originada por campanhas.</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <RevenueChart data={MOCK_REVENUE_SERIES} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recompra por período</CardTitle>
            <CardDescription>Percentual de clientes com mais de uma compra.</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <RepurchaseChart data={MOCK_REPURCHASE_SERIES} />
          </CardContent>
        </Card>
      </section>

      <section className="mt-4 grid gap-4 *:min-w-0 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Clientes por categoria</CardTitle>
            <CardDescription>Categorias mais compradas na base.</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <CategoryChart data={MOCK_CATEGORY_SLICES} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campanhas recentes</CardTitle>
            <CardDescription>Desempenho dos últimos envios.</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <RecentCampaigns campaigns={MOCK_RECENT_CAMPAIGNS} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tarefas de hoje</CardTitle>
            <CardDescription>Agenda dos vendedores.</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <TodayTasks tasks={MOCK_TODAY_TASKS} />
          </CardContent>
        </Card>
      </section>

      <section className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Clientes para reativar</CardTitle>
            <CardDescription>
              Compraram antes, mas estão há mais de 180 dias sem retornar.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <ReactivationList targets={MOCK_REACTIVATION_TARGETS} />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
