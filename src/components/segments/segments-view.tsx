"use client";

import * as React from "react";
import { Plus, Share2, Trash2, UsersRound } from "lucide-react";

import { formatDate } from "@/lib/format";
import { MOCK_CUSTOMERS } from "@/mocks/customers";
import { MOCK_SEGMENTS } from "@/mocks/segments";
import { contarClientesDoSegmento } from "@/services/segment-engine";
import type { Segment } from "@/types/segment";
import { OPERATOR_LABEL, SEGMENT_FIELDS } from "@/types/segment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { SegmentBuilderSheet } from "@/components/segments/segment-builder-sheet";

export function SegmentsView() {
  const [segments, setSegments] = React.useState<Segment[]>(MOCK_SEGMENTS);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  return (
    <>
      <PageHeader
        titulo="Segmentos"
        descricao="Grupos de clientes definidos por regras, prontos para campanhas."
      >
        <Button className="gap-2" onClick={() => setSheetOpen(true)}>
          <Plus className="size-4" />
          Novo segmento
        </Button>
      </PageHeader>

      {segments.length === 0 ? (
        <EmptyState onCreate={() => setSheetOpen(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {segments.map((segmento) => (
            <SegmentCard
              key={segmento.id}
              segmento={segmento}
              onRemove={() =>
                setSegments((atual) => atual.filter((item) => item.id !== segmento.id))
              }
            />
          ))}
        </div>
      )}

      <SegmentBuilderSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSave={(segmento) => setSegments((atual) => [segmento, ...atual])}
      />
    </>
  );
}

function SegmentCard({ segmento, onRemove }: { segmento: Segment; onRemove: () => void }) {
  const total = React.useMemo(
    () => contarClientesDoSegmento(MOCK_CUSTOMERS, segmento),
    [segmento]
  );

  return (
    <Card className="gap-0 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{segmento.nome}</div>
          {segmento.descricao && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {segmento.descricao}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover segmento ${segmento.nome}`}
          className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {segmento.regras.map((regra) => (
          <Badge key={regra.id} variant="secondary" className="font-normal">
            {SEGMENT_FIELDS[regra.campo].label} {OPERATOR_LABEL[regra.operador]}{" "}
            {regra.valor || "—"}
          </Badge>
        ))}
        {segmento.regras.length === 0 && (
          <span className="text-xs text-muted-foreground">Sem condições — toda a base</span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-1.5 text-sm">
          <UsersRound className="size-4 text-muted-foreground" />
          <span className="font-semibold">{total}</span>
          <span className="text-muted-foreground">cliente{total === 1 ? "" : "s"}</span>
        </div>
        <span className="text-xs text-muted-foreground">{formatDate(segmento.createdAt)}</span>
      </div>
    </Card>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="items-center gap-3 px-6 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-secondary">
        <Share2 className="size-5 text-muted-foreground" />
      </span>
      <div>
        <p className="text-sm font-medium">Nenhum segmento criado</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Crie o primeiro segmento para direcionar campanhas.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onCreate}>
        Novo segmento
      </Button>
    </Card>
  );
}
