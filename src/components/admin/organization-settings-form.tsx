"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { OrganizationStatus } from "@prisma/client";
import { AlertCircle } from "lucide-react";

import {
  atualizarOrganizacaoAction,
  type AtualizarOrganizacaoState,
} from "@/app/admin/[organizationId]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ESTADO_INICIAL: AtualizarOrganizacaoState = {};

const STATUS_OPCOES: { value: OrganizationStatus; label: string }[] = [
  { value: "ATIVA", label: "Ativa" },
  { value: "SUSPENSA", label: "Suspensa" },
  { value: "CANCELADA", label: "Cancelada" },
];

export function OrganizationSettingsForm({
  organizationId,
  status,
  plano,
}: {
  organizationId: string;
  status: OrganizationStatus;
  plano: string | null;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    atualizarOrganizacaoAction,
    ESTADO_INICIAL,
  );

  useEffect(() => {
    if (state.sucesso) router.refresh();
  }, [state.sucesso, router]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="organizationId" value={organizationId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="admin-org-status">Status</Label>
          <Select name="status" defaultValue={status}>
            <SelectTrigger id="admin-org-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPCOES.map((opcao) => (
                <SelectItem key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="admin-org-plano">Plano</Label>
          <Input
            id="admin-org-plano"
            name="plano"
            defaultValue={plano ?? ""}
            placeholder="Sem plano definido"
          />
        </div>
      </div>

      {state.erro && (
        <div className="flex items-center gap-2 text-xs text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          {state.erro}
        </div>
      )}
      {state.sucesso && <p className="text-xs text-emerald-600">Salvo.</p>}

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
