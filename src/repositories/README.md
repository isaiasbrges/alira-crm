# Repositories

Camada de acesso a dados. Toda leitura e escrita do CRM passa por aqui.

## A regra

Nenhum arquivo importa `@/lib/prisma` diretamente. Repositório usa
`getTenantDb()` (ou recebe um `TenantDb` já escopado), nunca o client cru.

Isso é verificado pelo ESLint (`no-restricted-imports` em `eslint.config.mjs`),
com três exceções declaradas: `lib/prisma.ts`, onde o client nasce;
`lib/tenant/db.ts`, que o embrulha; e `repositories/organizations.ts`, que trata
do modelo sem `organizationId`.

O motivo é isolamento entre empresas: o client de `@/lib/prisma` enxerga o banco
inteiro. O de `@/lib/tenant/db` aplica `organizationId` da sessão em toda query,
então esquecer o filtro deixa de ser possível — `db.customer.findMany()` sem
`where` já retorna apenas os clientes da organização atual.

## Escrevendo um repositório novo

```ts
import "server-only";

import { getTenantDb } from "@/lib/tenant/db";

export async function listarAlgumaCoisa() {
  const db = await getTenantDb();

  // Sem where de organização: o guard já aplicou.
  return db.algumaCoisa.findMany({ orderBy: { nome: "asc" } });
}
```

Para escopar por loja além da organização, leia `storeId` do contexto:

```ts
import { getTenantContext } from "@/lib/tenant/context";

const ctx = await getTenantContext();
const db = tenantDb(ctx);

return db.sale.findMany({ where: { storeId: ctx.storeId } });
```

## O que o guard não cobre

- **SQL cru** (`$queryRaw`, `$executeRaw`) não passa por extensões do Prisma. Se
  for necessário, o filtro de organização vai escrito na própria query.
- **Escritas aninhadas** recebem o carimbo apenas no registro de topo. Nos
  filhos, `organizationId` é obrigatório no schema e o TypeScript cobra.
