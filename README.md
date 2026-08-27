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

## Integração WhatsApp (n8n + Evolution API)

O envio/recebimento de WhatsApp de verdade passa por um fluxo no n8n, que fala
com uma instância da Evolution API — não há chamada direta a nenhuma API do
WhatsApp a partir do Alira CRM. As URLs e o token de cada organização ficam em
**Configurações → Integrações**.

### Recebendo mensagens (n8n → Alira)

`POST /api/webhooks/whatsapp/{token}`

O `{token}` identifica a organização e autentica a chamada — não é preciso
cabeçalho extra. No n8n, o fluxo que reage a mensagens novas da Evolution API
deve terminar com um nó HTTP Request apontando para essa URL; a tradução do
payload bruto da Evolution API para o formato abaixo é feita ali (ex.: nó
"Set"), o que mantém este app desacoplado do formato exato da Evolution API.

Corpo esperado (JSON):

```json
{
  "whatsapp": "5511999990000",
  "texto": "Mensagem recebida do cliente",
  "externalId": "id-opcional-da-mensagem-na-evolution-api"
}
```

- `whatsapp` e `texto` são obrigatórios; requisição sem eles retorna `400`.
- `externalId` é opcional e torna a chamada idempotente: reentregar o mesmo
  evento (mesmo `externalId`) não duplica a mensagem.
- Se o `whatsapp` não corresponde a nenhum cliente da organização, um cliente
  novo é criado automaticamente (nome "Contato") na primeira loja ativa.
- Token inválido retorna `401`.
- Sucesso retorna `200` com `{ "ok": true }`.

### Enviando mensagens (Alira → n8n)

Ao responder um atendimento na tela de Atendimentos, além de gravar a
mensagem no histórico, o Alira faz um `POST` best-effort para a URL do
webhook n8n configurada em Configurações:

```json
{
  "whatsapp": "5511999990000",
  "texto": "Mensagem digitada pela equipe"
}
```

Esse fluxo do n8n é quem deve chamar a Evolution API para o envio de fato. Se
a URL não estiver configurada, ou o n8n estiver fora do ar, a mensagem
continua sendo registrada normalmente no histórico — o disparo é best-effort
e não bloqueia a tela.

## Deploy na Vercel

Importe o repositório na Vercel e faça o deploy — os padrões do Next servem, não
há nada para configurar.

Variáveis de ambiente **não são necessárias agora**: as telas usam dados
mockados e nada conecta no banco em tempo de execução. `DATABASE_URL` passa a
ser obrigatória na etapa de persistência.

O `postinstall` roda `prisma generate` no build. Sem ele, o cache de
`node_modules` da Vercel serviria um Prisma Client ausente ou defasado.

## Estado atual

Concluído: fundação, arquitetura, layout (sidebar colapsável, header, breadcrumb,
busca global com `⌘K`), Dashboard e Clientes — ambos visuais, com dados mockados —
e o núcleo multi-tenant (schema, guard de isolamento, sessão, papéis).

Próximas etapas: autenticação real substituindo a sessão de desenvolvimento,
persistência de clientes sobre os repositories, troca de loja no seletor,
Produtos com variantes, PDV Lite, construtor de segmentos e WhatsApp Cloud API.
