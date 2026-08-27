"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import {
  desbloquearPdvAction,
  type DesbloquearPdvState,
} from "@/app/(crm)/vendas/pdv/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ESTADO_INICIAL: DesbloquearPdvState = {};

export function PdvLockScreen({ lojaNome }: { lojaNome: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    desbloquearPdvAction,
    ESTADO_INICIAL,
  );

  useEffect(() => {
    if (state.sucesso) router.refresh();
  }, [state.sucesso, router]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-secondary">
          <Lock className="size-5 text-muted-foreground" />
        </div>
        <h1 className="mt-4 text-sm font-semibold">PDV bloqueado</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Digite a senha do PDV de {lojaNome} para continuar.
        </p>

        <form action={formAction} className="mt-5 space-y-3 text-left">
          <div className="space-y-1.5">
            <Label htmlFor="pdv-senha">Senha</Label>
            <Input
              id="pdv-senha"
              name="senha"
              type="password"
              autoFocus
              required
            />
          </div>
          {state.erro && (
            <p className="text-xs text-destructive">{state.erro}</p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Verificando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
