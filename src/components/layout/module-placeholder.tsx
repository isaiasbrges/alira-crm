import { Construction } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export function ModulePlaceholder({
  titulo,
  descricao,
  proximosPassos,
}: {
  titulo: string;
  descricao: string;
  proximosPassos: string[];
}) {
  return (
    <>
      <PageHeader titulo={titulo} descricao={descricao} />

      <Card className="items-center gap-4 px-6 py-16 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-secondary">
          <Construction className="size-5 text-muted-foreground" />
        </span>

        <div>
          <p className="text-sm font-medium">Módulo em desenvolvimento</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Esta área já está prevista na arquitetura e será liberada em uma próxima etapa.
          </p>
        </div>

        <ul className="mx-auto max-w-md space-y-1.5 text-left text-sm text-muted-foreground">
          {proximosPassos.map((passo) => (
            <li key={passo} className="flex gap-2">
              <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
              <span>{passo}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
