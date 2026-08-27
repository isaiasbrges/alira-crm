import "server-only";

import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

/**
 * Trava de abertura do PDV — separada da sessão principal.
 *
 * Um cookie assinado por loja: destrancar a Loja Principal não destranca a
 * Loja B. Curta duração (8h) porque é uma trava de terminal compartilhado,
 * não uma sessão — o objetivo é impedir que qualquer um passando pelo caixa
 * abra o PDV, não substituir o login.
 */

const ALGORITMO = "HS256";
const DURACAO = "8h";
const MAX_AGE_SEGUNDOS = 60 * 60 * 8;
const PREFIXO_COOKIE = "alira_pdv_unlock_";

function segredo(): Uint8Array {
  const valor = process.env.SESSION_SECRET;
  if (!valor) {
    throw new Error(
      "SESSION_SECRET não configurado. Defina no .env — veja .env.example.",
    );
  }
  return new TextEncoder().encode(valor);
}

function nomeCookie(storeId: string): string {
  return `${PREFIXO_COOKIE}${storeId}`;
}

export async function desbloquearPdv(storeId: string): Promise<void> {
  const token = await new SignJWT({ storeId })
    .setProtectedHeader({ alg: ALGORITMO })
    .setIssuedAt()
    .setExpirationTime(DURACAO)
    .sign(segredo());

  const jar = await cookies();
  jar.set(nomeCookie(storeId), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEGUNDOS,
  });
}

export async function pdvEstaDesbloqueado(storeId: string): Promise<boolean> {
  const jar = await cookies();
  const bruto = jar.get(nomeCookie(storeId))?.value;
  if (!bruto) return false;

  try {
    const { payload } = await jwtVerify(bruto, segredo(), {
      algorithms: [ALGORITMO],
    });
    return payload.storeId === storeId;
  } catch {
    return false;
  }
}
