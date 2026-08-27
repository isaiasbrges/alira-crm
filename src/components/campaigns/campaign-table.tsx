import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/format";
import type { Campaign } from "@/types/campaign";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CampaignStatusBadge } from "@/components/campaigns/campaign-status-badge";

export function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campanha</TableHead>
          <TableHead>Segmento</TableHead>
          <TableHead>Destinatários</TableHead>
          <TableHead>Abertura</TableHead>
          <TableHead>Receita</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campanha) => {
          const abertura =
            campanha.metrics && campanha.metrics.enviadas > 0
              ? (campanha.metrics.lidas / campanha.metrics.enviadas) * 100
              : null;
          const data = campanha.enviadaEm ?? campanha.agendadaPara;

          return (
            <TableRow key={campanha.id}>
              <TableCell>
                <div className="font-medium">{campanha.nome}</div>
                <div className="text-xs text-muted-foreground">{campanha.templateNome}</div>
              </TableCell>
              <TableCell className="text-muted-foreground">{campanha.segmentoNome}</TableCell>
              <TableCell>{formatNumber(campanha.destinatarios)}</TableCell>
              <TableCell className="text-muted-foreground">
                {abertura !== null ? formatPercent(abertura, 0) : "—"}
              </TableCell>
              <TableCell className="font-medium">
                {campanha.metrics ? formatCurrency(campanha.metrics.receita) : "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {data ? formatDate(data) : "—"}
              </TableCell>
              <TableCell>
                <CampaignStatusBadge status={campanha.status} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
