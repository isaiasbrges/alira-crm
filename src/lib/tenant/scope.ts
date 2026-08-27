import { Prisma } from "@prisma/client";

/**
 * Regras de escopo de tenancy, isoladas da infraestrutura do Prisma.
 *
 * Ficam aqui, puras, porque isolamento entre empresas é a regra mais séria do
 * sistema: separado assim, o comportamento pode ser verificado diretamente,
 * sem subir banco.
 */

/**
 * Modelos sujeitos ao filtro de organização.
 *
 * Derivado do schema em tempo de execução: todo modelo que tenha o campo
 * `organizationId` entra automaticamente. É deliberado não manter isso à mão —
 * uma lista manual envelhece no dia em que alguém cria um modelo novo e esquece
 * de registrá-lo, e o preço desse esquecimento seria vazar dados entre empresas.
 */
export const TENANT_MODELS: ReadonlySet<string> = new Set(
  Prisma.dmmf.datamodel.models
    .filter((model) => model.fields.some((field) => field.name === "organizationId"))
    .map((model) => model.name)
);

/** Operações cujo `where` define o alcance da leitura ou da escrita. */
const WHERE_SCOPED = new Set([
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "findUnique",
  "findUniqueOrThrow",
  "count",
  "aggregate",
  "groupBy",
  "update",
  "updateMany",
  "delete",
  "deleteMany",
]);

/** Operações que gravam registros novos e precisam carimbar o dono. */
const CREATES = new Set(["create", "createMany", "createManyAndReturn"]);

type AnyArgs = Record<string, unknown>;

function carimbar<T>(data: T, organizationId: string): T {
  if (Array.isArray(data)) {
    return data.map((item) => ({ ...(item as object), organizationId })) as T;
  }

  if (data && typeof data === "object") {
    return { ...(data as object), organizationId } as T;
  }

  return data;
}

export function modeloTemTenant(model: string | undefined): boolean {
  return Boolean(model && TENANT_MODELS.has(model));
}

/**
 * Reescreve os argumentos de uma query para que ela nunca saia da organização.
 *
 * O `organizationId` é sobrescrito, jamais mesclado: se o chamador informou um
 * valor, ele é descartado em favor do valor da sessão. É exatamente aqui que um
 * id forjado vindo do navegador perde o efeito.
 */
export function aplicarEscopoTenant(
  model: string | undefined,
  operation: string,
  args: unknown,
  organizationId: string
): unknown {
  if (!modeloTemTenant(model)) return args;

  const typed = (args ?? {}) as AnyArgs;

  if (WHERE_SCOPED.has(operation)) {
    const where = (typed.where ?? {}) as AnyArgs;
    return { ...typed, where: { ...where, organizationId } };
  }

  if (CREATES.has(operation)) {
    return { ...typed, data: carimbar(typed.data, organizationId) };
  }

  if (operation === "upsert") {
    const where = (typed.where ?? {}) as AnyArgs;
    return {
      ...typed,
      where: { ...where, organizationId },
      create: carimbar(typed.create, organizationId),
    };
  }

  return typed;
}
