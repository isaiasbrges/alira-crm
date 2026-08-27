import { formatCurrency, formatDate } from "@/lib/format";
import { PAYMENT_METHOD_LABEL, type Sale } from "@/types/sale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SaleStatusBadge } from "@/components/sales/sale-status-badge";

export function SalesTable({ sales }: { sales: Sale[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pedido</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Vendedor</TableHead>
          <TableHead>Itens</TableHead>
          <TableHead>Pagamento</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((venda) => (
          <TableRow key={venda.id}>
            <TableCell className="font-medium">#{venda.numero}</TableCell>
            <TableCell>{venda.clienteNome ?? "Cliente balcão"}</TableCell>
            <TableCell className="text-muted-foreground">{venda.vendedorNome}</TableCell>
            <TableCell className="text-muted-foreground">
              {venda.itens.reduce((soma, item) => soma + item.quantidade, 0)} peça(s)
            </TableCell>
            <TableCell className="text-muted-foreground">
              {PAYMENT_METHOD_LABEL[venda.formaPagamento]}
            </TableCell>
            <TableCell className="font-medium">{formatCurrency(venda.total)}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(venda.concluidaEm)}
            </TableCell>
            <TableCell>
              <SaleStatusBadge status={venda.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
