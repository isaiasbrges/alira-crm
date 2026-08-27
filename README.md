# Alira CRM

CRM para varejo de moda: cadastro de clientes com tamanhos e preferências, histórico de
compras, segmentação, tarefas para vendedores, campanhas por WhatsApp e métricas de
recompra.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · lucide-react ·
Prisma ORM · MySQL · deploy na Vercel.

## Rodando localmente

```bash
npm install
cp .env.example .env      # preencha DATABASE_URL
npx prisma generate
npx prisma migrate dev    # cria o schema no MySQL
npm run dev
```

A aplicação sobe em `http://localhost:4310` e redireciona para `/dashboard`.

> A porta 4310 é fixada nos scripts `dev` e `start` para não colidir com as portas
> disputadas (3000, 3001, 8080). Se ela também estiver ocupada, rode direto em
> outra: `npx next dev -p 4311` — usar `npm run dev -- -p` não funciona, porque a
> flag do script vem antes e vence.

> O MVP usa dados mockados (`src/mocks/`), então o Dashboard e a tela de Clientes
> funcionam mesmo sem banco configurado. O MySQL só é necessário a partir da etapa
> de persistência.

## Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Sobe o build de produção |
| `npm run lint` | ESLint |
| `npm run verify:tenant` | Verifica o isolamento entre organizações (não usa banco) |
| `npm run db:migrate` | Aplica as migrations em desenvolvimento |
| `npm run db:seed` | Cria a organização padrão, a loja e os usuários iniciais |

## Estrutura

```txt
prisma/schema.prisma     modelo de dados multi-tenant
prisma/seed.ts           organização padrão, loja e usuários iniciais
src/app/(crm)/           rotas do CRM, todas dentro do AppShell
src/lib/auth/            sessão — única origem legítima do organizationId
src/lib/tenant/          guard de isolamento, contexto e workspace
src/repositories/        acesso a dados; ninguém fala com o Prisma fora daqui
src/components/ui/       primitivos shadcn/ui + dashboard-sidebar
src/components/layout/   AppShell, Header, Breadcrumb, busca global
src/components/          dashboard/, customers/ — componentes por domínio
src/services/            regras de negócio (fora dos componentes visuais)
src/lib/                 utilitários, navegação, formatação, Prisma client
src/mocks/               dados mockados centralizados
src/types/               tipos de domínio
```

## Multi-tenant

Uma instalação atende várias empresas. Cada empresa é uma `Organization` e tem
uma ou mais `Store`.

O `organizationId` **nunca** vem do navegador: sai da sessão, em
`src/lib/auth/session.ts`. As rotas seguem simples (`/clientes`, não
`/empresa-x/clientes`) justamente para que o tenant não trafegue pela URL.

O isolamento não depende de cada query lembrar do filtro. `getTenantDb()`
devolve um Prisma estendido que injeta `organizationId` em toda operação — e
**sobrescreve** o valor caso alguém tenha informado um, que é o que neutraliza
um id forjado. A lista de modelos cobertos é derivada do schema em tempo de
execução: todo modelo com o campo `organizationId` entra sozinho, sem lista
manual para envelhecer.

Duas fronteiras que o guard não alcança, por limitação do mecanismo: SQL cru
(`$queryRaw`) e os filhos de escritas aninhadas — nesses, o `organizationId` é
obrigatório no schema e o TypeScript cobra.

`npm run verify:tenant` exercita essas regras, incluindo tentativas de forjar
`organizationId`. Roda sem banco.

## Estado atual

Concluído: fundação, arquitetura, layout (sidebar colapsável, header, breadcrumb,
busca global com `⌘K`), Dashboard e Clientes — ambos visuais, com dados mockados —
e o núcleo multi-tenant (schema, guard de isolamento, sessão, papéis).

Próximas etapas: autenticação real substituindo a sessão de desenvolvimento,
persistência de clientes sobre os repositories, troca de loja no seletor,
Produtos com variantes, PDV Lite, construtor de segmentos e WhatsApp Cloud API.
