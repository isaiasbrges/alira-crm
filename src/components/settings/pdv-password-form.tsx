"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Lock, LockOpen } from "lucide-react";

import {
  definirSenhaPdvAction,
  type DefinirSenhaPdvState,
} from "@/app/(crm)/configuracoes/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ESTADO_INICIAL: DefinirSenhaPdvState = {};

export function PdvPasswordForm({
  storeId,
  temSenha,
}: {
  storeId: string;
  temSenha: boolean;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    definirSenhaPdvAction,
    ESTADO_INICIAL,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.sucesso) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state.sucesso, router]);

  return (
    <form ref={formRef} action={formAction} className="mt-4 space-y-3">
      <input type="hidden" name="storeId" value={storeId} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="pdv-nova-senha">
            {temSenha ? "Nova senha" : "Senha"}
          </Label>
          <Input id="pdv-nova-senha" name="senha" type="password" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pdv-confirmar-senha">Confirmar</Label>
          <Input id="pdv-confirmar-senha" name="confirmacao" type="password" />
        </div>
      </div>

      {state.erro && (
        <div className="flex items-center gap-2 text-xs text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          {state.erro}
        </div>
      )}
      {state.sucesso && (
        <p className="text-xs text-emerald-600">Salvo.</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" name="intent" value="salvar" size="sm" disabled={pending}>
          {pending ? "Salvando..." : temSenha ? "Trocar senha" : "Definir senha"}
        </Button>
        {temSenha && (
          <Button
            type="submit"
            name="intent"
            value="remover"
            size="sm"
            variant="outline"
            disabled={pending}
          >
            Remover senha
          </Button>
        )}
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {temSenha ? (
            <>
              <Lock className="size-3.5" /> PDV protegido por senha
            </>
          ) : (
            <>
              <LockOpen className="size-3.5" /> PDV abre sem pedir senha
            </>
          )}
        </span>
      </div>
    </form>
  );
}
