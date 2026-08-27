import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // Isolamento entre organizações.
  //
  // O client de "@/lib/prisma" enxerga o banco inteiro; o de "@/lib/tenant/db"
  // aplica o organizationId da sessão. Usar o primeiro por engano em uma tela
  // ou action vazaria dados entre empresas — então a regra é verificada pelo
  // lint, e não deixada a cargo de quem lembra dela na hora da revisão.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      // Onde o client cru nasce.
      "src/lib/prisma.ts",
      // O guard precisa do client cru: é ele que o embrulha.
      "src/lib/tenant/db.ts",
      // Organization é o próprio tenant e não tem organizationId para filtrar;
      // as consultas cross-tenant do painel master vivem ali, com checagem de
      // papel explícita.
      "src/repositories/organizations.ts",
      // A sessão nasce antes de existir organizationId para o guard aplicar:
      // é aqui que se descobre a quem o cookie pertence. O login também
      // precisa buscar o usuário pelo e-mail antes de saber a organização.
      "src/lib/auth/session.ts",
      "src/lib/auth/actions.ts",
      // Webhook inbound do n8n: quem chama não tem sessão de usuário, então
      // não há organizationId de contexto para o guard aplicar. A organização
      // vem do token da URL, verificado explicitamente aqui dentro.
      "src/repositories/whatsapp-webhook.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/prisma",
              message:
                "Use getTenantDb() de @/lib/tenant/db — o client cru não filtra por organização.",
            },
            {
              name: "@prisma/client",
              importNames: ["PrismaClient"],
              message:
                "Instanciar PrismaClient ignora o guard de tenancy. Use getTenantDb() de @/lib/tenant/db.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
