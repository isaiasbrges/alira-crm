"use client";

import * as React from "react";
import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus } from "lucide-react";

import {
  criarClienteAction,
  type CriarClienteState,
} from "@/app/(crm)/clientes/actions";
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

const ESTADO_INICIAL: CriarClienteState = {};

export function CreateCustomerDialog({
  vendedores,
}: {
  vendedores: { id: string; nome: string }[];
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, formAction, pending] = useActionState(
    criarClienteAction,
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
          Novo cliente
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo cliente</DialogTitle>
          <DialogDescription>
            Cadastra o cliente na loja ativa.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {state.erro && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              {state.erro}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="cliente-nome">Nome</Label>
              <Input id="cliente-nome" name="nome" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cliente-whatsapp">WhatsApp</Label>
              <Input
                id="cliente-whatsapp"
                name="whatsapp"
                placeholder="(11) 90000-0000"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cliente-email">E-mail</Label>
              <Input id="cliente-email" name="email" type="email" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cliente-cidade">Cidade</Label>
              <Input id="cliente-cidade" name="cidade" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cliente-estado">Estado</Label>
              <Input
                id="cliente-estado"
                name="estado"
                placeholder="SP"
                maxLength={2}
              />
            </div>

            {vendedores.length > 0 && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="cliente-vendedor">Vendedor</Label>
                <Select name="sellerId">
                  <SelectTrigger id="cliente-vendedor" className="w-full">
                    <SelectValue placeholder="Sem vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendedores.map((vendedor) => (
                      <SelectItem key={vendedor.id} value={vendedor.id}>
                        {vendedor.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
