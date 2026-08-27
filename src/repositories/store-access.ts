import "server-only";

import { getTenantContext } from "@/lib/tenant/context";
import { getTenantDb } from "@/lib/tenant/db";

/**
 * Define a quais lojas um usuário tem acesso.
 *
 * `storeIds` é o conjunto completo desejado. Se cobrir todas as lojas ativas
 * da organização, é salvo como "sem restrição" (nenhuma linha) — assim uma
 * loja criada depois já aparece pra esse usuário automaticamente, igual
 * sempre foi. Só vira restrição de verdade quando alguma loja fica de fora.
 */
export async function definirAcessoLojas(
  userId: string,
  storeIds: string[],
): Promise<void> {
  const ctx = await getTenantContext();
  if (ctx.role !== "OWNER" && ctx.role !== "MANAGER") {
    throw new Error("Apenas donos e gerentes podem gerenciar acesso a lojas.");
  }

  const db = await getTenantDb();

  const [usuario, lojasAtivas] = await Promise.all([
    db.user.findUniqueOrThrow({ where: { id: userId }, select: { role: true } }),
    db.store.findMany({ where: { ativa: true }, select: { id: true } }),
  ]);

  if (usuario.role === "OWNER") {
    throw new Error("Donos sempre têm acesso a todas as lojas.");
  }

  const idsSelecionados = new Set(storeIds);
  const cobreTodasAsLojas = lojasAtivas.every((loja) => idsSelecionados.has(loja.id));

  await db.$transaction(async (tx) => {
    await tx.storeAccess.deleteMany({ where: { userId } });

    if (!cobreTodasAsLojas && idsSelecionados.size > 0) {
      await tx.storeAccess.createMany({
        data: Array.from(idsSelecionados).map((storeId) => ({
          organizationId: ctx.organizationId,
          userId,
          storeId,
        })),
      });
    }
  });
}
