"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Store as StoreIcon } from "lucide-react";

import { definirAcessoLojasAction } from "@/app/(crm)/configuracoes/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function StoreAccessDialog({
  userId,
  userNome,
  stores,
  accessIds,
}: {
  userId: string;
  userNome: string;
  stores: { id: string; nome: string }[];
  /** Nulo = sem restrição — todas marcadas por padrão ao abrir. */
  accessIds: string[] | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [marcadas, setMarcadas] = useState<Set<string>>(
    () => new Set(accessIds ?? stores.map((loja) => loja.id)),
  );

  function alternar(storeId: string, marcada: boolean) {
    setMarcadas((atual) => {
      const novo = new Set(atual);
      if (marcada) novo.add(storeId);
      else novo.delete(storeId);
      return novo;
    });
  }

  function salvar() {
    setErro(null);
    startTransition(async () => {
      const resultado = await definirAcessoLojasAction(userId, Array.from(marcadas));
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-1.5">
          <StoreIcon className="size-3.5" />
          {accessIds
            ? `${accessIds.length} de ${stores.length} lojas`
            : "Todas as lojas"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Acesso às lojas — {userNome}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            {stores.map((loja) => (
              <label
                key={loja.id}
                className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={marcadas.has(loja.id)}
                  onChange={(event) => alternar(loja.id, event.target.checked)}
                  className="size-4 rounded border-input accent-primary"
                />
                {loja.nome}
              </label>
            ))}
          </div>

          {erro && (
            <div className="flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              {erro}
            </div>
          )}

          <DialogFooter>
            <Button type="button" size="sm" onClick={salvar} disabled={pending}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
