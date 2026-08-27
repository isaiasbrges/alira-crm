import "server-only";

import bcrypt from "bcryptjs";

const CUSTO = 10;

export async function hashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, CUSTO);
}

export async function verificarSenha(senha: string, hash: string): Promise<boolean> {
  return bcrypt.compare(senha, hash);
}
