import type { Metadata } from "next";

import { pdvEstaDesbloqueado } from "@/lib/auth/pdv-lock";
import { lojaAtivaPdv } from "@/repositories/pdv-lock";
import { listarOpcoesPdv } from "@/repositories/sales";
import { PdvLockScreen } from "@/components/sales/pdv/pdv-lock-screen";
import { PdvView } from "@/components/sales/pdv/pdv-view";

export const metadata: Metadata = {
  title: "PDV Lite · Alira CRM",
};

export default async function PdvPage() {
  const loja = await lojaAtivaPdv();

  if (loja.temSenha && !(await pdvEstaDesbloqueado(loja.id))) {
    return <PdvLockScreen lojaNome={loja.nome} />;
  }

  const { produtos, clientes, vendedores } = await listarOpcoesPdv();

  return (
    <PdvView produtos={produtos} clientes={clientes} vendedores={vendedores} />
  );
}
