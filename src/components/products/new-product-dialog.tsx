"use client";

import * as React from "react";
import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus } from "lucide-react";

import {
  criarProdutoAction,
  type CriarProdutoState,
} from "@/app/(crm)/produtos/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ESTADO_INICIAL: CriarProdutoState = {};

/**
 * Cadastro básico de produto: cria com uma única variante (P/Único) e
 * estoque zerado — ajustar tamanhos, cores e estoque por variante é
 * trabalho de uma tela de edição que ainda não existe.
 */
export function NewProductDialog({ categorias }: { categorias: string[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, formAction, pending] = useActionState(
    criarProdutoAction,
    ESTADO_INICIAL,
  );
  const enviadoRef = useRef(false);

  useEffect(() => {
    if (pending) enviadoRef.current = true;
    if (!pending && enviadoRef.current && !state.erro) {
      enviadoRef.current = false;
      setOpen(false);
      router.refresh();
    }
  }, [pending, state.erro, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Novo produto
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo produto</DialogTitle>
          <DialogDescription>
            Cadastro básico. Tamanhos, cores e estoque por variante se ajustam
            depois, na edição do produto.
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
            <Label htmlFor="produto-nome">Nome</Label>
            <Input
              id="produto-nome"
              name="nome"
              placeholder="Vestido Midi Alfaiataria"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="produto-sku">SKU</Label>
              <Input
                id="produto-sku"
                name="sku"
                placeholder="VM-MIDI-09"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="produto-preco">Preço</Label>
              <Input
                id="produto-preco"
                name="preco"
                placeholder="349,00"
                inputMode="decimal"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="produto-categoria">Categoria</Label>
            <Input
              id="produto-categoria"
              name="categoria"
              list="categorias-existentes"
              placeholder="Vestidos"
            />
            <datalist id="categorias-existentes">
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria} />
              ))}
            </datalist>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Criar produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
