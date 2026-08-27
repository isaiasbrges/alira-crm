import type { Workspace } from "@/types/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GeneralSettings({ workspace }: { workspace: Workspace }) {
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
            <Input id="org-nome" defaultValue={workspace.organization.nome} disabled />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="org-loja">Loja ativa</Label>
            <Input id="org-loja" defaultValue={workspace.store.nome} disabled />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold">Lojas</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {workspace.stores.length} loja{workspace.stores.length === 1 ? "" : "s"} nesta
          organização.
        </p>

        <ul className="mt-4 space-y-2">
          {workspace.stores.map((loja) => (
            <li
              key={loja.id}
              className="flex items-center justify-between rounded-lg border border-border px-3.5 py-2.5 text-sm"
            >
              <span className="font-medium">{loja.nome}</span>
              {loja.id === workspace.store.id && (
                <span className="text-xs text-muted-foreground">Ativa</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
