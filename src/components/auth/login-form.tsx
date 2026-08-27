"use client";

import * as React from "react";
import { useActionState } from "react";
import { AlertCircle, Store } from "lucide-react";

import { loginAction, type LoginState } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ESTADO_INICIAL: LoginState = {};

type LoginFormProps = {
  /** Preenchidos quando se entra por /login/[storeId] — pré-seleciona a loja. */
  storeId?: string;
  storeNome?: string;
};

export function LoginForm({ storeId, storeNome }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, ESTADO_INICIAL);

  return (
    <form action={formAction} className="space-y-4">
      {storeId && storeNome && (
        <>
          <input type="hidden" name="storeId" value={storeId} />
          <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-3.5 py-2.5 text-sm">
            <Store className="size-4 shrink-0 text-muted-foreground" />
            Entrando em <span className="font-medium">{storeNome}</span>
          </div>
        </>
      )}

      {state.erro && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {state.erro}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@empresa.com.br"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="senha">Senha</Label>
        <Input id="senha" name="senha" type="password" autoComplete="current-password" required />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
