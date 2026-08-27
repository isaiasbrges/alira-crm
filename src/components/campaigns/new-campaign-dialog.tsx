"use client";

import * as React from "react";
import { Plus, UsersRound } from "lucide-react";

import { MOCK_CUSTOMERS } from "@/mocks/customers";
import { MOCK_SEGMENTS } from "@/mocks/segments";
import { MOCK_TEMPLATES } from "@/mocks/campaigns";
import { contarClientesDoSegmento } from "@/services/segment-engine";
import type { Campaign } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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

export function NewCampaignDialog({ onCreate }: { onCreate: (campanha: Campaign) => void }) {
  const [open, setOpen] = React.useState(false);
  const [nome, setNome] = React.useState("");
  const [segmentoId, setSegmentoId] = React.useState(MOCK_SEGMENTS[0]?.id ?? "");
  const [templateNome, setTemplateNome] = React.useState(MOCK_TEMPLATES[0]);
  const [agendadaPara, setAgendadaPara] = React.useState("");

  const segmento = MOCK_SEGMENTS.find((item) => item.id === segmentoId);
  // Mesmo motor do construtor de Segmentos — a contagem que aparece aqui é a
  // que a campanha de fato alcançaria.
  const destinatarios = segmento ? contarClientesDoSegmento(MOCK_CUSTOMERS, segmento) : 0;

  function limpar() {
    setNome("");
    setSegmentoId(MOCK_SEGMENTS[0]?.id ?? "");
    setTemplateNome(MOCK_TEMPLATES[0]);
    setAgendadaPara("");
  }

  function alternarAbertura(next: boolean) {
    setOpen(next);
    if (!next) limpar();
  }

  function submeter(event: React.FormEvent) {
    event.preventDefault();
    if (!nome.trim() || !segmento) return;

    onCreate({
      id: `camp-${Date.now()}`,
      nome: nome.trim(),
      status: agendadaPara ? "agendada" : "rascunho",
      segmentoId: segmento.id,
      segmentoNome: segmento.nome,
      templateNome,
      destinatarios,
      agendadaPara: agendadaPara ? new Date(agendadaPara).toISOString() : undefined,
    });

    alternarAbertura(false);
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
              O disparo pela WhatsApp Cloud API entra em uma etapa futura — por ora a campanha
              fica agendada ou em rascunho.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
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

            <div className="space-y-1.5">
              <Label>Segmento</Label>
              <Select value={segmentoId} onValueChange={setSegmentoId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um segmento" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_SEGMENTS.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Template</Label>
              <Select value={templateNome} onValueChange={setTemplateNome}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_TEMPLATES.map((template) => (
                    <SelectItem key={template} value={template}>
                      {template}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="campanha-agendamento">Agendar para</Label>
              <Input
                id="campanha-agendamento"
                type="datetime-local"
                value={agendadaPara}
                onChange={(event) => setAgendadaPara(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">Vazio salva como rascunho.</p>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary/50 px-4 py-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tint-blue text-tint-blue-fg">
                <UsersRound className="size-4" />
              </span>
              <div>
                <div className="text-sm font-semibold">
                  {destinatarios} destinatário{destinatarios === 1 ? "" : "s"}
                </div>
                <div className="text-xs text-muted-foreground">segundo o segmento escolhido</div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => alternarAbertura(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!segmento}>
              Salvar campanha
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
