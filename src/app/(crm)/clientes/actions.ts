"use server";

import { Prisma } from "@prisma/client";

import { atualizarStatusCliente, criarCliente } from "@/repositories/customers";
import type { CustomerStatus } from "@/types/customer";

export type CriarClienteState = {
  erro?: string;
};

export async function criarClienteAction(
  _prevState: CriarClienteState,
  formData: FormData,
): Promise<CriarClienteState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const cidade = String(formData.get("cidade") ?? "").trim();
  const estado = String(formData.get("estado") ?? "")
    .trim()
    .toUpperCase()
    .slice(0, 2);
  const sellerId = String(formData.get("sellerId") ?? "").trim();

  if (!nome) return { erro: "Informe o nome do cliente." };
  if (!whatsapp) return { erro: "Informe o WhatsApp do cliente." };

  try {
    await criarCliente({
      nome,
      whatsapp,
      email: email || null,
      cidade: cidade || null,
      estado: estado || null,
      sellerId: sellerId || null,
    });
  } catch (erro) {
    if (
      erro instanceof Prisma.PrismaClientKnownRequestError &&
      erro.code === "P2002"
    ) {
      return { erro: "Já existe um cliente com esse WhatsApp." };
    }
    throw erro;
  }

  return {};
}

/** Chamada direto do cliente ao soltar um card em outra coluna do board. */
export async function atualizarStatusClienteAction(
  clienteId: string,
  status: CustomerStatus,
): Promise<void> {
  await atualizarStatusCliente(clienteId, status);
}
