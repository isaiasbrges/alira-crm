import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { buscarLojaParaLogin, getSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/login-form";
import { LoginScreen } from "@/components/auth/login-screen";

export const metadata: Metadata = {
  title: "Entrar · Alira CRM",
};

/**
 * Atalho de login por loja — link fixo que uma loja pode deixar salvo no
 * terminal dela. Só pré-seleciona a loja na tela; a autenticação continua
 * sendo e-mail e senha normais (ver `loginAction`).
 *
 * Link inválido/de loja desativada não é erro: cai de volta pro login comum.
 */
export default async function LoginPorLojaPage({
  params,
}: PageProps<"/login/[storeId]">) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const { storeId } = await params;
  const loja = await buscarLojaParaLogin(storeId);

  return (
    <LoginScreen
      subtitulo={
        loja
          ? `Acesse com o e-mail e a senha da sua conta em ${loja.organizacaoNome}.`
          : "Acesse com o e-mail e a senha da sua conta."
      }
    >
      <LoginForm storeId={loja?.id} storeNome={loja?.nome} />
    </LoginScreen>
  );
}
