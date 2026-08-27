import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Semeia o mínimo para o sistema funcionar multi-tenant desde o primeiro boot:
 * a organização interna do time Alira e a organização de demonstração com sua
 * loja e usuários.
 *
 * É idempotente — roda quantas vezes precisar sem duplicar nada e sem apagar
 * dado nenhum. Registros que já existam são atualizados no que muda, e o resto
 * fica como está.
 */

const ORG_DEMO_ID = "org_alira_demo";
const STORE_PRINCIPAL_ID = "store_principal";
const USER_OWNER_ID = "usr_dev_owner";

async function main() {
  const senhaHash = await bcrypt.hash("alira123", 10);

  // Organização do time Alira: é onde vivem os SUPER_ADMIN. Fica marcada como
  // interna para que o painel master não a liste junto das empresas clientes.
  const alira = await prisma.organization.upsert({
    where: { slug: "alira" },
    update: {},
    create: {
      nome: "Alira",
      slug: "alira",
      interna: true,
      plano: "interno",
    },
  });

  await prisma.user.upsert({
    where: { email: "suporte@aliracrm.com.br" },
    update: { organizationId: alira.id, role: "SUPER_ADMIN" },
    create: {
      organizationId: alira.id,
      nome: "Suporte Alira",
      email: "suporte@aliracrm.com.br",
      senhaHash,
      role: "SUPER_ADMIN",
    },
  });

  // Organização padrão. Todo dado criado antes da multi-tenancy pertence a
  // ela — o id fixo é o mesmo que a sessão de desenvolvimento usa, então o app
  // encontra os registros sem nenhum passo extra de vinculação.
  const demo = await prisma.organization.upsert({
    where: { slug: "alira-demo" },
    update: {},
    create: {
      id: ORG_DEMO_ID,
      nome: "Alira Demo",
      slug: "alira-demo",
      plano: "demo",
    },
  });

  const loja = await prisma.store.upsert({
    where: { organizationId_slug: { organizationId: demo.id, slug: "principal" } },
    update: {},
    create: {
      id: STORE_PRINCIPAL_ID,
      organizationId: demo.id,
      nome: "Loja Principal",
      slug: "principal",
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: "isaias@aliracrm.com.br" },
    update: { organizationId: demo.id, role: "OWNER", ultimaStoreId: loja.id },
    create: {
      id: USER_OWNER_ID,
      organizationId: demo.id,
      nome: "Isaias",
      email: "isaias@aliracrm.com.br",
      senhaHash,
      role: "OWNER",
      ultimaStoreId: loja.id,
    },
  });

  await prisma.seller.upsert({
    where: { userId: owner.id },
    update: {},
    create: {
      organizationId: demo.id,
      storeId: loja.id,
      userId: owner.id,
      nome: owner.nome,
    },
  });

  // Adoção de dados órfãos: se existirem linhas anteriores ao multi-tenant sem
  // organização definida, elas passam a pertencer à organização padrão em vez
  // de serem descartadas. Em banco novo isso simplesmente não afeta nada.
  const adotados = await prisma.$executeRawUnsafe(
    `UPDATE customers SET organizationId = ? WHERE organizationId = '' OR organizationId IS NULL`,
    demo.id
  );

  console.log(`Organizações: ${alira.nome} (interna), ${demo.nome}`);
  console.log(`Loja: ${loja.nome}`);
  console.log(`Usuários: suporte@aliracrm.com.br (SUPER_ADMIN), ${owner.email} (OWNER)`);
  console.log(`Clientes adotados pela organização padrão: ${adotados}`);
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
