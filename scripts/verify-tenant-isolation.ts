/**
 * Verificação do isolamento entre organizações.
 *
 * Exercita as regras reais de `src/lib/tenant/scope.ts` — não uma cópia — e
 * cobre explicitamente a tentativa de forjar `organizationId`, que é a forma
 * mais direta de um cliente tentar ler dados de outra empresa.
 *
 * Rode com `npm run verify:tenant`. Não precisa de banco.
 */
import { Prisma } from "@prisma/client";

import { aplicarEscopoTenant, TENANT_MODELS } from "../src/lib/tenant/scope";

const ORG = "org_a";
const INVASOR = "org_vitima";

let falhas = 0;

function checar(nome: string, condicao: boolean, obtido?: unknown) {
  if (condicao) {
    console.log(`  ok   ${nome}`);
    return;
  }

  console.error(`  FALHA ${nome} -> ${JSON.stringify(obtido)}`);
  falhas += 1;
}

/** Lê um caminho dentro dos argumentos já transformados. */
function ler(alvo: unknown, ...caminho: string[]): unknown {
  return caminho.reduce<unknown>((atual, chave) => {
    if (atual && typeof atual === "object") {
      return (atual as Record<string, unknown>)[chave];
    }
    return undefined;
  }, alvo);
}

function itens(alvo: unknown, chave: string): Record<string, unknown>[] {
  const valor = ler(alvo, chave);
  return Array.isArray(valor) ? (valor as Record<string, unknown>[]) : [];
}

const escopar = (model: string, op: string, args: unknown) =>
  aplicarEscopoTenant(model, op, args, ORG);

console.log("Leitura");
{
  const r = escopar("Customer", "findMany", {});
  checar("findMany sem where recebe o filtro de organização", ler(r, "where", "organizationId") === ORG, r);
}
{
  const r = escopar("Customer", "findMany", { where: { status: "VIP" } });
  checar(
    "filtro de negócio é preservado junto do de organização",
    ler(r, "where", "status") === "VIP" && ler(r, "where", "organizationId") === ORG,
    r
  );
}
{
  const r = escopar("Customer", "findMany", { where: { organizationId: INVASOR } });
  checar("organizationId forjado na leitura é descartado", ler(r, "where", "organizationId") === ORG, r);
}
{
  const r = escopar("Customer", "findUnique", { where: { id: "cli_de_outra_org" } });
  checar(
    "findUnique por id de outra organização não casa",
    ler(r, "where", "id") === "cli_de_outra_org" && ler(r, "where", "organizationId") === ORG,
    r
  );
}

console.log("Escrita");
{
  const r = escopar("Customer", "create", { data: { nome: "X", organizationId: INVASOR } });
  checar("create carimba o dono e ignora o valor informado", ler(r, "data", "organizationId") === ORG, r);
}
{
  const r = escopar("Customer", "createMany", {
    data: [{ nome: "A" }, { nome: "B", organizationId: INVASOR }],
  });
  const todos = itens(r, "data");
  checar(
    "createMany carimba todos os itens",
    todos.length === 2 && todos.every((item) => item.organizationId === ORG),
    r
  );
}
{
  const r = escopar("Customer", "update", { where: { id: "x" }, data: { nome: "n" } });
  checar("update não alcança outra organização", ler(r, "where", "organizationId") === ORG, r);
}
{
  const r = escopar("Customer", "deleteMany", { where: { organizationId: INVASOR } });
  checar("deleteMany não apaga fora da organização", ler(r, "where", "organizationId") === ORG, r);
}
{
  const r = escopar("Customer", "upsert", { where: { id: "x" }, create: { nome: "N" }, update: {} });
  checar(
    "upsert escopa o where e carimba o create",
    ler(r, "where", "organizationId") === ORG && ler(r, "create", "organizationId") === ORG,
    r
  );
}

console.log("Cobertura");
{
  const r = escopar("Organization", "findMany", {});
  checar("Organization fica fora do guard (é o próprio tenant)", ler(r, "where") === undefined, r);
}
{
  const fora = Prisma.dmmf.datamodel.models
    .filter((model) => !TENANT_MODELS.has(model.name))
    .map((model) => model.name);

  checar(
    "todo modelo de negócio está coberto pelo guard",
    fora.length === 1 && fora[0] === "Organization",
    fora
  );
}

console.log(`\n${TENANT_MODELS.size} modelos cobertos pelo guard.`);

if (falhas > 0) {
  console.error(`${falhas} verificação(ões) de isolamento falharam.`);
  process.exit(1);
}

console.log("Isolamento entre organizações verificado.");
