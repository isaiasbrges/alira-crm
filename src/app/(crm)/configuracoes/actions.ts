"use server";

import { salvarWebhookN8n } from "@/repositories/organizations";

export type SalvarWebhookN8nState = {
  erro?: string;
  sucesso?: boolean;
};

export async function salvarWebhookN8nAction(
  _prevState: SalvarWebhookN8nState,
  formData: FormData,
): Promise<SalvarWebhookN8nState> {
  const url = String(formData.get("n8nWebhookUrl") ?? "").trim();

  if (url) {
    try {
      new URL(url);
    } catch {
      return { erro: "URL inválida." };
    }
  }

  await salvarWebhookN8n(url || null);

  return { sucesso: true };
}
