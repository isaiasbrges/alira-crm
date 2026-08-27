"use client";

import * as React from "react";
import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { criarLojaAction, type CriarLojaState } from "@/lib/auth/actions";
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

const ESTADO_INICIAL: CriarLojaState = {};

type AddStoreDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddStoreDialog({ open, onOpenChange }: AddStoreDialogProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    criarLojaAction,
    ESTADO_INICIAL,
  );
  const enviadoRef = useRef(false);

  useEffect(() => {
    if (pending) enviadoRef.current = true;
    if (!pending && enviadoRef.current && !state.erro) {
      enviadoRef.current = false;
      onOpenChange(false);
      router.refresh();
    }
  }, [pending, state.erro, onOpenChange, router]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar loja</DialogTitle>
          <DialogDescription>
            A loja entra na sua organização e vira a loja ativa assim que for
            criada.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {state.erro && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {state.erro}
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
      </DialogContent>
    </Dialog>
  );
}
