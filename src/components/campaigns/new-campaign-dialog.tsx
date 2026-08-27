"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus, UsersRound } from "lucide-react";

import type { Customer } from "@/types/customer";
import type { Segment } from "@/types/segment";
import { criarCampanhaAction } from "@/app/(crm)/campanhas/actions";
import { contarClientesDoSegmento } from "@/services/segment-engine";
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

const SUGESTOES_TEMPLATE = [
  "Pré-lançamento de coleção",
  "Reativação — desconto de retorno",
  "Aniversário do mês",
  "Confirmação de pedido",
  "Convite para evento na loja",
];

type NewCampaignDialogProps = {
  segmentos: Segment[];
  clientes: Customer[];
};

export function NewCampaignDialog({
  segmentos,
  clientes,
}: NewCampaignDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [nome, setNome] = React.useState("");
  const [segmentoId, setSegmentoId] = React.useState(segmentos[0]?.id ?? "");
  const [templateNome, setTemplateNome] = React.useState("");
  const [agendadaPara, setAgendadaPara] = React.useState("");
  const [pendente, setPendente] = React.useState(false);
  const [erro, setErro] = React.useState<string | undefined>();

  const segmento = segmentos.find((item) => item.id === segmentoId);
  // Mesmo motor do construtor de Segmentos — a contagem que aparece aqui é a
  // que a campanha de fato alcançaria.
  const destinatarios = segmento
    ? contarClientesDoSegmento(clientes, segmento)
    : 0;

  function limpar() {
    setNome("");
    setSegmentoId(segmentos[0]?.id ?? "");
    setTemplateNome("");
    setAgendadaPara("");
    setErro(undefined);
  }

  function alternarAbertura(next: boolean) {
    setOpen(next);
    if (!next) limpar();
  }

  async function submeter(event: React.FormEvent) {
    event.preventDefault();
    if (!nome.trim() || !segmento || pendente) return;

    setPendente(true);
    const resultado = await criarCampanhaAction({
      nome: nome.trim(),
      segmentoId: segmento.id,
      templateNome: templateNome.trim(),
      agendadaPara: agendadaPara || null,
    });
    setPendente(false);

    if (resultado.campanha) {
      alternarAbertura(false);
      router.refresh();
    } else {
      setErro(resultado.erro ?? "Não foi possível criar a campanha.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={alternarAbertura}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Nova campanha
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={submeter}>
          <DialogHeader>
            <DialogTitle>Nova campanha</DialogTitle>
            <DialogDescription>
              O disparo pela WhatsApp Cloud API entra em uma etapa futura — por
              ora a campanha fica agendada ou em rascunho.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {erro && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                {erro}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="campanha-nome">Nome</Label>
              <Input
                id="campanha-nome"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Ex.: Convite para o desfile"
                required
              />
            </div>

            {segmentos.length > 0 ? (
              <div className="space-y-1.5">
                <Label>Segmento</Label>
                <Select value={segmentoId} onValueChange={setSegmentoId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    {segmentos.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Nenhum segmento criado ainda — crie um em Segmentos antes de
                lançar uma campanha.
              </p>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="campanha-template">Template</Label>
              <Input
                id="campanha-template"
                name="templateNome"
                list="templates-sugeridos"
                value={templateNome}
                onChange={(event) => setTemplateNome(event.target.value)}
                placeholder="Ex.: Pré-lançamento de coleção"
              />
              <datalist id="templates-sugeridos">
                {SUGESTOES_TEMPLATE.map((template) => (
                  <option key={template} value={template} />
                ))}
              </datalist>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="campanha-agendamento">Agendar para</Label>
              <Input
                id="campanha-agendamento"
                type="datetime-local"
                value={agendadaPara}
                onChange={(event) => setAgendadaPara(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Vazio salva como rascunho.
              </p>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary/50 px-4 py-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tint-blue text-tint-blue-fg">
                <UsersRound className="size-4" />
              </span>
              <div>
                <div className="text-sm font-semibold">
                  {destinatarios} destinatário{destinatarios === 1 ? "" : "s"}
                </div>
                <div className="text-xs text-muted-foreground">
                  segundo o segmento escolhido
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!segmento || pendente}>
              {pendente ? "Salvando..." : "Salvar campanha"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
