import { Lock } from "lucide-react";

import type { Workspace } from "@/types/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PdvPasswordForm } from "@/components/settings/pdv-password-form";
import { StoreColorForm } from "@/components/settings/store-color-form";
import { StoreLoginLinkButton } from "@/components/settings/store-login-link-button";
import { StoreLogoForm } from "@/components/settings/store-logo-form";

type PdvConfig = {
  storeId: string;
  temSenha: boolean;
  podeGerenciar: boolean;
};

export function GeneralSettings({
  workspace,
  pdv,
}: {
  workspace: Workspace;
  pdv: PdvConfig;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold">Organização</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Dados da empresa dentro do Alira CRM.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="org-nome">Nome</Label>
            <Input
              id="org-nome"
              defaultValue={workspace.organization.nome}
              disabled
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="org-loja">Loja ativa</Label>
            <Input id="org-loja" defaultValue={workspace.store.nome} disabled />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold">Logo da loja ativa</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Aparece no seletor de loja, na sidebar.
        </p>

        <div className="mt-4">
          <StoreLogoForm
            storeNome={workspace.store.nome}
            logoUrl={workspace.store.logoUrl}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold">Cor de destaque</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Cor da marca de {workspace.store.nome}: botões, links e o item
          ativo da sidebar.
        </p>

        <div className="mt-4">
          <StoreColorForm
            storeId={workspace.store.id}
            cor={workspace.store.corDestaque}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold">
          <Lock className="size-3.5" />
          Senha do PDV — {workspace.store.nome}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Pedida ao abrir o PDV desta loja. Útil em terminal/dispositivo
          compartilhado por mais de um vendedor.
        </p>

        <div className="mt-4">
          {pdv.podeGerenciar ? (
            <PdvPasswordForm storeId={pdv.storeId} temSenha={pdv.temSenha} />
          ) : (
            <p className="text-xs text-muted-foreground">
              {pdv.temSenha
                ? "O PDV desta loja está protegido por senha."
                : "O PDV desta loja não pede senha."}{" "}
              Só donos e gerentes podem alterar.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold">Lojas</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {workspace.stores.length} loja
          {workspace.stores.length === 1 ? "" : "s"} nesta organização. Cada
          uma tem um link de acesso próprio — abre o login já com a loja
          escolhida, útil pra deixar salvo no terminal dela.
        </p>

        <ul className="mt-4 space-y-2">
          {workspace.stores.map((loja) => (
            <li
              key={loja.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3.5 py-2.5 text-sm"
            >
              <span className="flex items-center gap-2 font-medium">
                {loja.nome}
                {loja.id === workspace.store.id && (
                  <span className="text-xs font-normal text-muted-foreground">
                    Ativa
                  </span>
                )}
              </span>
              <StoreLoginLinkButton storeId={loja.id} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
