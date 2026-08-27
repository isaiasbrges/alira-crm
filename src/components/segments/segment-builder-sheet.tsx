"use client";

import * as React from "react";
import { Plus, Trash2, UsersRound } from "lucide-react";

import { MOCK_CUSTOMERS } from "@/mocks/customers";
import { resolverSegmento } from "@/services/segment-engine";
import {
  OPERATOR_LABEL,
  SEGMENT_FIELDS,
  type Segment,
  type SegmentField,
  type SegmentLogic,
  type SegmentRule,
} from "@/types/segment";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RuleValueField } from "@/components/segments/rule-value-field";

function novaRegra(): SegmentRule {
  return { id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, campo: "status", operador: "igual", valor: "" };
}

type SegmentBuilderSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (segment: Segment) => void;
};

export function SegmentBuilderSheet({ open, onOpenChange, onSave }: SegmentBuilderSheetProps) {
  const [nome, setNome] = React.useState("");
  const [descricao, setDescricao] = React.useState("");
  const [logica, setLogica] = React.useState<SegmentLogic>("AND");
  const [regras, setRegras] = React.useState<SegmentRule[]>([novaRegra()]);

  function limpar() {
    setNome("");
    setDescricao("");
    setLogica("AND");
    setRegras([novaRegra()]);
  }

  function fechar(next: boolean) {
    onOpenChange(next);
    if (!next) limpar();
  }

  function atualizarRegra(id: string, parcial: Partial<SegmentRule>) {
    setRegras((atual) =>
      atual.map((regra) => {
        if (regra.id !== id) return regra;
        const proxima = { ...regra, ...parcial };
        // Trocar de campo pode invalidar o operador atual e sempre zera o valor.
        if (parcial.campo && parcial.campo !== regra.campo) {
          proxima.operador = SEGMENT_FIELDS[parcial.campo].operadores[0];
          proxima.valor = "";
        }
        return proxima;
      })
    );
  }

  const previa = React.useMemo(
    () => resolverSegmento(MOCK_CUSTOMERS, regras, logica),
    [regras, logica]
  );

  function salvar() {
    if (!nome.trim()) return;

    onSave({
      id: `seg-${Date.now()}`,
      nome: nome.trim(),
      descricao: descricao.trim() || undefined,
      logica,
      regras: regras.filter((regra) => regra.valor.trim() !== ""),
      createdAt: new Date().toISOString(),
    });
    fechar(false);
  }

  return (
    <Sheet open={open} onOpenChange={fechar}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Novo segmento</SheetTitle>
          <SheetDescription>
            Combine condições para encontrar o grupo certo de clientes.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
          <div className="space-y-1.5">
            <Label htmlFor="seg-nome">Nome</Label>
            <Input
              id="seg-nome"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Ex.: VIP para reativar"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="seg-descricao">Descrição</Label>
            <Input
              id="seg-descricao"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Condições</Label>
              <div className="flex items-center gap-1 rounded-lg bg-secondary p-1 text-xs">
                {(["AND", "OR"] as const).map((opcao) => (
                  <button
                    key={opcao}
                    type="button"
                    onClick={() => setLogica(opcao)}
                    className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                      logica === opcao
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground"
                    }`}
                  >
                    {opcao === "AND" ? "Todas (E)" : "Qualquer (OU)"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {regras.map((regra) => (
                <RuleRow
                  key={regra.id}
                  regra={regra}
                  onChange={(parcial) => atualizarRegra(regra.id, parcial)}
                  onRemove={() =>
                    setRegras((atual) => atual.filter((item) => item.id !== regra.id))
                  }
                  podeRemover={regras.length > 1}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setRegras((atual) => [...atual, novaRegra()])}
            >
              <Plus className="size-3.5" />
              Adicionar condição
            </Button>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary/50 px-4 py-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tint-blue text-tint-blue-fg">
              <UsersRound className="size-4" />
            </span>
            <div>
              <div className="text-sm font-semibold">
                {previa.length} cliente{previa.length === 1 ? "" : "s"}
              </div>
              <div className="text-xs text-muted-foreground">
                correspondem às condições agora
              </div>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => fechar(false)}>
            Cancelar
          </Button>
          <Button onClick={salvar} disabled={!nome.trim()}>
            Salvar segmento
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function RuleRow({
  regra,
  onChange,
  onRemove,
  podeRemover,
}: {
  regra: SegmentRule;
  onChange: (parcial: Partial<SegmentRule>) => void;
  onRemove: () => void;
  podeRemover: boolean;
}) {
  const config = SEGMENT_FIELDS[regra.campo];

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-2.5">
      <Select value={regra.campo} onValueChange={(value) => onChange({ campo: value as SegmentField })}>
        <SelectTrigger size="sm" className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(SEGMENT_FIELDS) as SegmentField[]).map((campo) => (
            <SelectItem key={campo} value={campo}>
              {SEGMENT_FIELDS[campo].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {config.operadores.length > 1 ? (
        <Select
          value={regra.operador}
          onValueChange={(value) => onChange({ operador: value as SegmentRule["operador"] })}
        >
          <SelectTrigger size="sm" className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {config.operadores.map((operador) => (
              <SelectItem key={operador} value={operador}>
                {OPERATOR_LABEL[operador]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <span className="text-xs text-muted-foreground">{OPERATOR_LABEL[regra.operador]}</span>
      )}

      <div className="min-w-28 flex-1">
        <RuleValueField
          campo={regra.campo}
          value={regra.valor}
          onChange={(valor) => onChange({ valor })}
        />
      </div>

      {podeRemover && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remover condição"
          className="text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}
