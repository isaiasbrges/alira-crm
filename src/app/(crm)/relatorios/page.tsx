import type { Metadata } from "next";

import { MOCK_CATEGORY_BREAKDOWN, MOCK_MONTHLY_REVENUE, MOCK_SELLER_PERFORMANCE } from "@/mocks/reports";
import { MOCK_CAMPAIGNS } from "@/mocks/campaigns";
import { PageHeader } from "@/components/layout/page-header";
import { PeriodPicker } from "@/components/layout/period-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MonthlyRevenueChart } from "@/components/reports/monthly-revenue-chart";
import { CategoryBreakdownChart } from "@/components/reports/category-breakdown-chart";
import { SellerPerformanceTable } from "@/components/reports/seller-performance-table";
import { CampaignTable } from "@/components/campaigns/campaign-table";

export const metadata: Metadata = {
  title: "Relatórios · Alira CRM",
};

export default function RelatoriosPage() {
  const campanhasEnviadas = MOCK_CAMPAIGNS.filter((campanha) => campanha.metrics);

  return (
    <>
      <PageHeader
        titulo="Relatórios"
        descricao="Receita, recompra, categorias e desempenho por vendedor."
      >
        <PeriodPicker />
      </PageHeader>

      <section className="grid gap-4 *:min-w-0 xl:grid-cols-3">
        <Card className="gap-0 xl:col-span-2">
          <CardHeader>
            <CardTitle>Receita por mês</CardTitle>
            <CardDescription>Total da loja e parcela originada por campanhas.</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <MonthlyRevenueChart data={MOCK_MONTHLY_REVENUE} />
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardHeader>
            <CardTitle>Clientes por categoria</CardTitle>
            <CardDescription>Categorias mais compradas na base.</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <CategoryBreakdownChart data={MOCK_CATEGORY_BREAKDOWN} />
          </CardContent>
        </Card>
      </section>

      <section className="mt-4 grid gap-4 *:min-w-0 xl:grid-cols-2">
        <Card className="gap-0 overflow-hidden py-0">
          <CardHeader className="px-6 pb-4 pt-6">
            <CardTitle>Desempenho por vendedor</CardTitle>
            <CardDescription>Ranking completo do período.</CardDescription>
          </CardHeader>
          <SellerPerformanceTable sellers={MOCK_SELLER_PERFORMANCE} />
        </Card>

        <Card className="gap-0 overflow-hidden py-0">
          <CardHeader className="px-6 pb-4 pt-6">
            <CardTitle>Campanhas enviadas</CardTitle>
            <CardDescription>Receita atribuída por disparo.</CardDescription>
          </CardHeader>
          <CampaignTable campaigns={campanhasEnviadas} />
        </Card>
      </section>
    </>
  );
}
