import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/login-form";
import { LoginScreen } from "@/components/auth/login-screen";

export const metadata: Metadata = {
  title: "Entrar · Alira CRM",
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <LoginScreen subtitulo="Acesse com o e-mail e a senha da sua conta.">
      <LoginForm />
    </LoginScreen>
  );
}
