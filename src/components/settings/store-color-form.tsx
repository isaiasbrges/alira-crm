"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import {
  atualizarCorLojaAction,
  type AtualizarCorState,
} from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ESTADO_INICIAL: AtualizarCorState = {};
const COR_PADRAO = "#2563EB";
const HEX_VALIDO = /^#[0-9A-Fa-f]{6}$/;

export function StoreColorForm({
  storeId,
  cor,
}: {
  storeId: string;
  cor: string | null;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    atualizarCorLojaAction,
    ESTADO_INICIAL,
  );
  const [valor, setValor] = useState(cor ?? COR_PADRAO);
  const enviadoRef = useRef(false);

  useEffect(() => {
    if (pending) enviadoRef.current = true;
    if (!pending && enviadoRef.current && !state.erro) {
      enviadoRef.current = false;
      router.refresh();
    }
  }, [pending, state.erro, router]);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="storeId" value={storeId} />
      <input type="hidden" name="cor" value={valor} />

      {state.erro && (
        <div className="flex items-center gap-2 text-xs text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          {state.erro}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="color"
          value={HEX_VALIDO.test(valor) ? valor : COR_PADRAO}
          onChange={(event) => setValor(event.target.value.toUpperCase())}
          className="h-9 w-11 cursor-pointer rounded-md border border-input bg-card p-1"
          aria-label="Cor de destaque"
        />
        <Input
          value={valor}
          onChange={(event) => setValor(event.target.value.toUpperCase())}
          className="w-28 font-mono text-xs"
          maxLength={7}
        />
        <Button
          type="submit"
          name="intent"
          value="salvar"
          size="sm"
          disabled={pending}
        >
          {pending ? "Salvando..." : "Salvar cor"}
        </Button>
        {cor && (
          <Button
            type="submit"
            name="intent"
            value="remover"
            variant="outline"
            size="sm"
            disabled={pending}
          >
            Restaurar padrão
          </Button>
        )}
      </div>
    </form>
  );
}
