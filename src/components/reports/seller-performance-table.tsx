import { formatCurrency, formatNumber } from "@/lib/format";
import type { SellerPerformance } from "@/types/report";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SellerPerformanceTable({ sellers }: { sellers: SellerPerformance[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vendedor</TableHead>
          <TableHead>Vendas</TableHead>
          <TableHead>Receita</TableHead>
          <TableHead>Ticket médio</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sellers.map((vendedor) => (
          <TableRow key={vendedor.vendedorId}>
            <TableCell className="font-medium">{vendedor.nome}</TableCell>
            <TableCell>{formatNumber(vendedor.vendas)}</TableCell>
            <TableCell className="font-medium">{formatCurrency(vendedor.receita)}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatCurrency(vendedor.ticketMedio)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
