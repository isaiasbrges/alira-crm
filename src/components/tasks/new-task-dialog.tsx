"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { MOCK_VENDEDORES } from "@/mocks/customers";
import type { Task, TaskPriority } from "@/types/task";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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

export function NewTaskDialog({ onCreate }: { onCreate: (tarefa: Task) => void }) {
  const [open, setOpen] = React.useState(false);
  const [titulo, setTitulo] = React.useState("");
  const [clienteNome, setClienteNome] = React.useState("");
  const [vendedorId, setVendedorId] = React.useState(MOCK_VENDEDORES[0].id);
  const [prioridade, setPrioridade] = React.useState<TaskPriority>("media");
  const [venceEm, setVenceEm] = React.useState("");

  function limpar() {
    setTitulo("");
    setClienteNome("");
    setVendedorId(MOCK_VENDEDORES[0].id);
    setPrioridade("media");
    setVenceEm("");
  }

  function alternarAbertura(next: boolean) {
    setOpen(next);
    if (!next) limpar();
  }

  function submeter(event: React.FormEvent) {
    event.preventDefault();
    if (!titulo.trim()) return;

    const vendedor = MOCK_VENDEDORES.find((item) => item.id === vendedorId);

    onCreate({
      id: `task-${Date.now()}`,
      titulo: titulo.trim(),
      clienteNome: clienteNome.trim() || undefined,
      vendedorId,
      vendedorNome: vendedor?.nome ?? "",
      prioridade,
      status: "pendente",
      venceEm: venceEm ? new Date(venceEm).toISOString() : new Date().toISOString(),
    });

    alternarAbertura(false);
  }

  return (
    <Dialog open={open} onOpenChange={alternarAbertura}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Nova tarefa
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={submeter}>
          <DialogHeader>
            <DialogTitle>Nova tarefa</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="tarefa-titulo">Título</Label>
              <Input
                id="tarefa-titulo"
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
                placeholder="Ligar para a cliente"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tarefa-cliente">Cliente</Label>
              <Input
                id="tarefa-cliente"
                value={clienteNome}
                onChange={(event) => setClienteNome(event.target.value)}
                placeholder="Opcional"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Responsável</Label>
                <Select value={vendedorId} onValueChange={setVendedorId}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_VENDEDORES.map((vendedor) => (
                      <SelectItem key={vendedor.id} value={vendedor.id}>
                        {vendedor.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Prioridade</Label>
                <Select value={prioridade} onValueChange={(value) => setPrioridade(value as TaskPriority)}>
                  <SelectTrigger className="w-full">
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
                type="datetime-local"
                value={venceEm}
                onChange={(event) => setVenceEm(event.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => alternarAbertura(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar tarefa</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
