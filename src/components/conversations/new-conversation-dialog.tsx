"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { enviarMensagemAction } from "@/app/(crm)/atendimentos/actions";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type NewConversationDialogProps = {
  clientes: { id: string; nome: string }[];
  onCreated: (clienteId: string) => void;
};

export function NewConversationDialog({
  clientes,
  onCreated,
}: NewConversationDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [clienteId, setClienteId] = React.useState("");
  const [texto, setTexto] = React.useState("");
  const [pendente, setPendente] = React.useState(false);

  function limpar() {
    setClienteId("");
    setTexto("");
  }

  function alternarAbertura(next: boolean) {
    setOpen(next);
    if (!next) limpar();
  }

  async function enviar(event: React.FormEvent) {
    event.preventDefault();
    if (!clienteId || !texto.trim() || pendente) return;

    setPendente(true);
    await enviarMensagemAction(clienteId, texto.trim());
    setPendente(false);

    alternarAbertura(false);
    onCreated(clienteId);
  }

  return (
    <Dialog open={open} onOpenChange={alternarAbertura}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Nova conversa
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={enviar}>
          <DialogHeader>
            <DialogTitle>Nova conversa</DialogTitle>
            <DialogDescription>
              Registra a primeira mensagem para o cliente.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="conversa-cliente">Cliente</Label>
              <Select value={clienteId} onValueChange={setClienteId}>
                <SelectTrigger id="conversa-cliente" className="w-full">
                  <SelectValue placeholder="Selecione o cliente" />
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

            <div className="space-y-1.5">
              <Label htmlFor="conversa-mensagem">Mensagem</Label>
              <Textarea
                id="conversa-mensagem"
                value={texto}
                onChange={(event) => setTexto(event.target.value)}
                placeholder="Escreva a primeira mensagem"
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!clienteId || !texto.trim() || pendente}
            >
              {pendente ? "Enviando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
