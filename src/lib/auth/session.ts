import "server-only";

import type { UserRole } from "@prisma/client";

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
 * Sessão de desenvolvimento.
 *
 * O login ainda não existe — é a próxima etapa. Enquanto isso, esta constante
 * mantém o app rodando sem banco e, mais importante, faz o resto do sistema
 * já consumir o formato definitivo: quando a autenticação real entrar, só
 * `getSession()` muda; nenhum repositório, action ou tela precisa ser tocado.
 */
const DEV_SESSION: Session = {
  user: {
    id: "usr_dev_owner",
    nome: "Isaias",
    email: "isaias@aliracrm.com.br",
    role: "OWNER",
    organizationId: "org_alira_demo",
  },
  organization: {
    id: "org_alira_demo",
    nome: "Alira Demo",
    slug: "alira-demo",
  },
  stores: [{ id: "store_principal", nome: "Loja Principal" }],
  activeStoreId: "store_principal",
};

/**
 * Lê a sessão do usuário autenticado.
 *
 * Substituição futura: validar o cookie de sessão, carregar o `User` com sua
 * `Organization` e as `Store` permitidas, e resolver a loja ativa a partir de
 * `user.ultimaStoreId`. A assinatura permanece a mesma.
 */
export async function getSession(): Promise<Session | null> {
  return DEV_SESSION;
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
