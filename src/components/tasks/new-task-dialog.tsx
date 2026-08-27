"use client";

import * as React from "react";
import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus } from "lucide-react";

import {
  criarTarefaAction,
  type CriarTarefaState,
} from "@/app/(crm)/tarefas/actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ESTADO_INICIAL: CriarTarefaState = {};

type NewTaskDialogProps = {
  vendedores: { id: string; nome: string }[];
  clientes: { id: string; nome: string }[];
};

export function NewTaskDialog({ vendedores, clientes }: NewTaskDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, formAction, pending] = useActionState(
    criarTarefaAction,
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
          Nova tarefa
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova tarefa</DialogTitle>
          <DialogDescription>
            Atribuída a um responsável da loja ativa.
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
            <Label htmlFor="tarefa-titulo">Título</Label>
            <Input
              id="tarefa-titulo"
              name="titulo"
              placeholder="Ligar para a cliente"
              required
            />
          </div>

          {clientes.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="tarefa-cliente">Cliente</Label>
              <Select name="clienteId">
                <SelectTrigger id="tarefa-cliente" className="w-full">
                  <SelectValue placeholder="Opcional" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tarefa-vendedor">Responsável</Label>
              <Select name="vendedorId" defaultValue={vendedores[0]?.id}>
                <SelectTrigger id="tarefa-vendedor" className="w-full">
                  <SelectValue placeholder="Selecione" />
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

            <div className="space-y-1.5">
              <Label htmlFor="tarefa-prioridade">Prioridade</Label>
              <Select name="prioridade" defaultValue="media">
                <SelectTrigger id="tarefa-prioridade" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tarefa-vencimento">Vencimento</Label>
            <Input
              id="tarefa-vencimento"
              name="venceEm"
              type="datetime-local"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Criar tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
