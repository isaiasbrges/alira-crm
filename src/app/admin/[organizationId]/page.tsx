import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { buscarOrganizacaoComoAdmin } from "@/repositories/organizations";
import { OrganizationSettingsForm } from "@/components/admin/organization-settings-form";
import { StoreAccessToggle } from "@/components/admin/store-access-toggle";

export const metadata: Metadata = {
  title: "Organização · Painel master",
};

export default async function AdminOrganizacaoPage({
  params,
}: PageProps<"/admin/[organizationId]">) {
  const { organizationId } = await params;

  const organizacao = await buscarOrganizacaoComoAdmin(organizationId).catch(
    () => null,
  );
  if (!organizacao) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Organizações
        </Link>
        <h1 className="mt-2 text-lg font-semibold">{organizacao.nome}</h1>
        <p className="text-sm text-muted-foreground">
          {organizacao.slug} · {organizacao._count.users} usuário
          {organizacao._count.users === 1 ? "" : "s"} · {organizacao._count.customers}{" "}
          cliente{organizacao._count.customers === 1 ? "" : "s"}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold">Configurações</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Suspender ou cancelar bloqueia login de todos os usuários desta
          organização na próxima verificação de sessão.
        </p>
        <div className="mt-4">
          <OrganizationSettingsForm
            organizationId={organizacao.id}
            status={organizacao.status}
            plano={organizacao.plano}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold">Acesso às lojas</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Uma loja desativada some do seletor de todos os usuários da
          organização — ninguém consegue abri-la até reativar aqui.
        </p>

        <ul className="mt-4 divide-y divide-border">
          {organizacao.stores.map((loja) => (
            <li
              key={loja.id}
              className="flex items-center justify-between gap-4 py-3.5"
            >
              <span className="text-sm font-medium">{loja.nome}</span>
              <StoreAccessToggle storeId={loja.id} ativa={loja.ativa} />
            </li>
          ))}
          {organizacao.stores.length === 0 && (
            <li className="py-3.5 text-sm text-muted-foreground">
              Nenhuma loja cadastrada nesta organização ainda.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
