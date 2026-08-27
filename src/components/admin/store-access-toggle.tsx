"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { alternarAcessoLojaAction } from "@/app/admin/[organizationId]/actions";
import { Switch } from "@/components/ui/switch";

export function StoreAccessToggle({
  storeId,
  ativa,
}: {
  storeId: string;
  ativa: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function alternar(checked: boolean) {
    startTransition(async () => {
      await alternarAcessoLojaAction(storeId, checked);
      router.refresh();
    });
  }

  return (
    <Switch
      checked={ativa}
      onCheckedChange={alternar}
      disabled={pending}
      aria-label={ativa ? "Desativar acesso à loja" : "Ativar acesso à loja"}
    />
  );
}
