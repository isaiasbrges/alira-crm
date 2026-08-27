"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/auth/cookie";
import { verificarSenha } from "@/lib/auth/password";
import { getSession, idsDeLojaPermitidos } from "@/lib/auth/session";
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
      role: true,
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

  // SUPER_ADMIN não opera loja — segue direto pro painel master, sem exigir
  // que a organização interna tenha uma loja cadastrada.
  if (user.role === "SUPER_ADMIN") {
    const token = await assinarSessionToken({
      userId: user.id,
      organizationId: user.organizationId,
      activeStoreId: null,
    });

    const jar = await cookies();
    jar.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);

    redirect("/admin");
  }

  // null = sem restrição (acessa toda loja ativa da organização).
  const permitidas = await idsDeLojaPermitidos(user.id, user.role);

  const lojasDisponiveis = await prisma.store.findMany({
    where: {
      organizationId: user.organizationId,
      ativa: true,
      ...(permitidas ? { id: { in: Array.from(permitidas) } } : {}),
    },
    select: { id: true },
    orderBy: { nome: "asc" },
  });

  if (lojasDisponiveis.length === 0) {
    return {
      erro: "Nenhuma loja disponível para este usuário. Fale com o suporte.",
    };
  }

  let activeStoreId =
    user.ultimaStoreId &&
    lojasDisponiveis.some((loja) => loja.id === user.ultimaStoreId)
      ? user.ultimaStoreId
      : lojasDisponiveis[0].id;

  // Login por link de loja (/login/[storeId]): o storeId vem escondido no
  // form. Só vale se estiver entre as lojas disponíveis pra esse usuário —
  // do contrário, é ignorado silenciosamente e o login segue pelo caminho
  // normal. Vindo do link, a escolha já é explícita: pula a tela de escolha.
  const storeIdDoLink = String(formData.get("storeId") ?? "").trim();
  const vindoDeLinkDeLoja =
    storeIdDoLink !== "" &&
    lojasDisponiveis.some((loja) => loja.id === storeIdDoLink);
  if (vindoDeLinkDeLoja) {
    activeStoreId = storeIdDoLink;
  }

  const token = await assinarSessionToken({
    userId: user.id,
    organizationId: user.organizationId,
    activeStoreId,
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);

  // Lembra a escolha feita pelo link pro próximo login (com ou sem link)
  // já abrir na loja certa — mesmo comportamento de trocarLojaAction.
  if (vindoDeLinkDeLoja) {
    await prisma.user.update({
      where: { id: user.id },
      data: { ultimaStoreId: activeStoreId },
    });
  }

  // Mais de uma loja disponível e o login não veio de um link específico:
  // pergunta qual loja gerenciar em vez de escolher por conta própria.
  if (!vindoDeLinkDeLoja && lojasDisponiveis.length > 1) {
    redirect("/escolher-loja");
  }

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

/**
 * Escolha feita na tela pós-login (`/escolher-loja`), mostrada quando a
 * conta acessa mais de uma loja e o login não veio de um link específico
 * (`/login/[storeId]`) — ali a escolha já era explícita.
 *
 * É `trocarLojaAction` com redirect: essa tela é uma página cheia, não um
 * componente já dentro do CRM, então o próximo passo é navegar de verdade.
 */
export async function escolherLojaAction(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const storeId = String(formData.get("storeId") ?? "");
  const lojaValida = session.stores.some((store) => store.id === storeId);
  if (!lojaValida) redirect("/escolher-loja");

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

  redirect("/dashboard");
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
  /** Preenchido quando a loja é criada — o link de acesso é montado a partir daqui. */
  novaLoja?: { id: string; nome: string };
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
    select: { id: true, nome: true },
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

  return { novaLoja };
}

const TIPOS_LOGO_ACEITOS = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);
const TAMANHO_MAXIMO_LOGO = 1.5 * 1024 * 1024; // 1,5 MB

export type AtualizarLogoState = {
  erro?: string;
};

/**
 * Salva a logo de uma loja como data URI direto na coluna `logoUrl`.
 *
 * Sem storage externo por ora: o arquivo cabe fácil no limite de 1,5 MB e o
 * `LONGTEXT` do banco aguenta de sobra. Se o volume de lojas crescer a ponto
 * de pesar, aí sim vale trocar por um bucket — não antes.
 */
export async function atualizarLogoLojaAction(
  _prevState: AtualizarLogoState,
  formData: FormData,
): Promise<AtualizarLogoState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const arquivo = formData.get("logo");
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { erro: "Selecione uma imagem." };
  }

  if (!TIPOS_LOGO_ACEITOS.has(arquivo.type)) {
    return { erro: "Formato não suportado. Use PNG, JPG, WEBP ou SVG." };
  }

  if (arquivo.size > TAMANHO_MAXIMO_LOGO) {
    return { erro: "Imagem muito grande. O limite é 1,5 MB." };
  }

  const storeId = String(formData.get("storeId") ?? session.activeStoreId);
  const buffer = Buffer.from(await arquivo.arrayBuffer());
  const logoUrl = `data:${arquivo.type};base64,${buffer.toString("base64")}`;

  const db = await getTenantDb();
  await db.store.update({
    where: { id: storeId },
    data: { logoUrl },
  });

  return {};
}

const HEX_VALIDO = /^#[0-9A-Fa-f]{6}$/;

export type AtualizarCorState = {
  erro?: string;
};

/**
 * Salva (ou remove, com `intent=remover`) a cor de destaque da loja. Aplica
 * em `--primary`, `--ring` e no item ativo da sidebar — ver `theme-color.ts`.
 */
export async function atualizarCorLojaAction(
  _prevState: AtualizarCorState,
  formData: FormData,
): Promise<AtualizarCorState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const storeId = String(formData.get("storeId") ?? session.activeStoreId);
  const db = await getTenantDb();

  if (String(formData.get("intent") ?? "") === "remover") {
    await db.store.update({ where: { id: storeId }, data: { corDestaque: null } });
    return {};
  }

  const cor = String(formData.get("cor") ?? "").trim();
  if (!HEX_VALIDO.test(cor)) {
    return { erro: "Cor inválida. Use o formato #RRGGBB." };
  }

  await db.store.update({
    where: { id: storeId },
    data: { corDestaque: cor.toUpperCase() },
  });

  return {};
}
