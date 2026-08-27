"use client";

import { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function StoreLoginLinkButton({ storeId }: { storeId: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    const url = `${window.location.origin}/login/${storeId}`;
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={copiar}
    >
      {copiado ? (
        <Check className="size-3.5" />
      ) : (
        <LinkIcon className="size-3.5" />
      )}
      {copiado ? "Copiado" : "Copiar link"}
    </Button>
  );
}
