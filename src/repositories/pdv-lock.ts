import "server-only";

import { hashSenha, verificarSenha } from "@/lib/auth/password";
import { getTenantContext } from "@/lib/tenant/context";
import { getTenantDb, tenantDb } from "@/lib/tenant/db";

/** Loja ativa da sessão, com se ela tem senha de PDV configurada. */
export async function lojaAtivaPdv(): Promise<{
  id: string;
  nome: string;
  temSenha: boolean;
}> {
  const ctx = await getTenantContext();
  if (!ctx.storeId) throw new Error("Nenhuma loja ativa na sessão.");
  const db = tenantDb(ctx);

  const loja = await db.store.findUniqueOrThrow({
    where: { id: ctx.storeId },
    select: { id: true, nome: true, pdvSenhaHash: true },
  });

  return { id: loja.id, nome: loja.nome, temSenha: loja.pdvSenhaHash !== null };
}

/** Confere a senha do PDV informada contra a da loja ativa da sessão. */
export async function conferirSenhaPdv(senha: string): Promise<boolean> {
  const ctx = await getTenantContext();
  if (!ctx.storeId) throw new Error("Nenhuma loja ativa na sessão.");
  const db = tenantDb(ctx);

  const loja = await db.store.findUniqueOrThrow({
    where: { id: ctx.storeId },
    select: { pdvSenhaHash: true },
  });

  if (!loja.pdvSenhaHash) return true;
  return verificarSenha(senha, loja.pdvSenhaHash);
}

/**
 * Define, troca ou remove (passando `null`) a senha do PDV de uma loja.
 * Só donos e gerentes podem mexer nisso — é quem responde pelo caixa.
 */
export async function definirSenhaPdv(
  storeId: string,
  senha: string | null,
): Promise<void> {
  const ctx = await getTenantContext();
  if (ctx.role !== "OWNER" && ctx.role !== "MANAGER") {
    throw new Error("Apenas donos e gerentes podem definir a senha do PDV.");
  }

  const db = await getTenantDb();
  const pdvSenhaHash = senha ? await hashSenha(senha) : null;

  await db.store.update({
    where: { id: storeId },
    data: { pdvSenhaHash },
  });
}
