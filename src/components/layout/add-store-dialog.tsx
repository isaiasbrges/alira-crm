"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Copy, Store } from "lucide-react";

import { criarLojaAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AddStoreDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddStoreDialog({ open, onOpenChange }: AddStoreDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [novaLoja, setNovaLoja] = useState<{ id: string; nome: string } | null>(
    null,
  );

  function fechar(novoOpen: boolean) {
    onOpenChange(novoOpen);
    if (!novoOpen) {
      // Sem isso, reabrir "Adicionar loja" cairia direto na tela do link
      // da última loja criada em vez do formulário.
      setErro(null);
      setNovaLoja(null);
    }
  }

  function criar(formData: FormData) {
    setErro(null);
    startTransition(async () => {
      const resultado = await criarLojaAction({}, formData);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      if (resultado.novaLoja) {
        setNovaLoja(resultado.novaLoja);
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={fechar}>
      <DialogContent>
        {novaLoja ? (
          <LinkDaNovaLoja
            storeId={novaLoja.id}
            storeNome={novaLoja.nome}
            onConcluir={() => fechar(false)}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Adicionar loja</DialogTitle>
              <DialogDescription>
                A loja entra na sua organização e vira a loja ativa assim que
                for criada.
              </DialogDescription>
            </DialogHeader>

            <form action={criar} className="space-y-4">
              {erro && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                  <AlertCircle className="size-4 shrink-0" />
                  {erro}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="nome-loja">Nome da loja</Label>
                <Input
                  id="nome-loja"
                  name="nome"
                  placeholder="Ex.: Alira Shopping Ibirapuera"
                  required
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={pending}>
                  {pending ? "Criando..." : "Criar loja"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function LinkDaNovaLoja({
  storeId,
  storeNome,
  onConcluir,
}: {
  storeId: string;
  storeNome: string;
  onConcluir: () => void;
}) {
  const [copiado, setCopiado] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/login/${storeId}`
      : "";

  async function copiar() {
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Loja criada</DialogTitle>
        <DialogDescription>
          Este é o link de acesso próprio de {storeNome} — abre o login já
          com ela selecionada. Compartilhe com a equipe dessa loja.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 truncate rounded-lg border border-border bg-secondary/60 px-3 py-2 text-xs">
          <Store className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate font-mono">{url}</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          onClick={copiar}
        >
          {copiado ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copiado ? "Copiado" : "Copiar"}
        </Button>
      </div>

      <DialogFooter>
        <Button type="button" onClick={onConcluir}>
          Concluir
        </Button>
      </DialogFooter>
    </>
  );
}
