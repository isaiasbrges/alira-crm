import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Store as StoreIcon } from "lucide-react";

import { escolherLojaAction } from "@/lib/auth/actions";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Escolher loja · Alira CRM",
};

/**
 * Gate pós-login: só aparece quando a conta acessa mais de uma loja e o
 * login não veio de um link específico (`/login/[storeId]`) — aí a escolha
 * já era explícita. Fora desse momento (acesso direto à URL depois de já
 * ter escolhido) não força nada; o seletor da sidebar continua servindo
 * pra trocar de loja a qualquer momento.
 */
export default async function EscolherLojaPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.stores.length <= 1) redirect("/dashboard");

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex justify-center">
          <span className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-foreground">
              Alira
            </span>
            <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              CRM
            </span>
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-lg font-semibold">Qual loja você quer gerenciar?</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {session.user.nome}, você tem acesso a {session.stores.length}{" "}
            lojas de {session.organization.nome}.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {session.stores.map((loja) => (
              <form key={loja.id} action={escolherLojaAction}>
                <input type="hidden" name="storeId" value={loja.id} />
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:border-primary hover:bg-accent"
                >
                  {loja.logoUrl ? (
                    // Data URI ou URL arbitrária de upload — sem domínio fixo
                    // para o otimizador do next/image configurar.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={loja.logoUrl}
                      alt={loja.nome}
                      className="size-10 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-white">
                      <StoreIcon className="size-5" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {loja.nome}
                    </span>
                    {loja.id === session.activeStoreId && (
                      <span className="text-xs text-muted-foreground">
                        Última loja acessada
                      </span>
                    )}
                  </span>
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
