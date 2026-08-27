"use client";

import * as React from "react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Store as StoreIcon } from "lucide-react";

import {
  atualizarLogoLojaAction,
  type AtualizarLogoState,
} from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ESTADO_INICIAL: AtualizarLogoState = {};

export function StoreLogoForm({
  storeNome,
  logoUrl,
}: {
  storeNome: string;
  logoUrl: string | null;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    atualizarLogoLojaAction,
    ESTADO_INICIAL,
  );
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const enviadoRef = useRef(false);

  useEffect(() => {
    if (pending) enviadoRef.current = true;
    if (!pending && enviadoRef.current && !state.erro) {
      enviadoRef.current = false;
      router.refresh();
    }
  }, [pending, state.erro, router]);

  function aoEscolherArquivo(event: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];
    setPreview(arquivo ? URL.createObjectURL(arquivo) : null);
  }

  const imagemExibida = preview ?? logoUrl;

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-14 rounded-xl border border-border">
        {imagemExibida && <AvatarImage src={imagemExibida} alt={storeNome} />}
        <AvatarFallback className="rounded-xl">
          <StoreIcon className="size-6 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      <form action={formAction} className="flex flex-1 flex-col gap-2">
        {state.erro && (
          <div className="flex items-center gap-2 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            {state.erro}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            name="logo"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={aoEscolherArquivo}
            className="text-xs text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-card file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground hover:file:bg-secondary"
          />
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Salvando..." : "Salvar logo"}
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          PNG, JPG, WEBP ou SVG · até 1,5 MB.
        </p>
      </form>
    </div>
  );
}
