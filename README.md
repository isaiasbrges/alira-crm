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

A aplicação sobe em `http://localhost:3001` e redireciona para `/dashboard`.

> A porta 3001 é fixada nos scripts `dev` e `start` para não colidir com outros
> projetos Next rodando na 3000. Para usar outra: `npm run dev -- -p 3002`.

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

## Estrutura

```txt
prisma/schema.prisma     modelo de dados (multi-loja desde a origem)
src/app/(crm)/           rotas do CRM, todas dentro do AppShell
src/components/ui/       primitivos shadcn/ui + dashboard-sidebar
src/components/layout/   AppShell, Header, Breadcrumb, busca global
src/components/          dashboard/, customers/ — componentes por domínio
src/services/            regras de negócio (fora dos componentes visuais)
src/lib/                 utilitários, navegação, formatação, Prisma client
src/mocks/               dados mockados centralizados
src/types/               tipos de domínio
```

## Estado atual

Concluído: fundação, arquitetura, layout (sidebar colapsável, header, breadcrumb,
busca global com `⌘K`), Dashboard e Clientes — ambos visuais, com dados mockados.

Próximas etapas: persistência de clientes, módulo de Produtos com variantes,
PDV Lite, construtor de segmentos e integração com a WhatsApp Cloud API.
