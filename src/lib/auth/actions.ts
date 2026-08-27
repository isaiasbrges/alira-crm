"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/auth/cookie";
import { verificarSenha } from "@/lib/auth/password";
import { getSession } from "@/lib/auth/session";
import { assinarSessionToken } from "@/lib/auth/session-token";
import { getTenantDb } from "@/lib/tenant/db";

export type LoginState = {
  erro?: string;
};

/**
 * Autentica por e-mail e senha e abre a sessão.
 *
 * Busca o usuário pelo e-mail antes de saber a organização — é por isso que
 * usa o client cru do Prisma (exceção registrada no ESLint) em vez de
 * `getTenantDb()`, que exige um contexto de tenancy que ainda não existe
 * neste ponto do fluxo.
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  if (!email || !senha) {
    return { erro: "Informe e-mail e senha." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      senhaHash: true,
      ativo: true,
      organizationId: true,
      ultimaStoreId: true,
      organization: { select: { status: true } },
    },
  });

  // Mesma mensagem para e-mail inexistente e senha errada: diferenciar
  // ajudaria alguém a descobrir quais e-mails têm conta.
  const credenciaisInvalidas = { erro: "E-mail ou senha incorretos." };

  if (!user || !user.ativo || user.organization.status !== "ATIVA") {
    return credenciaisInvalidas;
  }

  const senhaOk = await verificarSenha(senha, user.senhaHash);
  if (!senhaOk) return credenciaisInvalidas;

  const primeiraLoja = await prisma.store.findFirst({
    where: { organizationId: user.organizationId, ativa: true },
    select: { id: true },
    orderBy: { nome: "asc" },
  });

  if (!primeiraLoja) {
    return {
      erro: "Nenhuma loja ativa nesta organização. Fale com o suporte.",
    };
  }

  const activeStoreId = user.ultimaStoreId ?? primeiraLoja.id;

  const token = await assinarSessionToken({
    userId: user.id,
    organizationId: user.organizationId,
    activeStoreId,
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/login");
}

/**
 * Troca a loja ativa da sessão.
 *
 * Reemite o cookie com o novo activeStoreId e grava a escolha em
 * `User.ultimaStoreId`, para o próximo login já abrir na loja certa.
 */
export async function trocarLojaAction(storeId: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const lojaValida = session.stores.some((store) => store.id === storeId);
  if (!lojaValida) return;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { ultimaStoreId: storeId },
  });

  const token = await assinarSessionToken({
    userId: session.user.id,
    organizationId: session.organization.id,
    activeStoreId: storeId,
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
}

function gerarSlug(nome: string): string {
  return (
    nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "loja"
  );
}

export type CriarLojaState = {
  erro?: string;
};

/**
 * Cria uma loja na organização da sessão e a torna a loja ativa.
 *
 * O slug nasce do nome e ganha um sufixo numérico se colidir com uma loja
 * existente na mesma organização — a unicidade é por organização
 * (`@@unique([organizationId, slug])`), não global.
 */
export async function criarLojaAction(
  _prevState: CriarLojaState,
  formData: FormData,
): Promise<CriarLojaState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return { erro: "Informe o nome da loja." };
  if (nome.length > 80) return { erro: "Nome muito longo." };

  const db = await getTenantDb();
  const slugBase = gerarSlug(nome);

  const existentes = await db.store.findMany({
    where: { slug: { startsWith: slugBase } },
    select: { slug: true },
  });
  const slugsExistentes = new Set(existentes.map((loja) => loja.slug));

  let slug = slugBase;
  let sufixo = 2;
  while (slugsExistentes.has(slug)) {
    slug = `${slugBase}-${sufixo}`;
    sufixo += 1;
  }

  const novaLoja = await db.store.create({
    data: { organizationId: session.organization.id, nome, slug },
    select: { id: true },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { ultimaStoreId: novaLoja.id },
  });

  const token = await assinarSessionToken({
    userId: session.user.id,
    organizationId: session.organization.id,
    activeStoreId: novaLoja.id,
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);

  return {};
}
