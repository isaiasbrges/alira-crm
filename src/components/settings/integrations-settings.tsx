"use client";

import { useActionState, useState } from "react";
import { Check, Copy } from "lucide-react";

import { salvarWebhookN8nAction } from "@/app/(crm)/configuracoes/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function IntegrationsSettings({
  n8nWebhookUrl,
  inboundWebhookUrl,
}: {
  n8nWebhookUrl: string | null;
  inboundWebhookUrl: string;
}) {
  const [state, formAction, pending] = useActionState(salvarWebhookN8nAction, {});
  const [copiado, setCopiado] = useState(false);

  async function copiarUrl() {
    await navigator.clipboard.writeText(inboundWebhookUrl);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold">Receber mensagens (n8n → Alira)</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          No n8n, configure um nó HTTP Request apontando para esta URL sempre
          que a Evolution API receber uma mensagem nova. Corpo esperado:{" "}
          <code className="rounded bg-secondary px-1 py-0.5">
            {"{ whatsapp, texto, externalId? }"}
          </code>
          .
        </p>

        <div className="mt-4 flex items-end gap-2">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="webhook-inbound">URL do webhook</Label>
            <Input id="webhook-inbound" value={inboundWebhookUrl} readOnly />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={copiarUrl}>
            {copiado ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copiado ? "Copiado" : "Copiar"}
          </Button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          O token na URL autentica a chamada — não é preciso cabeçalho extra.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold">Enviar mensagens (Alira → n8n)</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Mensagens digitadas em Atendimentos são retransmitidas por POST para
          esta URL, que deve terminar num fluxo do n8n que chama a Evolution
          API para o envio de verdade.
        </p>

        <form action={formAction} className="mt-4 space-y-2">
          <Label htmlFor="n8nWebhookUrl">URL do webhook n8n (saída)</Label>
          <div className="flex items-end gap-2">
            <Input
              id="n8nWebhookUrl"
              name="n8nWebhookUrl"
              placeholder="https://seu-n8n.exemplo.com/webhook/alira-envio"
              defaultValue={n8nWebhookUrl ?? ""}
              className="flex-1"
            />
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
          {state.erro && (
            <p className="text-xs text-destructive">{state.erro}</p>
          )}
          {state.sucesso && (
            <p className="text-xs text-emerald-600">Salvo.</p>
          )}
        </form>
      </div>
    </div>
  );
}
