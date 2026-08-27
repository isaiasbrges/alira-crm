// Com prisma.config.ts presente, o Prisma deixa de carregar o .env sozinho —
// por isso o dotenv entra explicitamente aqui.
import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Configuração do Prisma.
 *
 * Substitui o bloco `prisma` do package.json, descontinuado e removido no
 * Prisma 7.
 *
 * A URL do banco não é declarada aqui de propósito: `datasource.url` com
 * `env()` é resolvido na hora de ler a config, o que faz `prisma generate`
 * exigir DATABASE_URL. No build da Vercel não há banco definido, e gerar o
 * client não precisa de um — então a URL fica onde sempre esteve, no
 * `env("DATABASE_URL")` do schema, resolvida só por quem de fato conecta.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
