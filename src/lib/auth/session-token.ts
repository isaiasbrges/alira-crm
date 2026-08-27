import "server-only";

import { jwtVerify, SignJWT } from "jose";

/**
 * Payload assinado dentro do cookie de sessão.
 *
 * Mínimo necessário para reconstruir o contexto de tenancy sem bater no
 * banco a cada requisição: quem é o usuário, de qual organização, e qual
 * loja está ativa. Papel e nome também entram para a sidebar não precisar
 * de uma segunda consulta só para se desenhar.
 *
 * `activeStoreId` é nulo para SUPER_ADMIN: o time Alira não é dono de loja
 * nenhuma, só enxerga o painel master entre organizações.
 */
export type SessionTokenPayload = {
  userId: string;
  organizationId: string;
  activeStoreId: string | null;
};

const ALGORITMO = "HS256";
/** A sessão expira e precisa logar de novo — não há refresh silencioso ainda. */
const DURACAO = "30d";

function segredo(): Uint8Array {
  const valor = process.env.SESSION_SECRET;
  if (!valor) {
    throw new Error(
      "SESSION_SECRET não configurado. Defina no .env — veja .env.example."
    );
  }
  return new TextEncoder().encode(valor);
}

export async function assinarSessionToken(payload: SessionTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALGORITMO })
    .setIssuedAt()
    .setExpirationTime(DURACAO)
    .sign(segredo());
}

export async function verificarSessionToken(
  token: string
): Promise<SessionTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, segredo(), { algorithms: [ALGORITMO] });

    if (
      typeof payload.userId !== "string" ||
      typeof payload.organizationId !== "string" ||
      (typeof payload.activeStoreId !== "string" && payload.activeStoreId !== null)
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      organizationId: payload.organizationId,
      activeStoreId: payload.activeStoreId,
    };
  } catch {
    // Assinatura inválida, token expirado ou corrompido: trata como deslogado.
    return null;
  }
}
