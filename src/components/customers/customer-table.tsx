import { CheckCircle2, MessageCircle, MoreHorizontal, Pencil, XCircle } from "lucide-react";

import { formatCurrency, formatDate, initials } from "@/lib/format";
import type { Customer } from "@/types/customer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CustomerStatusBadge } from "@/components/customers/customer-status-badge";

const TAGS_VISIVEIS = 2;

function CustomerTags({ tags }: { tags: Customer["tags"] }) {
  if (tags.length === 0) return <span className="text-muted-foreground">—</span>;

  const visiveis = tags.slice(0, TAGS_VISIVEIS);
  const restantes = tags.slice(TAGS_VISIVEIS);

  return (
    <div className="flex items-center gap-1">
      {visiveis.map((tag) => (
        <Badge key={tag.id} variant="outline">
          {tag.label}
        </Badge>
      ))}

      {restantes.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary">+{restantes.length}</Badge>
          </TooltipTrigger>
          <TooltipContent>{restantes.map((tag) => tag.label).join(", ")}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export function CustomerTable({ customers }: { customers: Customer[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Cliente</TableHead>
          <TableHead>WhatsApp</TableHead>
          <TableHead>Cidade</TableHead>
          <TableHead>Última compra</TableHead>
          <TableHead className="text-right">Total gasto</TableHead>
          <TableHead className="text-right">Ticket médio</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Vendedor</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="sticky right-0 w-10 bg-popover/80 backdrop-blur-sm" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback>{initials(customer.nome)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate font-medium">{customer.nome}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {customer.email ?? "—"}
                  </div>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-1.5">
                <span className="tabular-nums">{customer.whatsapp}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      {customer.consentimentoWhatsapp ? (
                        <CheckCircle2 className="size-3.5 text-success" />
                      ) : (
                        <XCircle className="size-3.5 text-muted-foreground/50" />
                      )}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {customer.consentimentoWhatsapp
                      ? "Consentimento autorizado"
                      : "Sem consentimento para campanhas"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </TableCell>

            <TableCell className="text-muted-foreground">{customer.cidade}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(customer.ultimaCompra)}
            </TableCell>
            <TableCell className="text-right font-medium tabular-nums">
              {formatCurrency(customer.totalGasto)}
            </TableCell>
            <TableCell className="text-right tabular-nums text-muted-foreground">
              {formatCurrency(customer.ticketMedio)}
            </TableCell>
            <TableCell>
              <CustomerStatusBadge status={customer.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">{customer.vendedorNome}</TableCell>

            <TableCell>
              <CustomerTags tags={customer.tags} />
            </TableCell>

            <TableCell className="sticky right-0 bg-popover/80 backdrop-blur-sm">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Ações para ${customer.nome}`}
                    className="size-8"
                  >
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Pencil />
                    Editar cliente
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={!customer.consentimentoWhatsapp}>
                    <MessageCircle />
                    Enviar WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
