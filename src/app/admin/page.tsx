import type { Metadata } from "next";
import Link from "next/link";

import { listarOrganizacoesComoAdmin } from "@/repositories/organizations";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Organizações · Painel master",
};

const STATUS_VARIANT = {
  ATIVA: "success",
  SUSPENSA: "amber",
  CANCELADA: "destructive",
} as const;

const STATUS_LABEL = {
  ATIVA: "Ativa",
  SUSPENSA: "Suspensa",
  CANCELADA: "Cancelada",
} as const;

export default async function AdminOrganizacoesPage() {
  const organizacoes = await listarOrganizacoesComoAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Organizações</h1>
        <p className="text-sm text-muted-foreground">
          {organizacoes.length} empresa{organizacoes.length === 1 ? "" : "s"}{" "}
          cliente{organizacoes.length === 1 ? "" : "s"} do Alira CRM.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Lojas</TableHead>
              <TableHead>Usuários</TableHead>
              <TableHead>Clientes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizacoes.map((organizacao) => (
              <TableRow key={organizacao.id}>
                <TableCell>
                  <Link
                    href={`/admin/${organizacao.id}`}
                    className="font-medium hover:underline"
                  >
                    {organizacao.nome}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {organizacao.slug}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[organizacao.status]}>
                    {STATUS_LABEL[organizacao.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {organizacao.plano ?? "—"}
                </TableCell>
                <TableCell>{organizacao._count.stores}</TableCell>
                <TableCell>{organizacao._count.users}</TableCell>
                <TableCell>{organizacao._count.customers}</TableCell>
              </TableRow>
            ))}
            {organizacoes.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Nenhuma organização cliente ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
