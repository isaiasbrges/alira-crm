import { NextResponse, type NextRequest } from "next/server";

import {
  organizacaoPorTokenWebhook,
  registrarMensagemRecebida,
} from "@/repositories/whatsapp-webhook";

/**
 * Webhook inbound: o n8n chama aqui depois de receber uma mensagem na
 * Evolution API. O contrato é deliberadamente mínimo — quem traduz o payload
 * bruto da Evolution API para este formato é o próprio fluxo do n8n (um nó
 * "Set"), o que mantém este app desacoplado do formato exato da Evolution API.
 *
 * Corpo esperado: { whatsapp: string, texto: string, externalId?: string }
 */
export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/webhooks/whatsapp/[token]">,
) {
  const { token } = await context.params;

  const organizacao = await organizacaoPorTokenWebhook(token);
  if (!organizacao) {
    return NextResponse.json({ erro: "Token inválido." }, { status: 401 });
  }

  const corpo = await request.json().catch(() => null);
  if (
    !corpo ||
    typeof corpo.whatsapp !== "string" ||
    typeof corpo.texto !== "string"
  ) {
    return NextResponse.json(
      {
        erro:
          "Payload inválido. Esperado { whatsapp: string, texto: string, externalId?: string }.",
      },
      { status: 400 },
    );
  }

  await registrarMensagemRecebida(organizacao.id, {
    whatsapp: corpo.whatsapp,
    texto: corpo.texto,
    externalId:
      typeof corpo.externalId === "string" ? corpo.externalId : undefined,
  });

  return NextResponse.json({ ok: true });
}
