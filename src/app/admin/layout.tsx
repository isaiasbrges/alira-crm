import { redirect } from "next/navigation";
import Link from "next/link";

import { logoutAction } from "@/lib/auth/actions";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";

/**
 * Painel master do time Alira — fora do AppShell do CRM de propósito.
 * SUPER_ADMIN não é dono de loja nenhuma, então não há workspace para montar
 * a sidebar de sempre; isso aqui atravessa organizações, não vive dentro de uma.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role !== "SUPER_ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="text-sm font-semibold">Painel master</span>
            <span className="text-xs text-muted-foreground">Alira</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {session.user.nome}
            </span>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm">
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
