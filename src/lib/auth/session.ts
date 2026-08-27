import "server-only";

import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth/cookie";
import { verificarSessionToken } from "@/lib/auth/session-token";

/**
 * Sessão autenticada.
 *
 * É a ÚNICA origem legítima do organizationId. Nada que venha do navegador —
 * body, query string, header, props de componente — pode ser usado para
 * decidir de qual organização os dados serão lidos ou gravados.
 */
export type SessionUser = {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  organizationId: string;
};

export type SessionOrganization = {
  id: string;
  nome: string;
  slug: string;
};

export type SessionStore = {
  id: string;
  nome: string;
};

export type Session = {
  user: SessionUser;
  organization: SessionOrganization;
  /** Lojas da organização que este usuário pode acessar. */
  stores: SessionStore[];
  /** Loja ativa no momento. Sempre uma das listadas em `stores`. */
  activeStoreId: string;
};

/**
 * Lê a sessão do usuário autenticado.
 *
 * O cookie carrega só o essencial (userId, organizationId, activeStoreId),
 * assinado — nunca a sessão inteira. Usuário, organização e lojas são
 * recarregados do banco a cada leitura, então uma alteração de papel ou uma
 * loja desativada refletem na próxima requisição, sem esperar o cookie expirar.
 *
 * Usa o client cru do Prisma de propósito: aqui é onde o contexto de tenancy
 * nasce, então ainda não existe organizationId de sessão para o guard aplicar.
 */
export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const bruto = jar.get(SESSION_COOKIE)?.value;
  if (!bruto) return null;

  const payload = await verificarSessionToken(bruto);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      ativo: true,
      organizationId: true,
      organization: { select: { id: true, nome: true, slug: true, status: true } },
    },
  });

  if (!user || !user.ativo || user.organization.status !== "ATIVA") return null;
  // O token foi assinado para uma organização; se o usuário migrou de
  // organização depois, o token velho não vale mais.
  if (user.organizationId !== payload.organizationId) return null;

  const stores = await prisma.store.findMany({
    where: { organizationId: user.organizationId, ativa: true },
    select: { id: true, nome: true },
    orderBy: { nome: "asc" },
  });

  if (stores.length === 0) return null;

  const activeStoreId = stores.some((store) => store.id === payload.activeStoreId)
    ? payload.activeStoreId
    : stores[0].id;

  return {
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    },
    organization: user.organization,
    stores,
    activeStoreId,
  };
}

/**
 * Igual a `getSession`, mas trata a ausência de sessão como erro.
 *
 * Use em qualquer caminho que leia ou grave dados: falhar aqui é o
 * comportamento correto — seguir sem organização definida significaria
 * consultar o banco inteiro.
 */
export async function requireSession(): Promise<Session> {
  const session = await getSession();

  if (!session) {
    throw new Error("Sessão não encontrada. Autenticação é obrigatória.");
  }

  return session;
}
