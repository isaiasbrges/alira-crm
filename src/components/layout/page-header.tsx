export function PageHeader({
  titulo,
  descricao,
  children,
}: {
  titulo: React.ReactNode;
  descricao?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-foreground">
          {titulo}
        </h1>
        {descricao && <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>}
      </div>

      {children && <div className="flex shrink-0 items-center gap-3">{children}</div>}
    </div>
  );
}
